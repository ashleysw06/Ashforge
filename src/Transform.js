import Vector2D from './Vector2D.js';
import Scale2D from './Scale2D.js';
import Rotation2D from './Rotation2D.js';

export { Vector2D, Scale2D, Rotation2D }

export default class Transform {
    constructor(position, scale, rotation) {
        this.defaultScale = 5; // TODO: fix to not need this... something something to do with parent child scaling/decaying exponentially
        this.vector2D = new Vector2D(position?.x ?? 0, position?.y ?? 0);
        this.scale2D = new Scale2D(scale?.x ?? this.defaultScale, scale?.y ?? this.defaultScale); // Set to 5 during testing, accidentally built some systems around it using that number. Will fix eventually
        this.rotation2D = new Rotation2D(rotation?.rot ?? 0);

        this.position = this.vector2D.position;
        this.scale = this.scale2D.scale;
        this.rotation = this.rotation2D.rotation;

        this.isStatic = false;

        this.gameObject = null;
        this.parent = null;
        this.children = [];

        this.scene = null;

        this.inView = true;
        this.color = 'blue';
        this.type = 'rectangle';
    }

    update(deltaTime) {
        const screen = window._screen;
        const transform = this.getGlobalTransform();

        const top = Math.abs(transform.position.y - transform.scale.x * 2 - screen.y) < screen.bottom / 2;
        const left = Math.abs(transform.position.x - transform.scale.x * 2 - screen.x) < screen.right / 2;
        const bottom = Math.abs(transform.position.y + transform.scale.x * 2 - screen.y) < screen.bottom / 2;
        const right = Math.abs(transform.position.x + transform.scale.x * 2 - screen.x) < screen.right / 2;
        
        this.inView = ( top + left + bottom + right ) > 0;
    }

    setParent(parent) {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }
        this.parent = parent;
        if (parent) {
            parent.children.push(this);
        }
    }

    removeParent() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
            this.parent = null;
        }
    }

    getParent() {
        return this.parent;
    }

    addChild(child) {
        child.setParent(this);
    }

    removeChild(child) {
        child.setParent(null);
    }

    getChildren() {
        return this.children;
    }

    getGlobalTransform() {
        return {
            position: this.getGlobalPosition(),
            scale: this.getGlobalScale(),
            rotation: this.getGlobalRotation()
        };
    }

    getRotatedPosition() {
        let x = this.vector2D.position.x;
        let y = this.vector2D.position.y;
        if (this.parent) {
            const parentRotation = this.parent.getGlobalRotation()
            const radians = parentRotation.deg * Math.PI / 180;
            
            const s = -Math.sin(radians);
            const c = Math.cos(radians);

            x = this.vector2D.position.x * c + this.vector2D.position.y * s;
            y = -this.vector2D.position.x * s + this.vector2D.position.y * c;
        }

        return new Vector2D(x, y)
    }

    getGlobalPosition() {
        if (this.parent) {
            const parentPosition = this.parent.getGlobalPosition()
            const relativePosition = this.getRotatedPosition();

            return { 
                x: relativePosition.x + parentPosition.x, 
                y: relativePosition.y + parentPosition.y 
            };
        }
        return { 
            x: this.vector2D.position.x, 
            y: this.vector2D.position.y 
        };
    }

    getGlobalScale() {
        if (this.parent) {
            return {
                x: this.parent.getGlobalScale().x * this.scale2D.scale.x / this.defaultScale,
                y: this.parent.getGlobalScale().y * this.scale2D.scale.y / this.defaultScale
            };
        }
        return {
            x: this.scale2D.scale.x,
            y: this.scale2D.scale.y
        };
    }

    getGlobalRotation() {
        if (this.parent) {
            return {
                rot: this.parent.getGlobalRotation().rot + this.rotation2D.getRotRad(),
                deg: this.parent.getGlobalRotation().deg + this.rotation2D.getRotDeg()
            };
        }
        return {
            rot: this.rotation2D.getRotRad(),
            deg: this.rotation2D.getRotDeg()
        };
    }

    getCardinalDirection(angle = null) {
        if (!angle) {
            angle = this.getGlobalRotation().deg;
        }
        angle = (angle + 360) % 360; // Angles under or over 360 converted to 0 - 360 range;

        // 8 Cardinal directions and their ranges in Degrees
        const directions = [
            { direction: "N", name: "North", startAngle: -22.5, endAngle: 22.5 },
            { direction: "NE", name: "North East", startAngle: 22.5, endAngle: 67.5 },
            { direction: "E", name: "East", startAngle: 67.5, endAngle: 112.5 },
            { direction: "SE", name: "South East", startAngle: 112.5, endAngle: 157.5 },
            { direction: "S", name: "South", startAngle: 157.5, endAngle: 202.5 },
            { direction: "SW", name: "South West", startAngle: 202.5, endAngle: 247.5 },
            { direction: "W", name: "West", startAngle: 247.5, endAngle: 292.5 },
            { direction: "NW", name: "North West", startAngle: 292.5, endAngle: 337.5 },
        ]

        for (let i = 0; i < directions.length; i++) {
            if (angle > directions[i].startAngle && angle < directions[i].endAngle) {
                return directions[i];
            }
        }

        return 'N'; // Default
    }

    moveToward(targetX, targetY, speed) {
        const transform = this.getGlobalTransform();
        const dx = targetX - transform.position.x;
        const dy = targetY - transform.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        speed ?? distance;

        if (distance > 0) {
            const ratio = Math.min(speed / distance, 1);
            this.vector2D.position.x += dx * ratio;
            this.vector2D.position.y += dy * ratio;
        }
    }

    moveForward(distance, speed) {
        const radian = this.rotation2D.getRotRad();
        const dx = Math.cos(radian) * distance;
        const dy = Math.sin(radian) * distance;

        speed ?? distance;

        const ratio = speed / distance;
        this.vector2D.position.x += dx * ratio;
        this.vector2D.position.y += dy * ratio;
    }

    moveRight(distance, speed) {
        const radian = this.rotation2D.getRotRad() + Math.PI / 2;
        const dx = Math.cos(radian) * distance;
        const dy = Math.sin(radian) * distance;
        
        speed ?? distance;

        const ratio = speed / distance;
        this.vector2D.position.x += dx * ratio;
        this.vector2D.position.y += dy * ratio;
    }

    draw(ctx) {
        if (!this.inView) return;
        
        ctx.beginPath();
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = this.color;

        switch (this.type) {
            case "rectangle":
                ctx.rect(-2, -2, 4, 4);
                break;
        
            case "circle":
                ctx.arc(0, 0, 2, 0, 2 * Math.PI);
                break;
            default:
                break;
        }

        ctx.stroke();
    }
}