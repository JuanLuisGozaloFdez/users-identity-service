const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-prod';

// In-memory user store (replace with DB later)
const users: Array<{ id: string; email: string; password: string; createdAt: string }> = [];

export const register = async (email: string, password: string) => {
  // Check if user exists
  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error('User already exists');

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  return { id: user.id, email: user.email, createdAt: user.createdAt };
};

export const login = async (email: string, password: string) => {
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    const user = users.find((u) => u.id === decoded.userId);
    if (!user) throw new Error('User not found');

    const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return { accessToken };
  } catch {
    throw new Error('Invalid refresh token');
  }
};

export const getUser = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  return { id: user.id, email: user.email, createdAt: user.createdAt };
};
