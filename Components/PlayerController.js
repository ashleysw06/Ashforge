// Expirimental Class. For testing. Won't ship with engine outside of Examples... Without heavy redesign and more general use
class PlayerController extends Component {
    constructor() {
        super('PlayerController');

        this.keys = {};
        this.speed = 20;
        this.velocity = new Vector2D(0, 0);
    }

    start() {
        super.start()

        const collider = this.gameObject.getComponent("Collider");
        if (collider) collider.ignoreTag("playerProjectile")
    }

    update(deltaTime) {
        super.update(deltaTime);

        const xDistance = this.transform.vector2D.position.x - engine.worldSpaceMouseX;
        const yDistance = this.transform.vector2D.position.y - engine.worldSpaceMouseY;
        const angle = Math.atan2(yDistance, xDistance) * (180 / Math.PI);
        this.transform.rotation2D.setRotDeg(angle);

        // GAME CAMERA FOLLOW PLAYER
        const distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

        // TODO: Move to Camera Class
        engine.screenX = (this.transform.vector2D.position.x - xDistance / Math.sqrt(Math.max(100, distance * 0.2)));
        engine.screenY = (this.transform.vector2D.position.y - yDistance / Math.sqrt(Math.max(100, distance * 0.2)));

        this.velocity.position.x += ( this.keys['ArrowRight'] || this.keys['d'] ) ? 1 : 0;
        this.velocity.position.x += ( this.keys['ArrowLeft'] || this.keys['a'] ) ? -1 : 0;
        this.velocity.position.y += ( this.keys['ArrowDown'] || this.keys['s'] ) ? 1 : 0;
        this.velocity.position.y += ( this.keys['ArrowUp'] || this.keys['w'] ) ? -1 : 0;

        const velocity = this.velocity.normalize();
        
        velocity.position.x *= this.speed * Math.abs(this.velocity.position.x);
        velocity.position.y *= this.speed * Math.abs(this.velocity.position.y);

        this.transform.vector2D.position.x += velocity.position.x * deltaTime;
        this.transform.vector2D.position.y += velocity.position.y * deltaTime;

        // Damping for smoother movement
        this.velocity.position.x *= 0.9;
        this.velocity.position.y *= 0.9;
    }

    _onKeyDown(event) {
        this.keys[event.key] = true;
    }

    _onKeyUp(event) {
        this.keys[event.key] = false;
    }
}