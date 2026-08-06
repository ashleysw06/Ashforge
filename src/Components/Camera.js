import Component from '/src/Component.js';
import Transform, { Vector2D, Scale2D, Rotation2D } from '/src/Transform.js';

export default class Camera extends Component {
    constructor(engine, isMain = false) {
        super('Camera');

        this.engine = engine;
        this.isMain = isMain;

        this.target = new Vector2D(0, 0);
        this.position = new Vector2D(0, 0);

        this.followTypes = {
            INSTANT: 1,
            CHASE: 2,
            SMOOTH_IN: 3
        }

        this.followMode = this.followTypes.INSTANT
        this.followSpeed = 100;

        this.isOverwritten = false;
    }

    start() {
        super.start()

        if (this.isMain) {
            this.engine.camera = this;
        }

        if (this.transform) {
            this.target = this.transform;
        }
    }

    update(deltaTime) {
        if (this.engine.camera != this) return;

        if (this.isOverwritten) {
            this.engine.screenX = this.position.x;
            this.engine.screenY = this.position.y;
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
                // TODO: Implement... Too lazy rn
                break;
            case this.followTypes.SMOOTH_IN:
                // TODO: Implement... Too lazy rn
                break;
        
            default:
                break;
        }
        
        this.engine.screenX = this.position.x;
        this.engine.screenY = this.position.y;

        return;

        // Reference
    }
}