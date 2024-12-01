//?Imports?\\
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Catalog } from '../Models';

//?Connection?\\
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

//?Reader file?\\
const catalog = JSON.parse(
  fs.readFileSync(`${__dirname}/catalog.json`).toString(),
);

//?Function?\\
const ImportDataToDb = async () => {
  try {
    await Catalog.create(catalog);
    console.log('Data have been success created! 🚀');
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    console.log('Ooops...');
  }
};

//?Export?\\
export { ImportDataToDb };
