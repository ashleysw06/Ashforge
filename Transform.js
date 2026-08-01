class Transform {
    constructor(position, scale, rotation) {
        this.vector2D = new Vector2D(position?.x ?? 0, position?.y ?? 0);
        this.scale2D = new Scale2D(scale?.x ?? 5, scale?.y ?? 5);
        this.rotation2D = new Rotation2D(rotation?.rot ?? 0);

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
        const transform = this.getGlobalTransform();
        const lntInView = // Left and Top
            (Math.abs(transform.position.x - transform.scale.x * 2 - game.engine.screenX) < game.engine.screenRight / 2) || 
            (Math.abs(transform.position.y - transform.scale.x * 2 - game.engine.screenY) < game.engine.screenBottom / 2);
        const rnbInView = // Right and Bottom
            (Math.abs(transform.position.x + transform.scale.x * 2 - game.engine.screenX) < game.engine.screenRight / 2) || 
            (Math.abs(transform.position.y + transform.scale.x * 2 - game.engine.screenY) < game.engine.screenBottom / 2);
        this.inView = lntInView || rnbInView;
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

    getGlobalPosition() {
        if (this.parent) {
            const parentPosition = this.parent.getGlobalPosition()
            const parentRotation = this.parent.getGlobalRotation()
            const radians = parentRotation.deg * Math.PI / 180;
            
            const s = Math.sin(radians);
            const c = Math.cos(radians);

            const xnew = -this.vector2D.position.x * c - this.vector2D.position.y * s;
            const ynew = -this.vector2D.position.x * s + this.vector2D.position.y * c;

            return { 
                x: xnew + parentPosition.x, 
                y: ynew + parentPosition.y 
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
                x: this.parent.getGlobalScale().x * this.scale2D.scale.x / 5,
                y: this.parent.getGlobalScale().y * this.scale2D.scale.y / 5
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
            //angle = this.rotation2D.getRotDeg();
            angle = this.getGlobalRotation().deg;
        }
        angle = (angle + 360) % 360;

        // Define cardinal directions and their corresponding angle ranges
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const angleRanges = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

        // Determine the cardinal direction based on the angle
        for (let i = 0; i < directions.length; i++) {
            if (angle < angleRanges[i]) {
                return directions[i];
            }
        }

        // If the angle is between 337.5 and 360 or 0 and 22.5, it corresponds to 'N'
        return 'N';
    }

    moveToward(targetX, targetY, speed) {
        const transform = this.getGlobalTransform();
        const dx = targetX - transform.position.x;
        const dy = targetY - transform.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

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

        const ratio = speed / distance;
        this.vector2D.position.x += dx * ratio;
        this.vector2D.position.y += dy * ratio;
    }

    moveRight(distance, speed) {
        const radian = this.rotation2D.getRotRad() + Math.PI / 2;
        const dx = Math.cos(radian) * distance;
        const dy = Math.sin(radian) * distance;

        const ratio = speed / distance;
        this.vector2D.position.x += dx * ratio;
        this.vector2D.position.y += dy * ratio;
    }

    draw(ctx) {
        if (!this.inView) return;
        
        switch (this.type) {
            case "rectangle":
                ctx.beginPath();
                ctx.lineWidth = 0.2;
                ctx.strokeStyle = this.color;
                ctx.rect(-2, -2, 4, 4);
                ctx.stroke();
                break;
        
            case "circle":
                ctx.beginPath();
                ctx.lineWidth = 0.2;
                ctx.strokeStyle = this.color;

                ctx.arc(0, 0, 2, 0, 2 * Math.PI);
                
                ctx.stroke();
                break;
            default:
                break;
        }
        
        // ctx.rotate(-this.getGlobalRotation().rot);
        // const size = 1.5
        // const text = this.gameObject.name;
        // ctx.font = `${size}px serif`;
        // ctx.fillStyle = "green";
        // ctx.fillText(text, -text.length / 2 * size / 2, -4);
    }
}