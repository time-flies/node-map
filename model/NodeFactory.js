exports.createNode = function() {
    var one = new Object();
    one.node_id = 'node_id-1';
    one.root_id = 'root_id-1';
    one.parent_id = 'parent_id-1';
    one.children_ids = [];
    one.children_ids.push('child_id-1');
    one.children_ids.push('child_id-2');
    one.source = '';
    one.title = 'title-1'
    one.content_type = 1;
    one.content = 'mock content';
    one.version = '0.0.0';
    one.timestamp = 1234567890;
    return one;
}

exports.toString = function(node) {
    console.log('Node : ' + node.title + ', ' + node.node_id + ', ' + node.root_id + ', ' + node.parent_id + ', ' + node.children_ids + ', ' + node.source + ', ' + node.version + ', ' + node.timestamp);
}