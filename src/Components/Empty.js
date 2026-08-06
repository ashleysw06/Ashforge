import Component from '/src/Component.js';
import Transform, { Vector2D, Scale2D, Rotation2D } from '/src/Transform.js';

export default class Empty extends Component {
    constructor() {
        super('ComponentName');
    }

    start() {
        super.start();
    }

    update(deltaTime) {
    }

    _onKeyDown(event) {
    }

    _onKeyUp(event) {
    }

    _onMouseDown(event) {
    }

    _onMouseUp(event) {
    }
}