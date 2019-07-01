const bcrypt = require('bcrypt')

const ADD_SALT = (character) => {
    return bcrypt.genSalt(10).then(saltValue => {
        return bcrypt.hash(character, saltValue).then(res => {
            return res
        })
    })
    // return new Promise((resolve, reject) => {
    //     bcrypt.genSalt(10, function(err, salt) {
    //         if (err) {
    //             reject(err)
    //             return
    //         }
    //         bcrypt.hash(character, salt, function(err, hash) {
    //             if (err) {
    //                 reject(err)
    //                 return
    //             }
    //             resolve(hash)
    //         });
    //     });
    // })
}

const COMPARE = (req_value, sql_value) => {
    return bcrypt.compare(req_value, sql_value).then(res => {
        return res
    })
    // return new Promise((resolve, reject) => {
    //     bcrypt.compare(req_value, sql_value, function(err, res) {
    //         if (err) {
    //             reject(err)
    //             return
    //         }
    //         resolve(res)
    //     });
    // })
}
// $2b$10$WoIfVVCkH0wiXaxFLYhJ6OZG9.fJPtaQy3LuIE8jWBgfGPMxG04YW

const CREATE_HASH = (character) => {
    return bcrypt.hash(character, 10).then(res => {
        return res
    });
}

module.exports = {
    ADD_SALT,
    COMPARE,
    CREATE_HASH
}