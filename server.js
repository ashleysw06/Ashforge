class server {
    constructor() {
        this.port = 3000;
    }

    start() {
        console.log(`Server is running on port ${this.port}`);
    }
}

class user {
    constructor(name) {
        this.name = name;
        this.position = { x: 0, y: 0 };
    }
}

