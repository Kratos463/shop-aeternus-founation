const { asyncHandler } = require('../../utils/asyncHandler.js')
const { ApiError } = require('../../utils/apiError.js')
const { ApiResponse } = require('../../utils/apiResponse.js');
const Blog = require("../../Models/blog.model.js")

const addBlog = asyncHandler(async (req, res) => {

})

const getAllBlogs = asyncHandler(async (req, res) => {

})

const getBlogById = asyncHandler(async (req, res) => {

})

const deleteBlog = asyncHandler(async(req, res)=> {

})

const updateBlog = asyncHandler(async (req, res)=> {

})

module.exports = {  
    addBlog,
    getAllBlogs,
    getBlogById,
    deleteBlog,
    updateBlog
}