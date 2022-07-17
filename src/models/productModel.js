import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter product Description'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Price cannot exceed 8 charactors'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please enter product category'],
  },
  Stock: {
    type: Number,
    required: [true, 'Please enter product Stock'],
    maxLength: [4, 'Stock cannot exceed 4 charactors'],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  review: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const ProductModel = mongoose.model('Product', productSchema)
