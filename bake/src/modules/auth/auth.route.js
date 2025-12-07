const express = require('express');
const router = express.Router();

const validate = require('../../middleware/validate.middleware');
const { register, login, me } = require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.validation');

const auth = require('../../middleware/auth.middleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, me);

module.exports = router;
