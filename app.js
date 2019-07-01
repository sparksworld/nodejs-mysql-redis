const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring');
const {
    access
} = require('./src/utils/log')
const {
    get
} = require('./src/db/redis')
const { formatDate } = require('./src/utils/format')
const url = require('url');

// const redisSessionData = get('redisSessionData')
// redisSessionData
//     .then((res) => {
//         if (!res) {
//             set('redisSessionData', {})
//         }
//         set('redisSessionData', res)
//     })

/* 定义全局的session */
// let SESSION_DATA = {}

/* 获取cookie过期时间 */
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}
/**
 * 处理post请求数据
 *
 * @param {*} req
 * @returns
 */
const postDate = (req) => {
    var data = ''
    return new Promise((resolve, reject) => {
        if (req.method != "POST") {
            resolve({})
            return
        }
        // if (req.headers["content-type"] != "application/json") {
        //     resolve({})
        //     return
        // }
        /* 接收post请求数据 */
        req.on("data", chunk => {
            data += chunk.toString()
        })
        /* post数据接收完毕 */
        req.on('end', () => {
            if (!data) {
                resolve({})
                return
            }
            resolve(querystring.parse(data))
        })
    })
}


/**
 * 增加路由
 *
 * @param {*} req
 * @param {*} res
 */
const serveHandle = function(req, res) {
    /* 获取请求地址参数 */
    const cookies = {}
    const currentUrl = url.parse(req.url, true)
    res.setHeader('Content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    req.path = currentUrl.pathname
    req.href = req.headers.host + currentUrl.href
    req.query = currentUrl.query

    // if (req.method == "OPTIONS") {
    //     res.end()
    // }
    /* 解析cookie */
    ;
    // (req.headers.cookie || "").split(';').forEach(item => {
    //     let arr = item.split('=')
    //     let key = arr[0] && arr[0].trim()
    //     let val = arr[1] && arr[1].trim()
    //     cookies[key] = val
    // });
    // req.cookie = cookies


    /* 解析session */
    /* --------------------------------------------------------------- */
    // let needCookie = false
    // let userid = req.cookie.userid
    // if (userid) {
    //     if (!SESSION_DATA[userid]) {
    //         SESSION_DATA[userid] = {}
    //     }
    // } else {
    //     needCookie = true
    //     userid = `${Date.now()}_${Math.random().toString().slice(2)}`
    //     SESSION_DATA[userid] = {}
    // }
    // req.session = SESSION_DATA[userid]
    /* --------------------------------------------------------------- */
    /* 解析session(redis) */
    /* ---------------------------------------------------------------- */
    // let needCookie = false
    // let userId = req.cookie.userid
    // if (!userId) {
    //     needCookie = true
    //     userId = `${Date.now()}_${Math.random().toString().slice(2)}`
    //     set(userId, {})
    // }
    // req.sessionId = userId
    req.token = req.query.token || `${Date.now()}_${Math.random().toString().slice(2)}`
    get(req.token).then(userinfo => {
        /* 从redis查找 */
        if (userinfo) {
            req.userInfo = userinfo
        } else {
            req.userInfo = {}
        }
        return postDate(req)
    }).then(postData => {
        req.body = postData
        access(`(${formatDate(new Date().getTime())})  --  ${req.method}  --  ${req.path} --  ${req.headers['user-agent']}`)
        const blogData = handleBlogRouter(req, res)
        // if (blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }
        if (blogData) {
            blogData.then((data) => {
                // if (needCookie) {
                //     res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                // }
                res.end(
                    JSON.stringify(data)
                )
            })
            return
        }

        /* 博客相关路由 */
        // if (blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }
        /* user相关路由 */
        const userData = handleUserRouter(req, res)
        if (userData) {
            userData.then(data => {
                // if (needCookie) {
                //     res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                // }
                res.end(
                    JSON.stringify(data)
                )
            })
            return
            // res.end(
            //     JSON.stringify(userData)
            // )
            // return
        }

        /* 没有找到匹配路由之后的处理： 重写状态码与返回头 */
        res.writeHead(404, {
            "Content-type": "text/plan"
        })
        res.write("404 NOT FOUND\n")
        res.end()
    })
}




module.exports = serveHandle