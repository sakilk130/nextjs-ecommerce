import User from '../../models/User';
import data from '../../utils/data';
import db from '../../utils/db';

const handler = async (req: any, res: any) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await db.disconnect();
  res.status(200).send({ message: 'seeded successfully' });
};

export default handler;
