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
		var x_list = [];
		var y_list = [];
		for (var i = 0; i < this._children.length; i++){
			x_list.push(this._children[i].offset.x);
			var temp = this._children[i].offset.y + this._children[i].dimension.y / 2;
			y_list.push(temp);
		}
		var ns = "http://www.w3.org/2000/svg";
		var connection = document.createElementNS(ns, "g");
		for (var i = 0; i < y_list.length; i++){
			var line = document.createElementNS(ns, "line");
			line.setAttribute("x1", this.dimension.x + 20);
			line.setAttribute("y1", y_list[i]);
			line.setAttribute("x2", x_list[i]);
			line.setAttribute("y2", y_list[i]);
			line.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:1");
			connection.appendChild(line);
		}
		var line = document.createElementNS(ns, "line");
		line.setAttribute("x1", this.dimension.x + 20);
		line.setAttribute("y1", y_list[0]);
		line.setAttribute("x2", this.dimension.x + 20);
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

	drop_target_feedback(drop_operation, drop_index){
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
		var x1 = this.dimension.x;
		var y1 = this.dimension.y / 2;
		var x2 = 0;
		var y2 = 0;
		if (this._children.length == 0){
			x2 = this.dimension.x + 60;
			y2 = this.dimension.y / 2;			
		}else if (drop_index >= this._children.length){
			var index = this.children.length - 1;
			x2 = this._children[index].offset.x + 20;
			y2 = this._children[index].offset.y + this._children[index].dimension.y;			
		}else if (drop_index == 0){
			x2 = this._children[drop_index].offset.x + 20;
			y2 = this._children[drop_index].offset.y;
		}else{
			x2 = this._children[drop_index].offset.x + 20;
			y2 = (this._children[drop_index].offset.y + this._children[drop_index - 1].offset.y + this._children[drop_index - 1].dimension.y) / 2;				
		}
		if (y2 - y1 <= 2 && y2 - y1 >= -2){
			var line = document.createElementNS(ns, "line");
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y1);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y2);
			line.setAttribute("style", "stroke:blue;stroke-width:3");
			content.appendChild(line);
		}else{
			var line1 = document.createElementNS(ns, "line");
			line1.setAttribute("x1", x1);
			line1.setAttribute("y1", y1);
			line1.setAttribute("x2", x1 + 20);
			line1.setAttribute("y2", y1);
			line1.setAttribute("style", "stroke:blue;stroke-width:3");
			content.appendChild(line1);
			var line2 = document.createElementNS(ns, "line");
			line2.setAttribute("x1", x1 + 20);
			line2.setAttribute("y1", y1);
			line2.setAttribute("x2", x1 + 20);
			line2.setAttribute("y2", y2);
			line2.setAttribute("style", "stroke:blue;stroke-width:3");
			content.appendChild(line2);
			var line3 = document.createElementNS(ns, "line");
			line3.setAttribute("x1", x1 + 20);
			line3.setAttribute("y1", y2);
			line3.setAttribute("x2", x2);
			line3.setAttribute("y2", y2);
			line3.setAttribute("style", "stroke:blue;stroke-width:3");
			content.appendChild(line3);
		}
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
