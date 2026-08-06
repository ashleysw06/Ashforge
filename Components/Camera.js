class Camera extends Component {
    constructor(isMain = false) {
        super('Camera');

        this.isMain = isMain;

        this.target = new Vector2D(0, 0);
        this.position = new Vector2D(0, 0);

        this.followTypes = {
            INSTANT: 1,
            CHASE: 1
        }

        this.followMode = this.followTypes.INSTANT
        this.followSpeed = 100;

        this.isOverwritten = false;
    }

    start() {
        super.start()

        if (this.isMain) {
            engine.camera = this;
        }

        if (this.transform) {
            this.target = this.transform;
        }
    }

    update(deltaTime) {
        if (engine.camera != this) return;

        if (this.isOverwritten) {
            engine.screenX = this.position.x;
            engine.screenY = this.position.y;
            return;
        }
        switch (this.followMode) {
            case this.followTypes.INSTANT:
                // JS Jank, target is set to the Object
                // Probably add a new system setFollowMode() or something
                // this.position = this.target;
                this.position.x = this.target.position.x;
                this.position.y = this.target.position.y;
                break;
            case this.followTypes.CHASE:
                // Too Implement... Too lazy rn
                break;
        
            default:
                break;
        }
        
        engine.screenX = this.position.x;
        engine.screenY = this.position.y;

        return;

        // Reference
    }
}