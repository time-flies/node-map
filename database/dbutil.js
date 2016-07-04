var fs = require('fs');
var SQL = require('sql.js');
var util = require('util');

var DB_CREAT_NODES_SQL = 'CREATE TABLE IF NOT EXISTS nodes (' + '_id INTEGER PRIMARY KEY AUTOINCREMENT,' + 'node_id VARCHAR(64) NOT NULL,' + 'root_id VARCHAR(64),' + 'parent_id VARCHAR(64) ,' + 'children_ids TEXT ,' + 'source VARCHAR(64) DEFAULT NULL,' + 'title VARCHAR(140),' + 'content_type INTEGER,' + 'content TEXT,' + 'version VARCHAR(140),' + 'timestamp INTEGER' + ');';


var db = undefined;
var db_export_path = undefined;


exports.export = function() {
    var data = db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync(db_export_path, buffer);
}

exports.connect = function(_db_export_path) {
    util.log('connect database');
    // init the db
    db_export_path = _db_export_path;

    var exists = fs.existsSync(db_export_path);
    if (!exists) {
        util.log("Creating DB file.");
        db = new SQL.Database();
        db.run(DB_CREAT_NODES_SQL);
    } else {
        var filebuffer = fs.readFileSync(db_export_path);
        db = new SQL.Database(filebuffer);
    }

    if (db === undefined) {
        util.log('FAIL on creating database ');
    } else {
        util.log('connect success');
    }

    this.export();
}

exports.disconnect = function() {
    util.log('disconnect database');
    this.export();
    db.close();
}

exports.getDb = function() {
    return db;
}

exports.setup = function() {
    util.log('setup database');
    db.run(DB_CREAT_NODES_SQL);
    this.export();
}

exports.insert = function(node) {
    util.log('insert row');
    db.run("INSERT INTO nodes (node_id, root_id, parent_id, children_ids, source, title, content_type, content, version, timestamp) " +
        "VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10);", {
            ':1': node.node_id,
            ':2': node.root_id,
            ':3': node.parent_id,
            ':4': node.children_ids,
            ':5': node.source,
            ':6': node.title,
            ':7': node.content_type,
            ':8': node.content,
            ':9': node.version,
            ':10': node.timestamp
        });
    this.export();
}

exports.delete = function(node_id) {
    util.log('delete rows');
    db.run("DELETE FROM nodes WHERE node_id = :1;", {
        ':1': node_id
    });
    this.export();
}

exports.update = function(node, node_id) {
    util.log('update rows');
    db.run("UPDATE nodes " +
        "SET node_id = :1, root_id = :2, parent_id = :3, children_ids  = :4, source  = :5, title = :6, content_type = :7, content = :8, version = :9, timestamp = :10 WHERE node_id = :11", {
            ':1': node.node_id,
            ':2': node.root_id,
            ':3': node.parent_id,
            ':4': node.children_ids,
            ':5': node.source,
            ':6': node.title,
            ':7': node.content_type,
            ':8': node.content,
            ':9': node.version,
            ':10': node.timestamp,
            ':11': node_id
        });
    this.export();
}

exports.forAll = function(doEach, done) {
    util.log('forAll');
    db.each("SELECT * FROM nodes;", doEach, done);
}

exports.findNodeById = function(node_id) {
    util.log('findNodeById : ' + node_id);

    var stmt = db.prepare("SELECT * FROM nodes WHERE node_id = $id");
    stmt.bind({
        $id: node_id
    });
    stmt.step();
    var res = stmt.getAsObject();

    util.log(JSON.stringify(res));
    return res;
}