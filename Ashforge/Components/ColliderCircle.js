import { Collider } from './Collider.js';

export class ColliderCircle extends Collider {
    constructor() {
        super('Collider');
        this.type = "circle";
    }

    start() {
        super.start();
        this.transform.type = "circle";
    }

    inBounds(vector2D) {
        const dist = Math.sqrt(Math.pow(vector2D.x - this.transform.vector2D.position.x, 2) + Math.pow(vector2D.y - this.transform.vector2D.position.y, 2))
        return dist < this.r
    }

    update(deltaTime) {
        const transform = this.transform.getGlobalTransform();
        this.updateCollisionData(transform);

        this.forEachObject((object, data) => {
            const push = this.r / this.gameObject.distance(object);
            object.transform.moveToward(transform.position.x, transform.position.y, -push)
            this.transform.moveToward(data.objTransform.position.x, data.objTransform.position.y, -push)
        })
    }
}