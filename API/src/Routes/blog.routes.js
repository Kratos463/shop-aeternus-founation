const { Router } = require("express")
const {
    addBlog,
    getBlogById,
    getAllBlogs,
    deleteBlog,
    updateBlog
} = require("../Controllers/blog/blog.controller.js")
const { verifyAdminJWT } = require("../Middleware/admin.middleware.js")

const router = Router()

router.route("/addBlog").post(verifyAdminJWT, addBlog)
router.route("/getBlogDetails/:blogId").get(getBlogById)
router.route("/getBlogs").get(getAllBlogs)
router.route("/remove-blog/:blogId").delete(verifyAdminJWT, deleteBlog)
router.route("/update-blog/:blogId").patch(verifyAdminJWT, updateBlog)

module.exports = router