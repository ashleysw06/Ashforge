class Scene {
    constructor() {
        this.objects = [];
        this.queue = [];
    }

    getObjectByName(name) {
        return this.objects.find(object => object.name === name);
    }

    getObjectsByTag(tag) {
        return this.objects.filter(object => object.tags.indexOf(tag) > -1);
    }
    
    addObject(object) {
        object.transform.scene = this;
        object.scene = this;
        object.start();
        
        this.objects.push(object);
    }

    removeObject(object) {
        const index = this.objects.indexOf(object);
         if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    clear() {
        this.objects = [];
    }
}