const pg = require('pg');

const path = require('path');

const DB = require(path.resolve('./config/database'));

const Promise = require('bluebird');

const connect = function () {

    const _this = this;

    _this.asyncQuery = async (sql, data = "") => {

        return await new Promise((resolve, reject) => {

            _this.connection.connect((err, connection) => {

                if (err) {

                    reject(err);

                } else {

                    if (data && data.length > 0) {
                        let rs = _this.replace(sql, data);
                        sql = rs.sql;
                        data = rs.data;
                    }

                    try {
                        connection.query(sql, data, (err, result) => {
                            connection.release();
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result.command == 'SELECT' ? result.rows : result);
                            }
                        })
                    }
                    catch (error) {
                        console.log(error);
                    }

                }

            })
        });
    }
    /** 
        * *Docs asyncQueryPool
        * 1. create connect Pool controller: const conn = req.module.connection.connect();
        * 2. create transaction controller: let createTransaction = await _module.createTransaction(conn);
        * 3. create function createTransaction module: return await req.module.asyncQueryPool(conn,sql,data);
        * 4. end transaction: 'COMMIT' OR 'ROLLBACK'
        * 5. end connect Pool controller: conn.release()
    */
    _this.asyncQueryPool = async (conn, sql, data = "") => {

        return await new Promise((resolve, reject) => {

            if (data && data.length > 0) {
                let rs = _this.replace(sql, data);
                sql = rs.sql;
                data = rs.data;
            }

            try {
                conn.query(sql, data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.command == 'SELECT' ? result.rows : result);
                    }
                })
            }
            catch (error) {
                console.log(error);
            }
        })
    }

    _this.asyncQueryMultiple = async (sql, data = "") => {

        let splitSQL = sql.split(';');

        let result = [];

        for (let i = 0; i < splitSQL.length; i++) {

            let item = await _this.asyncQuery(splitSQL[i], data);

            result.push(item);
        }

        return result;
    }

    _this.release = () => {

        if (_this.connection) {

            _this.connection.release();

        }
    }

    _this.replace = (sql, data) => {

        let isInsert = sql.includes('INSERT');

        let isUpdate = sql.includes('UPDATE');

        if (isInsert) {

            let temp = sql.split('$');

            if (temp.length > 0) {

                if (typeof data[0] == 'object') {

                    delete data[0]['id'];

                    let keys = Object.keys(data[0]);
                    let values = '';

                    for (let i = 0; i < keys.length; i++) {
                        values += '$' + (i + 1);
                        keys[i] = '"' + keys[i] + '"';
                        if (i < keys.length - 1) { values += ', '; }
                    }

                    sql = sql.split('SET')[0] + ' ' + "(" + keys + ") VALUES (" + values + ") RETURNING *";

                    data = Object.values(data[0]);
                }
            }

        } else if (isUpdate) {

            let temp = sql.split('WHERE');

            if (temp[0].includes('$') && typeof data[0] == 'object') {

                delete data[0]['id'];

                let keys = Object.keys(data[0]);
                dataValues = Object.values(data[0]);
                let values = '';

                for (let i = 0; i < keys.length; i++) {
                    values += (keys[i] + ' = $' + (i + 1));
                    keys[i] = '"' + keys[i] + '"';
                    if (i < keys.length - 1) { values += ', '; }
                }

                let valueConditions = '';

                if (temp[1].includes('$')) {
                    let conditions = temp[1].split('$');
                    for (let i = 0; i < conditions.length; i++) {
                        if (conditions[i].trim() != '') {
                            valueConditions += (conditions[i] + '$' + (keys.length + i + 1));
                            // if (i > 0 && i < conditions.length - 1 ) { valueConditions += ' AND '; }
                        }
                    }
                } else {
                    valueConditions = temp[1];
                }

                sql = sql.split('SET')[0] + 'SET ' + values + ' WHERE' + valueConditions;

                let dataResult = [];
                for (let i = 0; i < data.length; i++) {
                    if (typeof data[i] == 'object') {
                        dataResult = dataResult.concat(Object.values(data[i]));
                    } else {
                        dataResult.push(data[i]);
                    }
                }

                data = dataResult;

            }
        }

        return { sql: sql, data: data };

    }

    _this.createConnect = () => {

        const config = _this.configConnect();

        return new pg.Pool(config);

    }

    _this.configConnect = () => {

        return {

            host: DB.hostname,

            user: DB.username,

            password: DB.password,

            port: Number(DB.port),

            database: DB.database,

            ssl: false
        }

    }

    this.connection = this.createConnect();
}

module.exports = new connect();