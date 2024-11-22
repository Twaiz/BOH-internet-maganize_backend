import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', error => {
  console.log('UNCAUGHTEXCEPTION! 💥', error);
  console.log(error.name, error.message);
  process.exit(1);
});

//*====================================================================?*\\
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('DB CONNECTION SUCCESS ✅!'))
  .catch(error => console.log(error));

//*====================================================================?*\\
import { app } from './app';

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

process.on('unhandledRejection', (error: unknown) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  if (error instanceof Error) {
    console.log(error.name, error.message);
  }
  server.close(() => {
    process.exit(1);
  });
});
