const mysql = require('mysql')

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'graduation_design'

});

module.exports = sql => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        });
    })
}