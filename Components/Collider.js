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
                let closestPoint = this.getClosestPoint(objTransform, objCollider.type);

                if (this.inBounds(closestPoint)) {
                    this.transform.color = 'red';
                    this.callback(object);

                    script(object, {objTransform, objCollider, closestPoint});
                }
            }
        });
    }

    // TODO: get from class: (transform, type = "sqaure") -> (collider): collider.getClosestPoint(x, y)
    getClosestPoint(transform, type = "rectangle") {
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
                closestPoint = new Vector2D(transform.position.x, transform.position.y); 
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