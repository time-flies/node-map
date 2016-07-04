class EventHandler {
    constructor() {

    }

    on_click(event) {
        console.log("event handler on_click called.");
        console.log(event);
    }

    on_mouse_down(event) {
        console.log("event handler on_mouse_down called.");
        console.log(event);
    }

    on_mouse_up(event) {
        console.log("event handler on_mouse_up called");
        console.log(event);
    }
}

class NodePart extends EventHandler {
    constructor(node) {
        super();
        this._node = node;
        this._dim = new Point(100, 50);
        this._parent = null;
        this._children = [];
    }

    get node() {
        return this._node;
    }

    get id() {
        return this.node.id;
    }

    set dimension(dim) {
        this._dim = dim;
    }

    get dimension() {
        return this._dim;
    }

    // set parent(parent){
    // 	this._parent = parent;
    // }

    get children() {
        return this._children;
    }

    add_children(treenode) {
        this._children.push(treenode);
        treenode._parent = this;
    }

    display_data() {
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
        icon.setAttributeNS("http://www.w3.org/1999/xlink", "href", "./nodemap/123333.png");
        icon.setAttribute("x", "100");
        icon.setAttribute("y", "10");
        icon.setAttribute("width", 20);
        icon.setAttribute("height", 20);
        content.appendChild(icon);
        return content;
    }

    on_click(event) {
        console.log(event);
        console.log(event.target);
        var element = event.target;
        console.log(element.hasAttribute("class"));
        if (element.hasAttribute("class")) {
            var match_result = element.getAttribute("class").match(new RegExp('(\\s|^)' + "add" + '(\\s|$)'));
            if (match_result != null) {
                console.log("add children");
            }
            cmd_service.execute_command("create_subnode", {
                "parent_node_id": this.id
            });
        } else {
            console.log("tree node clicked");
        }
    }
}