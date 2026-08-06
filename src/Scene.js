export default class Scene {
    constructor() {
        this.objects = [];
        this.queue = [];
    }

    getObjectByName(name) {
        return this.objects.find(object => object.name === name);
    }

    getObjectsWithTag(tag) {
        return this.objects.filter(object => object.tags.indexOf(tag) > -1);
    }

    getObjectsWithTags(tags) {
        return this.objects.filter(object => {
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                if (object.tags.indexOf(tag) > -1) {
                    return true;
                }
            }
            return false;
        });
    }
    
    getObjectsWithoutTag(tag) {
        return this.objects.filter(object => object.tags.indexOf(tag) == -1);
    }
    
    getObjectsWithoutTags(tags) {
        return this.objects.filter(object => {
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                if (object.tags.indexOf(tag) > -1) {
                    return false;
                }
            }
            return true;
        });
    }

    addObject(object) {
        object.transform.scene = this;
        object.scene = this;

        if (window._gov.isRunning) object.start();
        
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