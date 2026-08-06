import Component from '/src/Component.js';
import Transform, { Vector2D, Scale2D, Rotation2D } from '/src/Transform.js';

export default class Collider extends Component {
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

        window._temps.colliderIndex = 0
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
        const mouse = window._mouse.world;

        this.transform.color = 'blue';
        this.x = transform.position.x;
        this.y = transform.position.y;
        this.w = transform.scale.x * 2;
        this.h = transform.scale.y * 2;
        this.r = transform.scale.x + transform.scale.y;

        if (this.inBounds(new Vector2D(mouse.x, mouse.y))) {
            this.transform.color = 'red';
        }
    }

    inBounds(vector2D) {
        const dist = Math.abs(vector2D.x - this.transform.position.x) + Math.abs(vector2D.y - this.transform.position.y)
        return dist < this.r * 2
    }

    forEachObject(script) {
        const objects = this.scene.getObjectsWithoutTags(this.ignoredTags)
        for (let i = window._temps.colliderIndex + 1; i < objects.length; i++) {
            const object = objects[i];

            if (object.instanceID == this.gameObject.instanceID) return;
            for (let i = 0; i < object.tags.length; i++) {
                const tag = object.tags[i];
                if (this.ignoredTags.indexOf(tag) != -1) return;
            }
            const objCollider = object.getComponent("Collider");
            if (objCollider) {
                const objTransform = object.transform.getGlobalTransform();

                const dist = Math.abs(objTransform.x - this.transform.position.x) + Math.abs(objTransform.y - this.transform.position.y)
                if(dist > ( this.r + objCollider.r )) return;

                let closestPoint = this.getClosestPoint(objTransform, objCollider, objCollider.type);

                if (this.inBounds(closestPoint)) {
                    this.transform.color = 'red';
                    this.callback(object);

                    script(object, {objTransform, objCollider, closestPoint});
                }
            }
        }
        
        if (window._temps.colliderIndex < objects.length) {
            window._temps.colliderIndex++;
            return;
        }
        window._temps.colliderIndex = 0;
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
                const point = new Vector2D(this.x, this.y) // Point of this object
                const objPoint = new Vector2D(transform.position.x, transform.position.y); // Point of other object

                let closestDist = Infinity;
                for (let i = 0; i < collider.points.length; i++) {
                    const cornerPoint = collider.points[i].clone()

                    const dist = Math.sqrt(Math.pow(cornerPoint.x - objPoint.x, 2) + Math.pow(cornerPoint.y - objPoint.y, 2));
                    if (dist < closestDist) {
                        closestDist = dist
                        closestPoint = cornerPoint;
                    }
                }
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