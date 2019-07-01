const {
    exec
} = require('../db/mysql')
const {
    COMPARE
} = require('../utils/bcrypt')

const login = (username, password) => {
    let sql = `select username, password, realname from users where username=:username;`

    return exec(sql, {
        username: username
    }).then(data => {
        if (data.length > 0) {
            return COMPARE(password, data[0].password)
        } else {
            return false
        }
    })
}
const register = (registerData) => {
    let sql = `insert into users (username, password, realname) values (:username, :password, :realname);`

    return exec(sql, {
        username: registerData.username,
        password: registerData.password,
        realname: registerData.realname
    }).then(data => {
        return {
            id: data.insertId
        }
    }).catch(({
        sql,
        ...data
    }) => {
        return data
    })
}

const changepw = (username, newpw) => {
    let sql = `update users set password=:password where username=:username`

    return exec(sql, {
        password: newpw,
        username: username
    }).then((data) => {
        if (data.affectedRows > 0) {
            return true
        }
        return false
    }).catch(({
        sql,
        ...data
    }) => {
        return data
    })
}

// const comparepw = (username, password) => {
//     let sql = `select password from users where username='${username}'`
//     return exec(sql).then((data) => {
//         if (data.affectedRows > 0) {
//             return COMPARE(password, data[0].password)
//         }
//         return false
//     })
// }

module.exports = {
    login,
    register,
    changepw
}