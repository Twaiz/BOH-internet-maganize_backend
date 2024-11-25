//? Imports ?\\
import fs from 'fs';
import { Catalog } from '@/Models';

//? Reader file ?\\
const catalogReader = fs
  .readFileSync(`${__dirname}/../../../data/catalog.json`)
  .toString();
const catalog = JSON.parse(catalogReader);

//? Function ?\\
const ImportDataToDb = async () => {
  try {
    await Catalog.createCollection(catalog);
    console.log('Data have been success created! 🚀');
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    console.log('Ooops...');
  }
};

//? Export ?\\
export { ImportDataToDb };
