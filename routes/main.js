exports.restrict = true;

exports.get = function (req, res) {
  res.render('main', { user: req.session.user.username });
}
