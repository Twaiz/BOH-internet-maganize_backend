//? Import ?\\
import { Catalog } from '../Models';
import { catchAsync } from '../Utils';

//? Public ?\\

//? Get Catalogs *with Features* ?\\
const getCatalogs = catchAsync(async (_req, res) => {
  const catalogs = await Catalog.find();

  res.status(200).json({
    status: 'success',
    message: 'Tours has been success findeds',
    results: catalogs.length,
    data: {
      catalogs,
    },
  });
});

//? Private ?\\

//? Added Product, Products in DB ?\\
//? Update Product in DB ?\\
//? Delete Product, Products in DB ?\\

export { getCatalogs };
