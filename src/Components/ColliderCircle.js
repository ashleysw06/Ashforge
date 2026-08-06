import Component from '/src/Component.js';
import Transform, { Vector2D, Scale2D, Rotation2D } from '/src/Transform.js';
import Collider from '/src/Components/Collider.js';

export default class ColliderCircle extends Collider {
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
            // const push = this.r / 2 - this.gameObject.distance(object) / 2;
            
            object.transform.moveToward(transform.position.x, transform.position.y, -push / 2)
            this.transform.moveToward(data.objTransform.position.x, data.objTransform.position.y, -push / 2)
        })
    }
}