exports.get = function (req, res) {
  req.session.destroy();
  res.clearCookie('username');
  res.clearCookie('hash');
  res.redirect('login');
}
