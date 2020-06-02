const app = require('express').Router();
const Case = require('../models/Case');
const verifyAgentToken = require('./middlewares/verifyagenttoken');
const verifyAdminToken = require('./middlewares/verifyadmintoken');
const verifyAnyone = require('./middlewares/verifyanyone');

app.get("/caseinput",async (req,res)=>{
    res.render("../views/case-input.ejs");
});

app.get("/caseview",verifyAgentToken,async (req,res)=>{
    try{
        const cases =await Case.find({agentID:req.session.agentId});
        res.render("../views/view-case.ejs",{cases});
        }
        catch(err){
        res.status(400).send(err);
        }
});

app.get('/pendingcases',verifyAdminToken,async (req,res)=>{
    try{
        const pendingcases =await Case.find({Status:'Pending'}).populate('agentID');
        res.render("../views/PendingCases",{pendingcases});
        }
        catch(err){
            res.status(400).send(err);
        }
});

app.get('/ongoingcases',verifyAdminToken,async (req,res)=>{
    try{
        const ongoingcases =await Case.find({Status:'Ongoing'}).populate('agentID');
        res.render("../views/OnGoingCases.ejs",{ongoingcases});
        }
        catch(err){
            res.status(400).send(err);
        }
});

app.get('/completedcases',verifyAdminToken,async (req,res)=>{
    try{
        const completedcases =await Case.find({Status:'Completed'}).populate('agentID');
        res.render("../views/CompletedCases.ejs",{completedcases});
        }
        catch(err){
            res.status(400).send(err);
        }
});


app.post('/add',verifyAgentToken,async (req,res)=> {

    const checkAddress = await Case.findOne({Address:req.body.Address});
    const checkPhoneNo = await Case.findOne({PhoneNo:req.body.PhoneNo});
    if(checkAddress  && checkPhoneNo ) return res.status(400).send("Case already filled");
    
    const clientCase = new Case({
        agentID:req.session.agentId,
        name1:req.body.name1,
        name2:req.body.name2,
        DOB:req.body.DOB,
        Policy:req.body.Policy,
        Amount:req.body.Amount,
        Address:req.body.Address,
        PhoneNo:req.body.PhoneNo,
        ScheduledDate:req.body.ScheduledDate,
        Time:req.body.Time,
        AgentComment:req.body.AgentComment,
        AdminComment:req.body.AdminComment,
        value1:req.body.value1,
        value2:req.body.value2,
        value3:req.body.value3,
        value4:req.body.value4,
        value5:req.body.value5,
        Status:req.body.Status
    });

    try{
        const savedCase = await clientCase.save();
        res.redirect('/landing');
    }catch(err){
        res.status(400).send(err);
    }
});

app.get('/:id',verifyAnyone,async (req,res)=>{
    try{
        const clientCase =await Case.findById(req.params.id);
        if(req.session.agentId)
        res.render("../views/case-display.ejs", {clientCase});
        else if (req.session.adminId)
        res.render("../views/admin_view_case.ejs",{clientCase});
        }
        catch(err){
            res.status(400).send(err);
        }
});

app.post('/:id', verifyAnyone , async (req,res)=>{
    try{
        if(req.session.agentId)
        {
        await Case.findOneAndUpdate({_id:req.params.id},{AgentComment:req.body.AgentComment},{new: true});
        res.redirect('/'+req.params.id);
        }
        else if (req.session.adminId)
        {
            if(req.body.Checker == '1')
            {
                try
                {
                    await Case.findOneAndUpdate({_id:req.params.id},{Status:req.body.Status},{new: true});
                }
                catch(err){
                res.status(400).send(err);
                }
              
            }
            else
            {
                try
                {
                    await Case.findOneAndUpdate({_id:req.params.id},{AdminComment:req.body.AdminComment},{new: true});
                }
                catch(err){
                res.status(400).send(err);
                }
            }
       
        res.redirect('/caseinfo');
        }
        res.redirect('/');
    }
    catch(err){
        res.status(400).send(err);
    }
   
});

app.put('/:id',verifyAgentToken,async (req,res)=>{

    try{
        const updatedCase= await Case.findOneAndUpdate({_id:req.params.id},req.body,{new: true});
        res.redirect('/landing');

    }catch(err){
        res.status(400).send(err);
    }

 });

 app.delete('/:id',verifyAgentToken,async (req,res)=>{
     try{
        const clientcase =await Case.findByIdAndDelete(req.params.id);
        res.send("Case Deleted");
        }
        catch(err){
            res.status(400).send("Case doesn't exist");
     }
 });

 module.exports= app;