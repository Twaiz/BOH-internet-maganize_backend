//?Imports?\\
import express from 'express';

const route = express.Router();

//?Routes?\\
/* RCUD (CRUD):
1. Get products
 2. Add product
 3. Update product
 4. Delete product
*/
route.route('/').get();

//?Exports?\\
export { route as catalogRoute };
