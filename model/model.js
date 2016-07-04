class ModelListener {
    constructor() {

    }

    node_added(node) {

    }

    node_reomved(node) {

    }
}

class Model {
    constructor() {
        this._root = null;
        this._dict = {};
        this._listeners = [];

        var id1 = new UUID().string();
        var node1 = new Node(id1, id1);
        var node2 = new Node(new UUID().string(), node1.id, node1.id);
        var node3 = new Node(new UUID().string(), node1.id, node1.id);
        var node4 = new Node(new UUID().string(), node1.id, node1.id);
        var node5 = new Node(new UUID().string(), node1.id, node4.id);
        var node6 = new Node(new UUID().string(), node1.id, node4.id);
        var node7 = new Node(new UUID().string(), node1.id, node4.id);
        node1.children = [node2.id, node3.id, node4.id];
        node4.children = [node5.id, node6.id, node7.id];

        this._root = node1;
        this._dict[node1.id] = node1;
        this._dict[node2.id] = node2;
        this._dict[node3.id] = node3;
        this._dict[node4.id] = node4;
        this._dict[node5.id] = node5;
        this._dict[node6.id] = node6;
        this._dict[node7.id] = node7;
    }

    get nodes() {
        return this._dict;
    }

    get_node(node_id) {
        if (this._dict.hasOwnProperty(node_id)) {
            return this._dict[node_id];
        }
    }

    add_listener(listener) {
        this._listeners.push(listener);
    }

    create_node(parent_id) {
        var node = new Node(new UUID().string(), this._root.id, parent_id);
        var parent_node = this._dict[parent_id];
        parent_node.append_child(node);
        this._dict[node.id] = node;

        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i].node_added(node);
        }
    }
}

var data_model = new Model();