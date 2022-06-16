/**
 * 2022-3-31 2012
 * SQLite工具
 */
module.exports = {
  DBName: 'MyAPPDb',
  DBPath: '_doc/Database.db',

  /**
   * 打开数据库
   */
  openDB: function () {
    //打开数据库

    return new Promise((resolve, reject) => {
      if (!this.isOpenDatabase()) {
        plus.sqlite.openDatabase({
          name: this.DBName,
          path: this.DBPath,
          success: function (res) {
            console.log('openDatabase success!', res)
            resolve(res)
          },
          fail: function (e) {
            console.log('openDatabase failed: ' + JSON.stringify(e))
            reject(e)
          }
        })
      } else {
        console.log('Database already open!')
        resolve({
          isok: true,
          msg: 'Database already open!'
        })
      }
      // resolve(e); //成功回调
      // reject(e); //回失败调
    })
  },
  /**
   * 检查数据库是否打开
   */
  isOpenDatabase: function () {
    // 检查数据库是否打开
    console.log('isOpenDatabase')
    var options = {
      name: this.DBName,
      path: this.DBPath,
      success: function (res) {
        console.log('openDatabase success!')
      },
      fail: function (e) {
        console.log('openDatabase failed: ', e)
      }
    }
    return plus.sqlite.isOpenDatabase(options)
  },
  /**
   * 关闭数据库
   */
  closeDatabase: function () {
    return new Promise((resolve, reject) => {
      if (this.isOpenDatabase()) {
        var options = {
          name: this.DBName,
          success: function (res) {
            console.log('closeDatabase success!', res)
            resolve(res)
          },
          fail: function (e) {
            console.log('closeDatabase failed: ' + JSON.stringify(e))
            reject(e)
          }
        }
        plus.sqlite.closeDatabase(options)
      } else {
        resolve({
          isok: true,
          msg: '已关闭'
        })
      }
    })
  },
  /**
   * 事务状态控制
   * @param {Object} operation  需要执行的事务操作 begin（开始事务）、commit（提交）、rollback（回滚）。
   */
  transaction: function (operation) {
    return new Promise((resolve, reject) => {
      var options = {
        name: this.DBName,
        operation: operation,
        success(e) {
          resolve(e) // 成功回调
        },
        fail(e) {
          reject(e) // 失败回调
        }
      }
      plus.sqlite.transaction(options)
    })
  },
  /**
   * 事务启动
   */
  transactionBegin: function () {
    //开启事务
    return this.transaction('begin')
  },
  /**
   * 事务提交
   */
  transactionCommit: function () {
    //提交事务
    return this.transaction('commit')
  },
  /**
   * 事务回滚
   */
  transactionRollback: function () {
    //回滚事务
    return this.transaction('rollback')
  },
  /**
   * 执行sql
   * @param {String|Array} sql 语句或者语句组，支持批量，但是每次批量不要超过500，超过500的自己拆分多次
   */
  _exec: function (sql) {
    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name: this.DBName,
        sql: sql,
        success(e) {
          resolve(e) // 成功回调
        },
        fail(e) {
          reject(e) // 失败回调
        }
      })
    })
  },

  /**
   * 执行sql语句
   * @param {String|Array} sql 语句或者语句组，支持批量，但是每次批量不要超过500，超过500的自己拆分多次
   * @param {Bool} useTran 是否使用事务
   */
  executeSQL: function (sql, useTran) {
    //执行语句
    var that = this
    if (useTran) {
      that
        .transactionBegin()
        .then(() => {
          return this._exec(sql)
        })
        .then(sqldata => {
          return this.transactionCommit()
        })
        .catch(err => {
          return this.transactionRollback()
        })
    } else {
      return this._exec(sql)
    }
  },

  /**
   * 执行查寻sql语句
   * @param {String} sql
   */
  selectSQL: function (sql) {
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: this.DBName,
        sql: sql,
        success: function (data) {
          resolve(data)
        },
        fail: function (e) {
          reject(e) //回失败调
        }
      })
    })
  },

  /**
   * 创建表
   * @param {String} tbname 表名称
   * @param {String} tbsql 表列slq
   */
  createTbSql: function (tbname, tbsql) {
    //
    if (tbsql != '') {
      tbsql = 'create table if not exists ' + tbname + ' (' + tbsql + ')'
      return this.executeSQL(tbsql, false)
    }
  },
  /**
   * 删除表
   * @param {String} 表名
   */
  dropTable: function (tbname) {
    //删除表
    var sql = 'drop table if exists  ' + tbname
    return this.executeSQL(sql, false)
  },
  /**
   * 清空表
   * @param {String} 表名
   */
  clearTable: function (tbname) {
    //
    var sql = 'DELETE FROM ' + tbname
    return this.executeSQL(sql, false)
  }
}
