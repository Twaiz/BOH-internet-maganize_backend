//?Imports?\\
import express from 'express';
import { getCatalogs } from '../Controllers';

//?Routes?\\

const route = express.Router();
/* RCUD (CRUD):
//  1. Get products:
  // get products
  // get product with features
 2. Add product
 3. Update product
 4. Delete product
*/
route.route('/').get(getCatalogs);

//?Exports?\\
export { route as catalogRoute };
