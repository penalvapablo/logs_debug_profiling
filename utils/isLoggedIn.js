module.exports = function isLoggedIn(req, res, next) {
  if (!req.session.mail) {
    res.redirect('/login');
    return;
  }
  next();
};
