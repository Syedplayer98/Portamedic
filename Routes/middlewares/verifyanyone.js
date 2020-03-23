module.exports = function (req,res,next){
    if(req.session.agentId  || req.session.adminId){
        next();
    }
    else{
        
        res.redirect('/login');
    }
}