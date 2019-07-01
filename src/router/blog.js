const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    getBlogList,
    getBlogDetail,
    createBlog,
    updateBlog,
    deleteBolog
} = require('../controller/blog')

function loginCheck(req) {
    if (!req.userInfo.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}
const handleBlogRouter = function(req, res) {
    /* 获取博客列表 */
    // const id = req.query.id || ''
    if (req.method == "GET" && req.path == "/api/blog/list") {
        // const author = req.query.author
        // const keyword = req.query.keyword
        return getBlogList(req.query).then(result => {
            return new SuccessModel(result)
        })
        // const author = req.query.author || ''
        // const keyword = req.query.keyword || ''
        // return new SuccessModel()
    }
    /* 获取博客详情 */
    if (req.method == "GET" && req.path == "/api/blog/detail") {
        return getBlogDetail(req.body.id || -1).then(result => {
            return new SuccessModel(result)
        })
        // return new SuccessModel(getBlogDetail(id))
    }

    /* 新建博客 */
    if (req.method == "POST" && req.path == "/api/blog/new") {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        req.body.author = req.userInfo.username
        return createBlog(req.body).then(result => {
            if (result.id) {
                return new SuccessModel(result)
            } else {
                return new ErrorModel(result)
            }
        })
        // return new SuccessModel(createBlog(req.body || {}))
    }
    /* 更新博客 */
    if (req.method == "POST" && req.path == "/api/blog/update") {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        req.body.id = req.body.id ? req.body.id : -1
        return updateBlog(req.body).then(result => {
            if (result) {
                return new SuccessModel()
            }
            return new ErrorModel('操作失败')
        })
        // const result = updateBlog(req.body.id || '', req.body.blogData || '')
        // if (result) {
        //     return new SuccessModel()
        // } else {
        //     return new ErrorModel('更新失败')
        // }
    }
    /* 删除博客 */
    if (req.method == "POST" && req.path == "/api/blog/delete") {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        return deleteBolog(req.body.id || -1, req.userInfo.username).then(result => {
            if (result) {
                return new SuccessModel()
            }
            return new ErrorModel('操作失败')
        })
    }
}

module.exports = handleBlogRouter