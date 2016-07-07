class Node{

	constructor(node_id, root_id, parent_id){
		this._id = node_id;
		this._root = root_id;
		this._parent = parent_id;
		this._children = [];
	}

	get id(){
		return this._id;
	}

	get root_id(){
		return this._root;
	}

	get parent(){
		return this._parent;
	}

	set parent(parent){
		this._parent = parent;
	}

	get children(){
		return this._children;
	}

	set children(children){
		this._children = children;
	}

	append_child(node){
		this._children.push(node.id);
	}
}

