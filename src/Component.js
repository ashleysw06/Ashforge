export default class Component {
    constructor(name) {
        this.name = name;
        this.gameObject = null;
        this.transform = null;
        this.scene = null

        this.requiredComponents = [];
    }

    start() {
        this.scene = this.gameObject.scene;
        this.requiredComponents.forEach(componentName => {
            const component = this.gameObject.getComponent(componentName);
            if (!component) {
                debug.warn(`${this.gameObject.name}[${this.name}]: missing component, "${componentName}"`)
                this.gameObject.removeComponent(this);
                delete this;
            }
        });
    }

    update(deltaTime) {
        return;
    }

    requireComponent(componentName) {
        if (this.requiredComponents.indexOf(componentName) > -1) {
            debug.warn(`${this.name}: already requires component, "${componentName}"`)
            return;
        }
        this.requiredComponents.push(componentName);
    }
}