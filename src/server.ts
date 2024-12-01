import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', error => {
  console.log('UNCAUGHTEXCEPTION! 💥', error);
  console.log(error.name, error.message);
  process.exit(1);
});

//*====================================================================?*\\
dotenv.config({ path: './config.env' });

const dbURL = process.env['DATABASE_URL'];
if (!dbURL) {
  console.log('DB_URL is not defined.');
  process.exit(1);
}

mongoose
  .connect(dbURL)
  .then(() => console.log('DB CONNECTION SUCCESS ✅!'))
  .catch(error => console.log(error));

//*====================================================================?*\\
import { app } from './app';
import { ImportDataToDb } from './data/ImportDataToDB';

const processEnvPORT = process.env['PORT'];
const PORT = processEnvPORT ? processEnvPORT : 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

ImportDataToDb();

process.on('unhandledRejection', (error: unknown) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  if (error instanceof Error) {
    console.log(error.name, error.message);
  }
  server.close(() => {
    process.exit(1);
  });
});
