if (typeof require !== 'undefined') {
	Vector = require('./vector');
}

class Circle {
	constructor(centre, radius) {
		this.centre = centre;
		this.radius = radius;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.centre.x + this.radius, this.centre.y);
		ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.fill();
	}

	contains(point) {
		return this.centre.distanceTo(point) <= this.radius;
	}
}
