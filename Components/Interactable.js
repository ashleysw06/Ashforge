class Interactable extends Component {
    constructor(tag) {
        super('Interactable');
        this.requireComponent("Collider");

        this.collider = null;

        this.tag = tag;
        this.range = 100;
        this.inRange = false;

        this.callbacks = [];
    }

    start() {
        super.start();
        this.collider = this.gameObject.getComponent("Collider");
        if (!this.callback) {
            debug.log(`${this.gameObject.name}[${this.name}]: missing callback`)
            this.gameObject.removeComponent(this);
            delete this;
        }
    }

    update(deltaTime) {
        this.inRange = false;
        this.scene.getObjectsByTag(this.tag).forEach(object => {
            if (this.gameObject.distance(object) < this.range) {
                this.transform.color = 'green';
                this.inRange = true;
            }
        });
    }

    onInteraction(callback) {
        this.callbacks.push(callback);
    }

    callback(events) {
        this.callbacks.forEach((callback) => {
            callback(events);
        })
    }

    _onKeyDown(event) {
        if (this.callback && event.key == "e" && this.inRange) {
            this.callback({
                action: "key",
                mouse: null,
                key: event.key,
                general: event.button + 1 || event.key
            });
        }
    }

    _onKeyUp(event) {
    }

    _onMouseDown(event) {
        const cursorPosition = new Vector2D(game.engine.worldSpaceMouseX, game.engine.worldSpaceMouseY);
        if (this.callback && this.collider.inBounds(cursorPosition) && this.inRange) {
            this.callback({
                action: "click",
                mouse: event.button + 1,
                key: null,
                general: event.button + 1 || event.key
            });
        }
    }

    _onMouseUp(event) {
    }
}