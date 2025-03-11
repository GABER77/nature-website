class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    // Filtering
    const { page, limit, sort, fields, ...queryObj } = this.reqQuery;

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fields() {
    if (this.reqQuery.fields) {
      const selectedFields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const pageNumber = this.reqQuery.page * 1 || 1;
    const limitNumber = this.reqQuery.limit * 1 || 20;
    const skip = (pageNumber - 1) * limitNumber;

    this.query = this.query.skip(skip).limit(limitNumber);
    return this;
  }
}

module.exports = APIFeatures;
