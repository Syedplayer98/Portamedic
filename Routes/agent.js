const app = require('express').Router();
const Agent = require('../models/Agent');
const Case = require('../models/Case');
const bcrypt = require('bcryptjs');
const verifyAgentToken = require('./middlewares/verifyagenttoken');
const session = require('express-session');

app.get("/",async (req,res)=>{
    res.render("../views/Header.ejs");
});

app.get("/register",async (req,res)=>{
    res.render("../views/Signup.ejs");
});

app.get("/login",async (req,res)=>{
    res.render("../views/login.ejs",{ematch: true, match: true});
});

app.post('/register',async (req,res) => {

    const checkemail = await Agent.findOne({email:req.body.email});
    if(checkemail) return res.status(400).send('Email already exist');

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(req.body.password,salt);

    const agent = new Agent({
        name: req.body.name,
        AgencyName: req.body.AgencyName,
        InsuranceCompany: req.body.InsuranceCompany,
        PhoneNo: req.body.PhoneNo,
        email:req.body.email,
        password: hashedPw
    });

    try{
        const savedAgent= await agent.save();
        req.session.agentId = agent._id;
        res.redirect("/landing");
    }catch(err){
        res.status(400).send(err);
    }
});

app.post('/login',async (req,res) => {

    try{
        const agent = await Agent.findOne({email:req.body.email});
        if(!agent) return res.render("../views/login.ejs",{ematch: false, match: true});
    
        const checkPW = await bcrypt.compare(req.body.password,agent.password);
        if(!checkPW) return res.render("../views/login.ejs",{ematch: true, match: false});
        
        req.session.agentId = agent._id;
        res.redirect("/landing");
    }catch(err){
        res.status(400).send(err);
    }
});

app.get("/landing",verifyAgentToken,async (req,res)=>{
    let value1=0,value2=0,value3=0,value4=0;
    try{
        await Case.find({agentID:req.session.agentId}).countDocuments(function(err,count){
            value1 = count;
        });
        await Case.find({agentID:req.session.agentId,Status:'Pending'}).countDocuments(function(err, count){
            value2 = count;
        });
        await Case.find({agentID:req.session.agentId,Status:'Ongoing'}).countDocuments(function(err, count){
            value3 = count;
        });
        await Case.find({agentID:req.session.agentId,Status:'Completed'}).countDocuments(function(err, count){
            value4 = count;
            const results = {'value1':value1,'value2':value2,'value3':value3,'value4':value4};
            res.render("../views/Agent-landing.ejs",{results});
        });
        }
        catch(err){
            res.status(400).send(err);
        }
   
});

app.get('/profile',verifyAgentToken,async (req,res)=>{
    try{
    const agents =await Agent.find({_id:req.session.agentId});
    res.render("../views/profile.ejs",{agents});
    }
    catch(err){
    res.status(400).send(err);
    }

});

app.get('/editprofile', verifyAgentToken, async (req,res)=>{
    try{
        const profile = await Agent.find({_id:req.session.agentId});
        res.render("../views/Edit-profile.ejs",{profile});
    }
    catch(err){
        res.status(400).send(err);
    }
});

app.post('/editprofile', verifyAgentToken, async (req,res)=>{
    try{
        const updatedProfile= await Agent.findOneAndUpdate({_id:req.session.agentId},req.body,{new: true});
        res.redirect('/profile');
    }
    catch(err){
        res.status(400).send(err);
    }
});

app.post('/addcomment', verifyAgentToken, async (req,res)=>{
    try{
        const updatedProfile= await Agent.findOneAndUpdate({_id:req.session.agentId},req.body,{new: true});
        res.redirect('/landing');
    }
    catch(err){
        res.status(400).send(err);
    }
});

app.get('/changepass',verifyAgentToken,async (req,res)=>{
    try{
    res.render("../views/confirm_password.ejs");
    }
    catch(err){
    res.status(400).send(err);
    }

});

app.post('/changepass',verifyAgentToken,async (req,res)=>{

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(req.body.password,salt);
        const updatedPassword= await Agent.findOneAndUpdate({_id:req.session.agentId},{password:hashedPw},{new: true});
        res.redirect('/profile');

    }catch(err){
        res.status(400).send(err);
    }

 });


app.get('/logout',verifyAgentToken,async (req,res)=>{
    req.session.destroy(err =>{
        if(err){
            return res.redirect('/landing');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
});

module.exports = app;