class LineSegment {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	get length() {
		return this.asVector().length;
	}

	asVector() {
		return this.p2.minus(this.p1);
	}

	toString() {
		return this.p1.toString() + ' -> ' +
			this.p2.toString();
	}

	get start() { return this.p1; }
	get end() { return this.p2; }
	get finish() { return this.p2; }

	crosses(line) {
		const maxX1 = Math.max(this.p1.x, this.p2.x),
			minX1 = Math.min(this.p1.x, this.p2.x),
			maxY1 = Math.max(this.p1.y, this.p2.y),
			minY1 = Math.min(this.p1.y, this.p2.y),
			maxX2 = Math.max(line.p1.x, line.p2.x),
			minX2 = Math.min(line.p1.x, line.p2.x),
			maxY2 = Math.max(line.p1.y, line.p2.y),
			minY2 = Math.min(line.p1.y, line.p2.y);
		if (minX2 > maxX1 || minX1 > maxX2 ||
			minY2 > maxY1 || minY1 > maxY2)
			return false;

		const r1 = this._crossesFullLine(line),
			r2 = line._crossesFullLine(this);
		if (!r1 || !r2)
			return false;
		if (r1 == LineSegment.Improper ||
			r2 == LineSegment.Improper)
			return LineSegment.Improper;
		return LineSegment.Proper;
	}

	contains(point) {
		const v = this.asVector(),
			p = point.minus(this.p1);
		if (p.cross(v) != 0)
			return false;
		const d = p.dot(v),
			l2 = v.dot(v);
		if (d < 0 || d > l2)
			return false;
		return true;
	}

	parametricTOfPoint(point) {
		const v = this.asVector();
		return point.minus(this.p1).dot(v) / v.dot(v);
	}
	atParametricT(t) {
		return this.asVector().times(t).plus(this.p1);
	}

	intersectionWithCircle(circle) {
		// from http://mathworld.wolfram.com/Circle-LineIntersection.html
		// intersection of line through (x1,y1) and (x2,y2) and circle radius r at the origin
		// dx = x2-x1; dy = y2-y1;
		// dr = √(dx^2 + dy^2)
		// D = determinant of thing
		//   = x1.y2 - x2.y1
		// =>
		// x = (D.dy ± sign(dy)dx √(r^2.dr^2 - D^2)) / dr^2
		// y = (-D.dx ± |dy| √(r^2.dr^2 - D^2)) / dr^2
		//   = (-D.dx ± sign(dy)dy √(r^2.dr^2 - D^2)) / dr^2

		// in vectors:
		// d = p2 - p1
		// dp = perpendicular of d
		// intersection = (dp.D ± d.sign(dy)).√(r^2.(d.d) - D^2) ) / (d.d)

		const d = this.asVector(),
			p1 = this.p1.minus(circle.centre),
			p2 = this.p2.minus(circle.centre),
			D = p1.x * p2.y - p2.x * p1.y,
			discriminant = circle.radius * circle.radius * d.dot(d) - D * D;

		// Strictly, there *is* an intersection if D = 0
		// but it is of zero measure so screw it.
		if (discriminant <= 0)
			return null;

		// Note: I have no idea what "sign(dy)" is doing in there:
		const a = new Vector(d.y, -d.x).times(D),
			// b = d.times(Math.sqrt(discriminant)),
			b = d.times(Math.sign(d.y) * Math.sqrt(discriminant)),
			c = d.dot(d);

		return new LineSegment(
			a.minus(b).over(c).plus(circle.centre),
			a.plus(b).over(c).plus(circle.centre)
		);
	}

	_crossesFullLine(line) {
		const l1 = line.p1.minus(this.p1),
			l2 = line.p2.minus(this.p1),
			a1 = l1.cross(this.asVector()),
			a2 = l2.cross(this.asVector()),
			result = a1 * a2;
		if (result < 0)
			return LineSegment.Proper;
		if (result == 0)
			return LineSegment.Improper;
		return false;
	}
}

LineSegment.Proper = Symbol('Proper Intersection');
LineSegment.Improper = Symbol('Improper Intersection');

if (typeof module !== 'undefined') module.exports = LineSegment;
