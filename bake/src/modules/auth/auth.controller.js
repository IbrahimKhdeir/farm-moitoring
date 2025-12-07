const { registerService, loginService, getProfile } = require('./auth.service');
const { success, error } = require('../../core/utils/response');

async function register(req, res) {
  try {
    const user = await registerService(req.body);
    success(res, user, 'User registered');
  } catch (err) {
    error(res, err.message);
  }
}

async function login(req, res) {
  try {
    const token = await loginService(req.body);
    success(res, { token }, 'Login successful');
  } catch (err) {
    error(res, err.message);
  }
}

async function me(req, res) {
  try {
    const user = await getProfile(req.userId);
    success(res, user, 'User profile');
  } catch (err) {
    error(res, err.message);
  }
}

module.exports = { register, login, me };
