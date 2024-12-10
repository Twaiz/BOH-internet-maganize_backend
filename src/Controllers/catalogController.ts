//? Import ?\\
import { Catalog } from '../Models';
import { ApiFeatures, catchAsync } from '../Utils';

//? Public ?\\

//? Get Catalogs *with Features* ?\\
const getCatalogs = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Catalog.find(), req.query)
    .filter()
    .sort()
    .fields();
  const catalogs = await features.queryValue;

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
