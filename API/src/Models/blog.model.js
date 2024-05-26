const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', 
      required: true,
      index: true, 
    },
    title: {
      type: String,
      required: [true, 'Title is required'], 
      trim: true, 
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/.test(v);
          },
          message: props => `${props.value} is not a valid image URL!`,
        },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.models.blog || mongoose.model('blog', blogSchema);

module.exports = Blog;
