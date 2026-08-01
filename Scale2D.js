class Scale2D {
    constructor(x, y) {
        this.scale = { x: x, y: y };
    }

    getXScale() {
        return this.scale.x;
    }

    getYScale() {
        return this.scale.y;
    }
}