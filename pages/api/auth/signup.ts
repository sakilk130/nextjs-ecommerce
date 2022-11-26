import bcryptjs from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({ message: 'Invalid input.' });
    return;
  }
  await db.connect();

  const existingUser = await User.findOne({
    email: email,
  }).lean();
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await db.disconnect();
    return;
  }
  const user = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });
  await user.save();
  await db.disconnect();

  res.status(201).send({
    message: 'Created user!',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;
