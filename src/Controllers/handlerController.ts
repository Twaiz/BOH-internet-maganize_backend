import { Model } from 'mongoose';
import { catchAsync, AppError, ApiFeatures } from '../Utils';

const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params['id']);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params['id'], req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOne = <T>(Model: Model<T>, popOptions?: any) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params['id']);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req, res) => {
    // let filter = {};
    // if (req.params['userId']) filter = { tour: req.params['userId'] };

    const filter = {};

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();
    const doc = await features.queryValue;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

const factory = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};

export { factory };
