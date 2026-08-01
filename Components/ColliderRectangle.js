class ColliderRectangle extends Component {
    constructor() {
        super('Collider');
        this.type = "rectangle";

        this.Point = (x = 0, y = 0) => ({x, y});
        this.Line = (p1, p2) => ({p1, p2});

        this.x;
        this.y;
        this.w;
        this.h;
        this.points = [this.Point(), this.Point(), this.Point(), this.Point()];

        this.callbacks = [];
        this.ignoredTags = [];
    }

    isPointLeft(l, p) { // l is line, p is point
        return 0 < (l.p2.x - l.p1.x) * (p.y - l.p1.y) - (l.p2.y - l.p1.y) * (p.x - l.p1.x);
    }

    inBounds(point) {
        var i = 0;
        const line = this.Line(this.points[this.points.length - 1]);
        while (i < this.points.length) {
            line.p2 = this.points[i++];
            if (!this.isPointLeft(line, point)) { return false }
            line.p1 = line.p2;
        }
        return true;
    }

    update(deltaTime) {
        const transform = this.transform.getGlobalTransform();
        
        this.x = transform.position.x;
        this.y = transform.position.y;
        this.w = transform.scale.x * 2;
        this.h = transform.scale.y * 2;

        const angle = transform.rotation.deg; //this.transform.rotation2D.getRotDeg();
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

        this.transform.color = 'blue';

        this.scene.objects.forEach(object => {
            if (object.instanceID == this.gameObject.instanceID) return;
            for (let i = 0; i < object.tags.length; i++) {
                const tag = object.tags[i];
                if (this.ignoredTags.indexOf(tag) != -1) return;
            }
            const objCollider = object.getComponent("Collider");
            if (objCollider) {
                const objTransform = object.transform.getGlobalTransform();
                let closestPoint = this.Point(objTransform.position.x, objTransform.position.y);

                switch (objCollider.type) {
                    case "circle":
                        closestPoint = this.Point(objTransform.position.x, objTransform.position.y); 
                        break;
                        
                    case "square":
                        closestPoint = this.Point(objTransform.position.x, objTransform.position.y); 
                        break;
                
                    default:
                        break;
                }
                if (this.inBounds(closestPoint)) {
                    this.transform.color = 'red';
                    this.callback(object);

                    const xDiff = transform.position.x - objTransform.position.x;
                    const yDiff = transform.position.y - objTransform.position.y;

                    let x = objTransform.position.x;
                    let y = objTransform.position.y;
                    let tx = transform.position.x;
                    let ty = transform.position.y;
                    let push = 0;

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
                }
            }
        });

        if (this.inBounds(this.Point(game.engine.worldSpaceMouseX, game.engine.worldSpaceMouseY))) {
            this.transform.color = 'red';
        }
    }

    onCollision(callback) {
        this.callbacks.push(callback);
    }

    callback(object) {
        this.callbacks.forEach((callback) => {
            callback(this.gameObject, object);
        })
    }

    ignoreTag(tag) {
        this.ignoredTags.push(tag);
    }
}