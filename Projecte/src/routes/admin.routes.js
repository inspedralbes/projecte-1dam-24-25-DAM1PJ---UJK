// routes/admin.js
const express = require('express');
const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user && req.user.rol === 'administrador') {
    return next();
  }
  res.status(403).send('Accés denegat');
}

router.get('/control-panel', requireAdmin, (req, res) => {
  res.render('admin/control-panel', { user: req.user });
});

module.exports = router;
