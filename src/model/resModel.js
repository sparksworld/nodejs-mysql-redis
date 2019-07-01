/* 封装公共返回的类 */

class BaseModel {
    constructor(data, message) {
        if (typeof data == "string") {
            this.message = data
            data = null
            message = null
        }
        if (data) this.data = data
        if (message) this.message = this.message
    }
}
/**
 * 成功 result： 1
 *
 * @class SuccessModel
 * @extends {BaseModel}
 */
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.result = 1
    }
}

/**
 * 失败 result: -1
 *
 * @class ErrorModel
 * @extends {BaseModel}
 */
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.result = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}