module.exports = function (req,res,next){
    if(!req.session.adminId){
        res.redirect('/adminlogin');
    }
    else{
        next();
    }
}