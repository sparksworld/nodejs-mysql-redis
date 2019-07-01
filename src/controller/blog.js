const {
    exec,
    escape
} = require('../db/mysql')

const getBlogList = (listData) => {
    console.log(listData)
    let author = listData.author || ''
    let keyword = listData.keyword || ''
    let page = Number(listData.page) || 1
    let pageSize = Number(listData.pageSize) || 2

    let allsql = `select count(*) from blogs`
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author=:author `
    }
    if (keyword) {
        sql += `and title like :keyword `
    }
    sql += `order by createtime desc limit :start, :offset`
    /*  [author, `%${keyword}%` */
    return exec(allsql).then((res) => {
        return exec(sql, {
            author: author,
            keyword: `%${keyword}%`,
            start: (page - 1) * pageSize,
            offset: pageSize
        }).then((_res) => {
            return {
                list: _res,
                count: res[0]['count(*)'],
            }
        })
    })
}
const getBlogDetail = (id) => {
    let sql = `select * from blogs where id=:id`

    return exec(sql, {
        id: id
    }).then(data => {
        return data[0]
    })
    // return {
    //     id: 2,
    //     title: "这是一个标题B",
    //     author: "李四",
    //     content: "这是内容B",
    //     createTime: 1561084645362
    // }
}

const createBlog = (blogData) => {
    const title = blogData.title;
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    // let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', '${createtime}', '${author}');`
    let sql = `insert into blogs (title, content, createtime, author) values (:title, :content, :createtime, :author);`
    return exec(sql, {
        title: title,
        content: content,
        createtime: createtime,
        author: author
    }).then(data => {
        return {
            id: data.insertId
        }
    })
    /* 插入成功返回id */
    // return {
    //     id: 3
    // }
}
const updateBlog = (blogData) => {
    /* 更新成功返回id */
    const id = blogData.id
    const title = blogData.title
    const content = blogData.content

    let sql = `update blogs set title=:title, content=:content where id=:id`
    return exec(sql, {
        title: title,
        content: content,
        id: id
    }).then((data) => {
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })
    // return true
}
const deleteBolog = (id, author) => {
    let sql = `delete from blogs where id=:id and author=:author`
    return exec(sql, {
        id: id,
        author: author
    }).then(data => {
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })
    // return true
}



module.exports = {
    getBlogList,
    getBlogDetail,
    createBlog,
    updateBlog,
    deleteBolog
}