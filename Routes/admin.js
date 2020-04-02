const app = require('express').Router();
const Admin = require('../models/Admin');
const Agent = require('../models/Agent');
const Case = require('../models/Case');
const bcrypt = require('bcryptjs');
const verifyAdminToken = require('./middlewares/verifyadmintoken');

app.get('/adminlogin', async (req, res) => {res.render("../views/adminlogin.ejs",{ematch: true, match: true});});

app.post('/adminlogin', async (req,res)=>{

    const admin = await Admin.findOne({email:req.body.email});
    if(!admin) return res.render("../views/adminlogin.ejs",{ematch: false, match: true});

    const checkpw = await bcrypt.compare(req.body.password,admin.password);
    if(!checkpw) return res.render("../views/adminlogin.ejs",{ematch: true, match: false});

    req.session.adminId = admin._id;
    res.redirect('/adminhome');
});

app.get('/adminhome',verifyAdminToken, async (req,res) => {
    let value1=0,value2=0,value3=0,value4=0;
    try{
        await Agent.find().countDocuments(function(err,count){
            value1 = count;
        });
        await Case.find().countDocuments(function(err,count){
            value2 = count;
        });
        await Case.find({Status:'Pending'}).countDocuments(function(err, count){
            value3 = count;
        });
        await Case.find({Status:'Completed'}).countDocuments(function(err, count){
            value4 = count;
            const results = {'value1':value1,'value2':value2,'value3':value3,'value4':value4};
            res.render("../views/adminhome.ejs",{results});
        });
        }
        catch(err){
            res.status(400).send(err);
        }
});

app.get('/adminchangepass',verifyAdminToken,async (req,res)=> {res.render("../views/admin_ChangePass.ejs")});

app.post('/adminchangepass',verifyAdminToken, async (req,res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(req.body.password,salt);
        const updatedPassword = await Admin.findOneAndUpdate({_id:req.session.adminId},{password:hashedPw},{new: true});
        res.redirect('/adminhome');
        }
        catch(err){
            res.status(400).send(err);
        }
});

app.get('/allagents',verifyAdminToken,async (req,res) =>{

    try{
        const allagents = await Agent.find();
        res.render("../views/admin_agentinfo.ejs",{allagents});
    }
    catch(err){
        res.status(400).send(err);
    }
});

app.get('/caseinfo',verifyAdminToken,async (req,res)=>{
    try{
        const cases =await Case.find().populate('agentID');
        res.render("../views/admin_caseinfo.ejs",{cases});
        }
        catch(err){
            res.status(400).send(err);
        }
});

app.get('/adminlogout',verifyAdminToken,async (req,res)=>{
    req.session.destroy(err =>{
        if(err){
            return res.redirect('/adminhome');
        }
        res.clearCookie('sid');
        res.redirect('/adminlogin');
    });
});


module.exports=app;