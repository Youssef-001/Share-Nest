function isAuth(req,res,next)
{
   if (req.isAuthenticated())
    next();

   else {
    res.error(400).send('UnAuthorized');
   }
}



module.exports = isAuth;