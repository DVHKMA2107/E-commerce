export default class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {}

    //this.query below is Product.find()
    this.query = this.query.find({ ...keyword })
    //this.query now is this.query.find().find({...keyword})
    return this
  }

  filter() {
    const queryCopy = { ...this.queryStr }

    //Remove some fields for category
    let removeField = ['keyword', 'page', 'limit']
    removeField.forEach((field) => delete queryCopy[field])

    //Filter price and rating
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

    //this.query below is this.query.find().find({...keyword})
    this.query = this.query.find(JSON.parse(queryStr))
    //this.query now is this.query.find().find({...keyword}).find(JSON.parse(queryStr))
    return this
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1

    const skipElement = resultPerPage * (currentPage - 1)

    this.query = this.query.skip(skipElement).limit(resultPerPage)

    return this
  }
}
