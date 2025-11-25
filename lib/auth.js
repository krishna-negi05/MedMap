// lib/auth.js
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = '7d';
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function findUserByEmail(email) {
  if (!email) return null;  
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function createUser({ email, password, name }) {
  if (!email || !password) throw new Error('email and password required');

  const existing = await findUserByEmail(email);
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: name ?? null,
      password: hashedPassword,
      role: 'user',
    },
  });

  return sanitize(user);
}

export async function verifyPassword(user, password) {
  if (!user?.password) return false;
  return bcrypt.compare(password, user.password);
}

export function generateJWT(user, extra = {}) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: extra.role || user.role || 'user',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export async function createResetTokenFor(email) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const token = crypto.randomBytes(24).toString('hex');
  const expiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });
  return { token, expiry, userId: user.id };
}

export async function consumeResetToken(token, newPassword) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
  if (!user) return null;
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
  return sanitize(updated);
}

export async function getUserById(id) {
  if (!id) return null;
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return null;
  return sanitize(u);
}

// Consolidated updateUser function with all fields
export async function updateUser(id, data) {
  const allowed = {};
  
  // Standard Profile Fields
  if (typeof data.name === 'string') allowed.name = data.name;
  if (typeof data.avatar === 'string') allowed.avatar = data.avatar;
  if (typeof data.year === 'number') allowed.year = data.year;
  
  // Preference Fields
  if (typeof data.theme === 'string') allowed.theme = data.theme;
  if (typeof data.mindmapDepth === 'number') allowed.mindmapDepth = data.mindmapDepth;
  if (typeof data.contentDensity === 'string') allowed.contentDensity = data.contentDensity;
  if (typeof data.defaultDifficulty === 'string') allowed.defaultDifficulty = data.defaultDifficulty;
  if (typeof data.autoProgress === 'boolean') allowed.autoProgress = data.autoProgress;
  if (typeof data.roadmapReminders === 'boolean') allowed.roadmapReminders = data.roadmapReminders;

  // If no valid fields were provided, return existing user without update
  if (Object.keys(allowed).length === 0) return getUserById(id);

  const updated = await prisma.user.update({ where: { id }, data: allowed });
  return sanitize(updated);
}

function sanitize(user) {
  if (!user) return null;
  const { password, resetToken, resetTokenExpiry, ...rest } = user;
  return rest;
}