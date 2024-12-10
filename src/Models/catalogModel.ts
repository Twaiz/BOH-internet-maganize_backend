import mongoose, { Schema } from 'mongoose';

enum CategoryType {
  ON_THE_WALL = 'onTheWall',
  STATIONARY_ON_WHEELS = 'stationaryOnWheels',
  RECRUITMENT = 'recruitment',
  INVERTERS = 'inverters',
  SOLAR_PANELS = 'solarPanels',
  SWITCHING = 'switching',
  COMPONENTS = 'components',
  PORTABLE_CHARGING_STATIONS = 'portableChargingStations',
  ENERGY_STORAGE_SYSTEMS = 'energyStorageSystems',
}

interface IParams {
  [key: string]: string; //? Подразумевается, что тут всегда будет string! ?\\
}

interface IDocumentation {
  name: string;
  link: string;
}

interface ICatalog {
  title: string;
  image?: string;
  hit: boolean;
  params: IParams;
  documentation: IDocumentation[];
  price: string;
  category: CategoryType;
}

const documentationSchema = new Schema<IDocumentation>({
  name: { type: String, required: true },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid URL format',
    },
  },
});

const paramsSchema = new Schema<IParams>({}, { _id: false });

const catalogSchema = new Schema<ICatalog>(
  {
    title: { type: String, required: true, unique: true },
    image: { type: String },
    hit: { type: Boolean, default: false },
    params: { type: paramsSchema, required: true },
    documentation: { type: [documentationSchema], default: [] },
    price: { type: String, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: Object.values(CategoryType),
    },
  },
  { timestamps: true },
);

const Catalog = mongoose.model<ICatalog>('Catalog', catalogSchema);

export { Catalog, CategoryType };
