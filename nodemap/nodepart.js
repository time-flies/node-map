class EventHandler{
	constructor(){
		
	}

	on_click(event){
		console.log("event handler on_click called.");
		console.log(event);
	}

	on_mouse_down(event){
		console.log("event handler on_mouse_down called.");
		console.log(event);
	}

	on_mouse_up(event){
		console.log("event handler on_mouse_up called");
		console.log(event);
	}
}

class NodePart extends EventHandler{
	constructor(node){
		super();
		this._node = node;
		this._dim = new Point(100, 50);
		this._parent = null;
		this._children = []
		this._wnode = 0;
		this._hnode = 0;
		this._treeh = 0;
		this._treew = 0;
		this._offset = new Point(0, 0);
	}

	get node(){
		return this._node;
	}

	get id(){
		return this.node.id;
	}

	set dimension(dim){
		this._dim = dim;
	}

	get dimension(){
		return this._dim;
	}

	get parent(){
		return this._parent;
	}

	set offset(p){
		this._offset = p;
	}

	get offset(){
		return this._offset;
	}

	get absolute_position(){
		var x = this._offset.x;
		var y = this._offset.y;
		var p = this.parent;
		while (p != null){
			x += p.offset.x;
			y += p.offset.y;
			p = p.parent;
		}	
		return new Point(x, y);
	}

	set tree_width(w){
		this._treew = w;
	}

	set tree_height(h){
		this._treeh = h;
	}

	contains(p){
		return false;
	}

	get children(){
		return this._children;
	}

	add_children(treenode){
		this._children.push(treenode);
		treenode._parent = this;
	}

	display_data(){
		var ns = 'http://www.w3.org/2000/svg';
		var content = document.createElementNS('http://www.w3.org/2000/svg', "g");
		content.setAttribute("class", "content");
		var rc = document.createElementNS(ns, "rect");
		rc.setAttribute("x", "0");
		rc.setAttribute("y", "0");
		rc.setAttribute("width", this.dimension.x);
		rc.setAttribute("height", this.dimension.y);
		rc.setAttribute("style", "fill:blue;stroke:pink;stroke-width:1;fill-opacity:0.1;stroke-opacity:0.9;boxSizing:border-box");
		content.appendChild(rc);
		var icon = document.createElementNS(ns, "image");
		icon.setAttribute("class", "add");
		icon.setAttributeNS("http://www.w3.org/1999/xlink", "href", "file:///users/liaomengling/Workspace/REACT/electron-quick-start/nodemap/123333.png");
		icon.setAttribute("x", "100");
		icon.setAttribute("y", "10");
		icon.setAttribute("width", 20);
		icon.setAttribute("height", 20);
		content.appendChild(icon);
		var text= document.createElementNS(ns, "text");
		text.setAttribute("x", 5);
		text.setAttribute("y", 15);
		text.innerHTML = this.id.slice(0, 10);
		content.appendChild(text);
		return content;
	}

	connection_data(){
		if (this._children.length == 0){
			return null;
		}
		var y_list = [];
		for (var i = 0; i < this._children.length; i++){
			var temp = this._children[i].offset.y + this._children[i].dimension.y / 2;
			y_list.push(temp);
		}
		var x1 = this.dimension.x + 20;
		var x2 = this.dimension.x + 40;
		var ns = "http://www.w3.org/2000/svg";
		var connection = document.createElementNS(ns, "g");
		for (var i = 0; i < y_list.length; i++){
			var line = document.createElementNS(ns, "line");
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y_list[i]);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y_list[i]);
			line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:1");
			connection.appendChild(line);
		}
		var line = document.createElementNS(ns, "line");
		line.setAttribute("x1", x1);
		line.setAttribute("y1", y_list[0]);
		line.setAttribute("x2", x1);
		line.setAttribute("y2", y_list[y_list.length - 1]);
		line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:1");
		connection.appendChild(line);
		return connection;
	}

	drag_source_feedback(){
		var ns = 'http://www.w3.org/2000/svg';
		var content = document.createElementNS('http://www.w3.org/2000/svg', "g");
		content.setAttribute("class", "drag_feedback");
		var rc = document.createElementNS(ns, "rect");
		rc.setAttribute("x", "0");
		rc.setAttribute("y", "0");
		rc.setAttribute("width", this.dimension.x);
		rc.setAttribute("height", this.dimension.y);
		rc.setAttribute("style", "fill:blue;stroke:pink;stroke-width:1;fill-opacity:0.1;stroke-opacity:0.9;boxSizing:border-box");
		content.appendChild(rc);
		var text= document.createElementNS(ns, "text");
		text.setAttribute("x", 5);
		text.setAttribute("y", 15);
		text.innerHTML = this.id.slice(0, 10);
		content.appendChild(text);
		return content;	
	}

	drop_target_feedback(){
		var ns = 'http://www.w3.org/2000/svg';
		var content = document.createElementNS('http://www.w3.org/2000/svg', "g");
		content.setAttribute("class", "drop_feedback");
		var rc = document.createElementNS(ns, "rect");
		rc.setAttribute("x", "0");
		rc.setAttribute("y", "0");
		rc.setAttribute("width", this.dimension.x);
		rc.setAttribute("height", this.dimension.y);
		rc.setAttribute("style", "stroke:blue;stroke-width:3;fill-opacity:0.1;stroke-opacity:0.9;boxSizing:border-box");
		content.appendChild(rc);
		return content;		
	}

	on_click(event){
		console.log(event);
		console.log(event.target);
		var element = event.target;
		console.log(element.hasAttribute("class"));
		if (element.hasAttribute("class")){
			var match_result = element.getAttribute("class").match(new RegExp('(\\s|^)'+ "add" +'(\\s|$)'));
			if (match_result != null){
				console.log("add children");
			}			
			cmd_service.execute_command("create_subnode", {"parent_node_id":this.id});
		}else{
			console.log("tree node clicked");
		}
	}
}
