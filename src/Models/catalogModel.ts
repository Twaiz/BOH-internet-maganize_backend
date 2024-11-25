import mongoose, { Schema } from 'mongoose';

interface IParams {
  capacity: string;
  current: string;
  voltage: string;
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
}

const documentationSchema = new Schema<IDocumentation>({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
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
    required: true,
  },
  current: {
    type: String,
    required: true,
  },
  voltage: {
    type: String,
    required: true,
  },
});

const catalogSchema = new Schema<ICatalog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    hit: {
      type: Boolean,
      default: false,
    },
    params: {
      type: paramsSchema,
      required: true,
    },
    documentation: {
      type: [documentationSchema],
      default: [],
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

catalogSchema.index({ title: 1 });
catalogSchema.index({ price: 1 });

const Catalog = mongoose.model('Catalog', catalogSchema);

export { Catalog };
