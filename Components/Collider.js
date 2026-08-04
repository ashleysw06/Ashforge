let test = 0;

class Collider extends Component {
    constructor() {
        super('Collider');
        this.type = "undef"

        this.x;
        this.y;
        this.w;
        this.h;
        this.r;
        
        this.callbacks = [];
        this.ignoredTags = [];
    }

    update(deltaTime) {
        const transform = this.transform.getGlobalTransform();
        this.updateCollisionData(transform);

        this.forEachObject((object, data) => {
            object.transform.moveToward(transform.position.x, transform.position.y, -1)
            this.transform.moveToward(data.objTransform.position.x, data.objTransform.position.y, -1)
        })
    }

    updateCollisionData(transform) {
        this.transform.color = 'blue';
        this.x = transform.position.x;
        this.y = transform.position.y;
        this.w = transform.scale.x * 2;
        this.h = transform.scale.y * 2;
        this.r = transform.scale.x + transform.scale.y;

        if (this.inBounds(new Vector2D(game.engine.worldSpaceMouseX, game.engine.worldSpaceMouseY))) {
            this.transform.color = 'red';
        }
    }

    // inBounds(vector2D) {
    //     const dist = Math.abs(vector2D.x - this.transform.vector2D.position.x) + Math.abs(vector2D.y - this.transform.vector2D.position.y)
    //     return dist < this.r
    // }

    forEachObject(script) {
        this.scene.objects.forEach(object => {
            if (object.instanceID == this.gameObject.instanceID) return;
            for (let i = 0; i < object.tags.length; i++) {
                const tag = object.tags[i];
                if (this.ignoredTags.indexOf(tag) != -1) return;
            }
            const objCollider = object.getComponent("Collider");
            if (objCollider) {
                const objTransform = object.transform.getGlobalTransform();
                let closestPoint = this.getClosestPoint(objTransform, objCollider, objCollider.type);

                if (this.inBounds(closestPoint)) {
                    this.transform.color = 'red';
                    this.callback(object);

                    script(object, {objTransform, objCollider, closestPoint});
                }
            }
        });
    }

    intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;

        const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

        if (denominator === 0) return false; // Lines are parallel

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false; // is the intersection along the segments

        let x = x1 + ua * (x2 - x1)
        let y = y1 + ua * (y2 - y1)

        return { x, y }
    }

    // TODO: get from class: (transform, type = "sqaure") -> (collider): collider.getClosestPoint(x, y)
    getClosestPoint(transform, collider, type = "rectangle") {
        let closestPoint = new Vector2D(transform.position.x, transform.position.y);

        switch (type) {
            case "circle":
                let x = transform.position.x;
                let y = transform.position.y;

                const dx = this.x - x;
                const dy = this.y - y;
                const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

                x += dx / 2;
                y += dy / 2;

                closestPoint = new Vector2D(x, y);
                break;
                
            case "rectangle":
                // const point = new Vector2D(this.x, this.y) // Point of this object
                // const objPoint = new Vector2D(transform.position.x, transform.position.y); // Point of other object
                // for (let i = 0; i < collider.points.length; i++) {
                //     const linePointA = collider.points[i].clone()
                //     const linePointB = collider.points[(i + 1) % collider.points.length].clone() // % x loops back so last point and first point can connect

                //     //if ( objPoint.x, objPoint.y )
                //     // closestPoint = linePointA;
                    

                //     // const intersect = this.intersect(point.x, point.y, objPoint.x, objPoint.y, linePointA.x, linePointA.y, linePointB.x, linePointB.y)
                //     // if (intersect) {
                //     //     closestPoint = intersect;
                //     // }
                // }
                break;
        
            default:
                break;
        }

        return closestPoint;
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