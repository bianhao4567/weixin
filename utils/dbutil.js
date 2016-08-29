var mysql = require('mysql')


var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'platform'
})

pool.on('connection', function(connection) { 
  // connection.query('SET SESSION auto_increment_increment=1');
  console.log('连接建立成功!')
})

function query(sql, params, callback) {
  if (params) {
    if (typeof params === 'function') {
      callback = params
    }
  }
  pool.getConnection(function(err,connection){
    if(!connection || err){
      callback(err,null)
    }else{
      connection.query(sql,function(err,result){
        connection.release();
        callback(err,result);
      })
    }
  });
}

function insert(table, model, callback) {
  var attr,value
  for(var item in model) {
    if(!attr){
      attr = "`"+item+"`"
      value = "'"+model[item]+"'"
    } else {
      attr += ","+"`"+item+"`"
      value += ","+"'"+model[item]+"'"
    }
  }
  var sql = "insert into `"+table+"` ("+attr+") values ("+value+");"
  console.log(sql)

  pool.getConnection(function(err,connection){
    if(!connection || err){
      callback(err,null)
    }else{
      connection.query(sql,function(err){
        connection.release();
        callback(err);
      })
    }
  });
}

exports.query = query
exports.insert = insert