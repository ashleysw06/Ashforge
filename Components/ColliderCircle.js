class ColliderCircle extends Component {
    constructor() {
        super('Collider');
        this.type = "circle";

        this.Point = (x = 0, y = 0) => ({x, y});
        this.Line = (p1, p2) => ({p1, p2});

        this.x;
        this.y;
        this.r;
        
        this.callbacks = [];
        this.ignoredTags = [];
    }

    inBounds(point) {
        const dist = Math.sqrt(Math.pow(point.x - this.transform.vector2D.position.x, 2) + Math.pow(point.y - this.transform.vector2D.position.y, 2))
        if (dist < this.r) {
            return true
        }
    }

    update(deltaTime) {
        const transform = this.transform.getGlobalTransform();

        this.x = transform.position.x;
        this.y = transform.position.y;
        this.r = transform.scale.x + transform.scale.y;
        

        this.transform.color = 'blue';
        this.transform.type = "circle";
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
                        let x = objTransform.position.x;
                        let y = objTransform.position.y;

                        const dx = transform.position.x - x;
                        const dy = transform.position.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        x += dx / 2;
                        y += dy / 2;

                        closestPoint = this.Point(x, y);
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
                    
                    const push = this.r / this.gameObject.distance(object);
                    object.transform.moveToward(transform.position.x, transform.position.y, -push)
                    this.transform.moveToward(objTransform.position.x, objTransform.position.y, -push)
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