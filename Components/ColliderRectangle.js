class ColliderRectangle extends Collider {
    constructor() {
        super('Collider');
        this.type = "rectangle";

        this.points = [new Vector2D(), new Vector2D(), new Vector2D(), new Vector2D()];
    }

    start() {
        super.start();
        this.transform.type = "rectangle";
    }

    isPointLeft(l, p) { // l is line, p is point
        return 0 < (l.p2.x - l.p1.x) * (p.y - l.p1.y) - (l.p2.y - l.p1.y) * (p.x - l.p1.x);
    }

    inBounds(point) {
        var i = 0;
        const line = {p1: this.points[this.points.length - 1], p2: undefined};
        while (i < this.points.length) {
            line.p2 = this.points[i++];
            if (!this.isPointLeft(line, point)) { 
                return false 
            }
            line.p1 = line.p2;
        }
        return true;
    }

    updateBounds(transform) {
        const angle = transform.rotation.deg;
        const translate = (x, y, res) => {
            res.x = x * ax - y * ay + this.x;
            res.y = x * ay + y * ax + this.y;
        }
        const [ax, ay] = [Math.cos(angle), Math.sin(angle)];
        const p = this.points;
        translate( this.w,  this.h, p[0]);
        translate(-this.w,  this.h, p[1]);
        translate(-this.w, -this.h, p[2]);
        translate( this.w, -this.h, p[3]);
    }

    update(deltaTime) {
        const transform = this.transform.getGlobalTransform();
        this.updateCollisionData(transform);
        this.updateBounds(transform);

        this.forEachObject((object, data) => {
            const xDiff = transform.position.x - data.objTransform.position.x;
            const yDiff = transform.position.y - data.objTransform.position.y;

            let x = data.objTransform.position.x;
            let y = data.objTransform.position.y;
            let tx = transform.position.x;
            let ty = transform.position.y;
            let push = 100;

            if (Math.abs(xDiff) / transform.scale.x > Math.abs(yDiff) / transform.scale.y) { // FOR TOP AND BOTTOM: Math.abs(xDiff) / transform.scale.x < Math.abs(yDiff) / transform.scale.y
                push = transform.scale.x / xDiff
                x -= push
                tx += push
            } else {
                push = transform.scale.y / yDiff
                y -= push
                ty += push
            }
            object.transform.moveToward(x, y, Math.abs(push))
            this.transform.moveToward(tx, ty, Math.abs(push))
        })
    }
}