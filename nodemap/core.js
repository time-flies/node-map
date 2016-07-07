class Point{

	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	set x(x){
		this._x = x;
	}

	get x(){
		return this._x;
	}

	set y(y){
		this._y = y;
	}

	get y(){
		return this._y;
	}
}

class Rect{

	constructor(x, y, w, h){
		this._origin = new Point(x, y);
		this._w = w;
		this._h = h;
	}

	set width(w){
		this._w = w; 
	}

	get width(){
		return this._w;
	}

	set height(h){
		this._h = h;
	}

	get height(){
		return this._h;
	}

	contains(x, y){
		return this._origin.x <= x && this._origin.x + this._w >= x && this._origin.y <= y && this._origin.y + this._h >= y;
	}
}

class BoundingBox{

	constructor(p1, p2){
		this.p1 = p1;
		this.p2 = p2;
	}

	set p1(p1){
		this._p1 = p1;
	}

	get p1(){
		return p1;
	}

	set p2(p2){
		this._p2 = p2;
	}

	get p2(){
		return _p2;
	}

	get size(){
		return new Point(this._p2.x - this._p1.x, this._p2.y - this._p1.y);
	}

	get width(){
		return this.size.x;
	}

	get height(){
		return this.size.y;
	}

	get left(){
		return this.p1.x;
	}

	get top(){
		return this.p1.y;
	}

	get right(){
		return this.p2.x;
	}

	get bottom(){
		return this.p2.y;
	}

	contains(x, y){
		return this.contains(new Point(x, y));
	}

	contains(p){
		return p.x > this.p1.x  && p.x < this.p2.x && p.y > this.p1.y && p.y < this.p2.y;
	}

	intersection(bb2){
		var b1 = this.contains(bb2.p1);
		var b2 = this.contains(bb2.p2);
		if (b1 && b2){
			return BoundingBox(bb2.p1, bb2.p2);
		}else if (b1 && !b2){
			return BoundingBox(bb2.p1, this.p2);
		}else if (!b1 && b2){
			return BoundingBox(this.p1, bb2.p2);
		}
		var b3 = this.contains(bb2.right, bb2.top);
		var b4 = this.contains(bb2.left, bb2.bottom);
		if (b3 && !b4){
			return BoundingBox(this.left, bb2.top, bb2.right, this.bottom);
		}else if (!b3 && b4){
			return BoundingBox(bb2.left, this.top, this.right, bb2.bottom);
		}
		return null;
	}
}

