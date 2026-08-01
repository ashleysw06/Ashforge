class Object {
    constructor(name, components) {
        this.name = name;
        this.tags = [];

        this.scene = null;
        this.transform = new Transform();
        this.transform.gameObject = this;
        this.components = components || [];
        this.instanceID = crypto.randomUUID();

        this.addTag("object");
        this.drawOns = [];
    }

    start() {
        for (const component of this.components) {
            component.gameObject = this;
            component.transform = this.transform;
            if (component.start) {
                component.start();
            }
        }
    }

    update(deltaTime) {
        for (const component of this.components) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }

    getComponent(componentName) {
        return this.components.find(c => c.name === componentName);
    }

    addComponent(component) {
        this.components.push(component);
    }

    removeComponent(componentName) {
        this.components = this.components.filter(c => c.name !== componentName);
    }

    addTag(tag) {
        if (this.tags.indexOf(tag) > -1) {
            debug.warn(`${this.name}: already has tag, "${tag}"`)
            return;
        }
        this.tags.push(tag);
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
    }

    hasTag(tag) {
        return this.tags.indexOf(tag) > -1;
    }

    distance(object) {
        const transform = this.transform.getGlobalTransform();
        const objTransform = object.transform.getGlobalTransform();
        const distance = Math.sqrt( 
            Math.pow(transform.position.x - objTransform.position.x, 2) + 
            Math.pow(transform.position.y - objTransform.position.y, 2) 
        )
        return distance;
    }

    destroy() {
        this.transform.scene.removeObject(this);
        delete this;
    }

    draw(ctx) {
        ctx.fillRect(-2, -2, 4, 4);

        this.drawOns.forEach(drawOn => {
            drawOn(ctx);
        });
    }
}