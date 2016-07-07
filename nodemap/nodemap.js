class Tree extends ModelListener{
	constructor(){
		super();
		this._id = Math.random().toString();
		this._doc = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this._doc.setAttribute("width", "800");
		this._doc.setAttribute("height", "600");
		this._doc.setAttribute("version", "1.1");
		this._doc.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		this._doc.setAttribute("id", this._id);
		document.getElementById("tree_container").appendChild(this._doc);

		this._node_dict = {};
		this._tnfactory = new NodePartFactory();
		this._offset = new Point(20, 120);
		this._root_node = null;
		this._nodes = {};
		this._display_root = null;
		this._display_nodes = {};
	}

	get id(){
		return this._id;
	}

	find_node_at(p){
		return this.find_node_at2(p, this._display_root, this._offset);
	}

	find_node_at2(p, display_node, offset){
		var rc = new Rect(offset.x, offset.y, display_node.dimension.x, display_node.dimension.y);
		if (rc.contains(p.x, p.y)){
			return display_node;
		}
		var child_nodes = display_node.children;
		var relative_p = new Point(p.x - offset.x, p.y - offset.y);
		for (var i = 0; i < child_nodes.length; i++){
			var temp = this.find_node_at2(relative_p, child_nodes[i], this._layout_dict[child_nodes[i].id]);
			if (temp != null){
				return temp;
			}
		}
		return null;
	}

	upadte_layout_2node(layout_dict){
		for (var node_id in layout_dict){
			if (this._display_nodes.hasOwnProperty(node_id)){
				this._display_nodes[node_id].offset = layout_dict[node_id];
			}
		}
		this._display_root.offset = this._offset;
	}

	set_content(nodes){
		this._root_node = null;
		this._nodes = nodes;
		this._display_root = null;
		this._display_nodes = {};
		for (var node_id in nodes){
			var node = nodes[node_id];
			var root_id = node.root_id;
			this._root_node = nodes[root_id];
			break;
		}
		this._display_root = this._tnfactory.create_treenode(this._root_node);
		this._display_nodes[this._root_node.id] = this._display_root;
		this.build_children(this._root_node, this._display_root);
		var layout_mgr = new Layout1();
		this._layout_dict = layout_mgr.layout(this._display_root);
		this.upadte_layout_2node(this._layout_dict);
		var element = this.node2dom(this._display_root);
		element.setAttribute("transform", "translate(20, 120)");
		document.getElementById(this._id).appendChild(element);
	}

	build_children(node, display){
		var id_list = node.children;
		for (var i = 0; i < id_list.length; i++){
			var node_id = id_list[i];
			var node = this._nodes[node_id];
			var display_node = this._tnfactory.create_treenode(node);
			this._display_nodes[node_id] = display_node;
			display.add_children(display_node);
			this.build_children(node, display_node);
		}
	}

	get_display_node(node_id){
		if (this._display_nodes.hasOwnProperty(node_id)){
			return this._display_nodes[node_id];
		}
		return null;
	}

	node2dom(node){
		var element_n = document.createElementNS('http://www.w3.org/2000/svg', "g");
		element_n.setAttribute("id", node.id);
		if (this._layout_dict.hasOwnProperty(node.id)){
			var p = this._layout_dict[node.id];
			var t = "translate(" + p.x + "," + p.y + ")";
			element_n.setAttribute("transform", t);
		}else{
			element_n.setAttribute("transform", "translate(0, 0)");
		}
		var content = node.display_data();
		element_n.appendChild(content);
		var connection = node.connection_data();
		if (connection != null){
			element_n.appendChild(connection);
		}

		var children = document.createElementNS('http://www.w3.org/2000/svg', "g");
		children.setAttribute("class", "children");
		children.setAttribute("transform", "translate(0, 0)");
		var subnodes = node.children;
		for (var i = 0; i < subnodes.length; i++){
			var element_i = this.node2dom(subnodes[i]);
			children.appendChild(element_i);
		}
		element_n.appendChild(children);
		return element_n;
	}

	node_added(node){
		console.log("tree : node_added");
		var parent_id = node.parent;
		if (!this._nodes.hasOwnProperty(parent_id)){
			return;
		}
		this._nodes[node.id] = node;
		var display_parent = this._display_nodes[parent_id];
		var display_node = this._tnfactory.create_treenode(node);
		this._display_nodes[node.id] = display_node;
		display_parent.add_children(display_node);
		var layout_mgr = new Layout1();
		this._layout_dict = layout_mgr.layout(this._display_root);
		this.upadte_layout_2node(this._layout_dict);		
		var element = this.node2dom(this._display_root);
		element.setAttribute("transform", "translate(20, 120)");
		document.getElementById(this._id).innerHTML = "";
		document.getElementById(this._id).appendChild(element);
		this.bind_events();

		//tree_event(this);
	}

	set drag_source(source){
		this._drag_source = source;
	}

	get drag_source(){
		return this._drag_source;
	}

	add_preview_data(element, x, y){
		var g = document.getElementById(this._id).getElementById("preview");
		if (g == null){
			g = document.createElementNS('http://www.w3.org/2000/svg', "g");
			document.getElementById(this._id).appendChild(g);
		}
		g.setAttribute("id", "preview");
		element.setAttribute("transform", "translate(" + x + "," + y + ")");
		g.appendChild(element);
	}

	remove_preview_data(){
		var temp = document.getElementById(this._id).getElementById("preview");
		if (temp != null){
			temp.innerHTML = "";
		}
	}

	bind_events(){
		var nodemap = this;
		[].forEach.call(document.getElementById(nodemap.id).getElementsByClassName("content"), function(c){
			c.onclick = function(evt){
				var node_id = c.parentElement.getAttribute("id");
				var display_node = nodemap.get_display_node(node_id);
				if (display_node != null){
					display_node.on_click(evt);
				}
			}

			c.onmousedown = function(evt){
				var node_id = c.parentElement.getAttribute("id");
				var display_node = nodemap.get_display_node(node_id);
				nodemap.drag_source = display_node;
			}

			c.onmousemove = function(evt){
								
			}

			c.onmouseup = function(evt){
				nodemap.drag_source = null;	
			}
		});

		document.getElementById(nodemap.id).onclick = function(evt){
			//console.log("svg click");
		}	

		document.getElementById(nodemap.id).onmousedown = function(evt){
			//console.log("svg mouse down");
		}

		document.getElementById(nodemap.id).onmousemove = function(evt){
			if (nodemap.drag_source != null){
				console.log(evt);
				console.log("drag_source_feedback:");
				nodemap.remove_preview_data();
				nodemap.add_preview_data(nodemap.drag_source.drag_source_feedback(), evt.x, evt.y);
				var temp = nodemap.find_node_at(new Point(evt.x, evt.y));
				if (temp != null){
					console.log("drop_target_feedback:");
					var p = temp.absolute_position;
					nodemap.add_preview_data(nodemap.drag_source.drop_target_feedback(), p.x, p.y);
				}
			}
		}

		document.getElementById(nodemap.id).onmouseup = function(evt){
			nodemap.drag_source = null;	
			nodemap.remove_preview_data();
		}

		document.getElementById(nodemap.id).onmouseout = function(evt){
			console.log("on mouse out");
			console.log(evt);
			// nodemap.drag_source = null;	
			// nodemap.remove_preview_data();
		}
	}
}

window.onload=function(){

	var tree = new Tree();
	tree.set_content(data_model.nodes);
	data_model.add_listener(tree);
	tree.bind_events();
}