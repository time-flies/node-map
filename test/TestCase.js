var util = require('util');
var nodesdb = require('./database/dbutil');
var nodefactory = require('./model/NodeFactory');


// 用工厂方法创建一个节点
var node = nodefactory.createNode();

// 初始化数据库连接，创建数据表
nodesdb.connect('testcase.db');

// 将节点插入数据库
for (var i = 0; i < 10; i++) {
    node.node_id = 'node_id-' + (i + 1);
    nodesdb.insert(node);
}

// 更新数据库记录
node.title = 'title after update';
nodesdb.update(node, 'node_id-1');


// 删除数据库记录
nodesdb.delete('node_id-2');


// 对数据库每条记录进行修改
nodesdb.forAll(function(row) {
    // row was an Object
    util.log('node_id : ' + row.node_id);

});

// 根据id查询某一行数据
var row = nodesdb.findNodeById('node_id-6');
util.log('findNodeById : ' + JSON.stringify(row));


// 关闭数据库连接
nodesdb.disconnect();