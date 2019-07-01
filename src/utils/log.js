const {
    createWriteStream
} = require('fs')
const {
    join
} = require('path')


const writeStream = function(filename) {
    const fullFileName = join(__dirname, '../', '../', 'logs', filename)
    const stream = createWriteStream(fullFileName, {
        flags: 'a' /* append的简写，’w‘是重写 */
    })
    return stream
}

/* 写访问日志 */
const accessWriteStream = writeStream('access.log')

const access = (log) => {
    accessWriteStream.write(log + '\n')
}


module.exports = {
    access
}