var express = require('express');
var router = express.Router();
const Users = require("../controllers/user_tbl_controller.js");
const VerifyToken = require('../config/verifyToken');

/* Do Login. */
router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});

router.all('*', VerifyToken);

/* GET users listing. */
router.post('/', Users.create);

/* GET users listing. */
router.get('/', Users.findAll);

/* Generate Resend Code */
router.get('/resendCode', Users.resendCode);

/* Update User */
router.put('/:id', Users.update);

/* Delete User */
router.delete('/:id', Users.delete);

module.exports = router;
