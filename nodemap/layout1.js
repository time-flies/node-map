class Layout {

}

class Layout1 extends Layout {
    constructor() {
        super();
        this._offsetx = 20;
        this._offsety = 2;
        this._gapsfactor = 1;
    }

    set gapsfactor(factor) {
        this._gapsfactor = factor;
    }

    get gapsfactor() {
        return this._gapsfactor;
    }

    layout(node) {
        this._hdict = {};
        this._hcdict = {};
        this._offsetdict = {};
        this.calc_height(node);
        console.log(this._hdict);
        this.calc_children_offset(node);
        console.log(this._offsetdict);
        return this._offsetdict;
    }

    calc_height(node) {
        var h = node.dimension.y;
        var hc = 0;
        var subnodes = node.children;
        for (var i = 0; i < subnodes.length; i++) {
            if (this._hdict.hasOwnProperty(subnodes[i])) {
                hc = hc + this._hdict.get(subnodes[i]);
            }
            hc = hc + this.calc_height(subnodes[i]);
        }
        if (hc > h) {
            h = hc;
        }
        this._hdict[node.id] = h;
        this._hcdict[node.id] = hc;
        return h;
    }

    calc_children_offset(node) {
        var offsetp = (this._hdict[node.id] - node.dimension.y) / 2;
        var offsetc = 0;
        if (this._hcdict[node.id] < this._hdict[node.id]) {
            offsetc = (this._hdict[node.id] - this._hcdict[node.id]) / 2
        }
        var offsetx = node.dimension.x + this._offsetx * this._gapsfactor;
        var subnodes = node.children;
        for (var i = 0; i < subnodes.length; i++) {
            this._offsetdict[subnodes[i].id] = new Point(offsetx, offsetc + (this._hdict[subnodes[i].id] - subnodes[i].dimension.y) / 2 - offsetp);
            offsetc = offsetc + this._hdict[subnodes[i].id];
            this.calc_children_offset(subnodes[i]);
        }
    }
}