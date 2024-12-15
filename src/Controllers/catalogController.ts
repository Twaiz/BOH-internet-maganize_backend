//? Import ?\\
import { Catalog } from '../Models';
import { ApiFeatures, catchAsync } from '../Utils';

//? Public ?\\
// enum TypesRole {
//   USER = 'user',
//   EDITOR = 'editor',
//   ADMIN = 'admin',
// }

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string | undefined;
  role: 'user' | 'editor' | 'admin';
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

//? Get Catalogs *with Features* ?\\
const getCatalogs = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Catalog.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
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

export { getCatalogs, IUser };
