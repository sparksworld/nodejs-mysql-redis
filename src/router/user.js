const md5 = require('md5')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    login,
    register,
    changepw
} = require('../controller/user')
const {
    set
} = require('../db/redis')
const {
    ADD_SALT
} = require('../utils/bcrypt')


const handleUserRouter = (req, res) => {
    if (req.method == "POST" && req.path == "/api/user/login") {
        const {
            username,
            password
        } = req.body
        return login(username, password).then(result => {
            if (result) {
                const token = md5(`username=${username}&password=${password}&${Date.now()}`)
                set(token, {
                    username: username
                }, 'EX', 24 * 60 * 60)
                return new SuccessModel({
                    token: token
                })
            } else {
                return new ErrorModel("登录失败")
            }
        })
    }
    if (req.method == "POST" && req.path == "/api/user/register") {
        if (req.body.username && req.body.password && req.body.realname) {
            return ADD_SALT(req.body.password)
                .then(res => {
                    req.body.password = res
                    return register(req.body)
                })
                .then(result => {
                    if (result.id) {
                        return new SuccessModel(result)
                    } else {
                        return new ErrorModel(result)
                    }
                })
        }
        return Promise.resolve(
            new ErrorModel('缺少参数')
        )
    }

    if (req.method == "POST" && req.path == "/api/user/changepw") {
        let {
            username,
            oldpassword,
            newpassword
        } = req.body
        if (username && oldpassword && newpassword) {
            return login(username, oldpassword)
                .then(result => {
                    if (result) {
                        return ADD_SALT(newpassword)
                            .then(saltpw => {
                                return changepw(username, saltpw)
                                    .then(res => {
                                        if (res) {
                                            return new SuccessModel('更新成功')
                                        } else {
                                            return new SuccessModel('更新失败')
                                        }
                                    })
                                    .catch(err => {
                                        return new ErrorModel(err)
                                    })
                            })
                    } else {
                        return new ErrorModel('原始密码错误')
                    }
                })
        } else {
            return Promise.resolve(
                new ErrorModel('缺少参数')
            )
        }
    }
    // if (req.method == "GET" && req.path == "/api/user/login-test") {
    //     if(req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             ...req.session
    //         }))
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录'))
    // }
}
// bcrypt.compare('test123456', '$2b$10$nz7VeiiZvxDv/FowTHvYjeoG6CpdiLm0komvGkqC9/..C799jyJD', (err, res) => {
//     console.log(res)
// })

module.exports = handleUserRouter