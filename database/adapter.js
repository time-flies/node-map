var util = require('util');
var db_handle = require('./database/dbutil')

function DbAdapter() {
    this.handle = db_handle;
}

DbAdapter.prototype.connect = function(db_path) {
    this.handle.connect(db_path);
}

DbAdapter.prototype.disconnect = function() {
    this.handle.disconnect();
}

DbAdapter.prototype.getdb = function() {
    this.handle.getDb();
}

DbAdapter.prototype.insert = function(node) {
    this.handle.insert(node);
}

DbAdapter.prototype.update = function(node, node_id) {
    this.handle.update(node, node_id);
}

DbAdapter.prototype.delete = function(node_id) {
    this.handle.delete(node_id);
}

DbAdapter.prototype.getAllNodes = function() {
    var nodes = [];
    this.handle.forAll(function(row) {
        nodes.push(row);
    });

    util.log('nodes count : ' + nodes.length);

    return nodes;
}

DbAdapter.prototype.findNode = function(node_id) {
    return this.handle.findNodeById(node_id);
}