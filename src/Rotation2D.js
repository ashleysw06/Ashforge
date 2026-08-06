export default class Rotation2D {
    constructor(rot) {
        this.rotation = { rot: rot };
    }

    getRotDeg() {
        let normalDegrees = this.rotation.rot % 360;
        if (normalDegrees < 0) {
            normalDegrees += 360;
        }
        return normalDegrees;
    }

    getRotRad() {
        let normalRadian = (this.rotation.rot / 180 * Math.PI);// % Math.PI;
        if (normalRadian < 0) {
            normalRadian += Math.PI;
        }
        return normalRadian;
    }

    setRotDeg(deg) {
        this.rotation.rot = deg;
    }

    setRotRad(rad) {
        this.rotation.rot = rad / Math.PI * 180;
    }

    rotateDeg(deg) {
        this.rotation.rot += deg;
    }

    rotateRad(rad) {
        this.rotation.rot += rad / Math.PI * 180;
    }
}