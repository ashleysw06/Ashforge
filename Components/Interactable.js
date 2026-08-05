class Interactable extends Component {
    constructor(tag) {
        super('Interactable');
        this.requireComponent("Collider");

        this.collider = null;

        this.tag = tag;
        this.range = 100;
        this.inRange = false;

        this.callbacks = [];

        this.interactionKey = 'e';
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
    
    createCallback(action, subAction, mouse, key, general, addToCallBacks = false) {
        mouse += 1; // normal: 0 - 2 | 0 returns false | + 1 for `if (mouse)` conditions

        const callback = {
            action: action,
            subAction: subAction,
            mouse: mouse || null,
            key: key || null,
            general: general || mouse || key
        }

        if (addToCallBacks) {
            this.callback(callback);
        }

        return callback;
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
        if (this.callback && event.key == this.interactionKey && this.inRange) {
            this.createCallback("key", "keyDown", null, event.key, null, true)
        }
    }

    _onKeyUp(event) {
        if (this.callback && event.key == this.interactionKey && this.inRange) {
            this.createCallback("key", "keyUp", null, event.key, null, true)
        }
    }

    _onMouseDown(event) {
        const cursorPosition = new Vector2D(engine.worldSpaceMouseX, engine.worldSpaceMouseY);
        if (this.callback && this.collider.inBounds(cursorPosition) && this.inRange) {
            this.createCallback("click", "mouseDown", event.button, null, null, true)
        }
    }

    _onMouseUp(event) {
        const cursorPosition = new Vector2D(engine.worldSpaceMouseX, engine.worldSpaceMouseY);
        if (this.callback && this.collider.inBounds(cursorPosition) && this.inRange) {
            this.createCallback("click", "mouseUp", event.button, null, null, true)
        }
    }
}