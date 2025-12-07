const prisma = require('../../database/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/env');


async function registerService({ username, email, password }) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { username, email, password: hash } });
}

async function loginService({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  return jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' });
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, role: true, profile: true }
  });
  if (!user) throw new Error('User not found');
  return user;
}

module.exports = { registerService, loginService, getProfile };
