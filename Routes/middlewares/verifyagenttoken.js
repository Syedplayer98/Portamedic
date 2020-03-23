module.exports = function (req,res,next){
    if(!req.session.agentId){
        res.redirect('/login');
    }
    else{
        next();
    }
}