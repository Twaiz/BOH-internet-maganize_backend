import { Query } from 'mongoose';
import { ParsedQs } from 'qs';

class ApiFeatures {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryValue: Query<any, any>;
  queryParametrs: ParsedQs;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryValue: Query<any, any>,
    queryParametrs: ParsedQs,
  ) {
    this.queryValue = queryValue;
    this.queryParametrs = queryParametrs;
  }

  filter() {
    const queryObj = { ...this.queryParametrs };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.queryValue = this.queryValue.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryParametrs['sort']) {
      const sortBy = this.queryParametrs['sort']
        ?.toString()
        .split(',')
        .join(' ');

      this.queryValue = this.queryValue.sort(sortBy);
      return this;
    }

    return this;
  }

  fields() {
    if (this.queryParametrs['fields']) {
      const queryStr = this.queryParametrs['fields']
        .toString()
        .split(',')
        .join(' ');
      this.queryValue = this.queryValue.select(queryStr);
    } else {
      this.queryValue = this.queryValue.select('-__v');
    }

    return this;
  }
}

export { ApiFeatures };
