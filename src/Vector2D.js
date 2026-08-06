export default class Vector2D {
    constructor(x, y) {
        this.position = { x: x, y: y };
        this.x = this.position.x;
        this.y = this.position.y;
    }

    clone() {
        const distance = Math.sqrt(
            this.position.x * this.position.x + 
            this.position.y * this.position.y
        );
        if (distance === 0) {
            return new Vector2D(0, 0);
        }
        return new Vector2D(
            this.position.x, 
            this.position.y
        );
    }

    normalize() {
        const distance = Math.sqrt(
            this.position.x * this.position.x + 
            this.position.y * this.position.y
        );
        if (distance <= 0.1) {
            return new Vector2D(0, 0);
        }
        return new Vector2D(
            this.position.x / distance, 
            this.position.y / distance
        );
    }
}