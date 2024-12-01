import mongoose, { Schema } from 'mongoose';

type CategoryType =
  | 'onTheWall'
  | 'stationaryOnWheels'
  | 'recruitment'
  | 'inverters'
  | 'solarPanels'
  | 'switching'
  | 'components'
  | 'portableChargingStations'
  | 'energyStorageSystems';

interface IParams {
  capacity: string;
  current: string;
  voltage: string;
  power: string;
  phase: string;
  mppt: string;
  weight: string;
  amperage: string;
  size: string;
  length: string;
  standard: string;
  other: string;
  ip: string;
  stacking: string;
  quantity: string;
  strength: string;
  mobility: string;
  portability: string;
  dimensions: string;
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
  name: {
    type: String,
    required: [true, 'Product documention must have name'],
  },
  link: {
    type: String,
    required: [true, 'Product documention must have link'],
    validate: {
      validator: function (value: string) {
        try {
          new URL(value);
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      },
      message: 'Invalid URL format',
    },
  },
});

const paramsSchema = new Schema<IParams>({
  capacity: {
    type: String,
  },
  current: {
    type: String,
  },
  voltage: {
    type: String,
  },
  power: {
    type: String,
  },
  phase: {
    type: String,
  },
  mppt: {
    type: String,
  },
  weight: {
    type: String,
  },
  amperage: {
    type: String,
  },
  size: {
    type: String,
  },
  length: {
    type: String,
  },
  standard: {
    type: String,
  },
  other: {
    type: String,
  },
  ip: {
    type: String,
  },
  stacking: {
    type: String,
  },
  quantity: {
    type: String,
  },
  strength: {
    type: String,
  },
  mobility: {
    type: String,
  },
  portability: {
    type: String,
  },
  dimensions: {
    type: String,
  },
});

const catalogSchema = new Schema<ICatalog>(
  {
    title: {
      type: String,
      required: [true, 'Product must have title'],
      unique: true,
    },
    image: {
      type: String,
    },
    hit: {
      type: Boolean,
      default: false,
    },
    params: {
      type: paramsSchema,
      required: [true, 'Product must have params'],
    },
    documentation: {
      type: [documentationSchema],
      default: [],
    },
    price: {
      type: String,
      required: [true, 'Product must have price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Product must have category'],
      enum: [
        'onTheWall',
        'stationaryOnWheels',
        'recruitment',
        'inverters',
        'solarPanels',
        'switching',
        'components',
        'portableChargingStations',
        'energyStorageSystems',
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Catalog = mongoose.model('Catalog', catalogSchema);

export { Catalog };
