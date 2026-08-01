class Engine {
    constructor() {
        debug.log("Engine.Create: Detecting canvas...");
        this.canvas = document.getElementById('PlayField');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        debug.log("Engine.Create: Resizing canvas...");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.img = new Image();
        this.img.src = "./forge.png";
        
        this.img.onload = () => {
            this.img = this.ctx.createPattern(this.img, "repeat");
        }

        debug.log("Engine.Create: Setting screen boundaries...");
        this.screenLeft = 0;
        this.screenRight = this.canvas.width;
        this.screenTop = 0;
        this.screenBottom = this.canvas.height;

        debug.log("Engine.Create: Setting context offset...");
        this.screenX = 0;
        this.screenY = 0;

        debug.log("Engine.Create: Adding event listeners: resize...");
        window.addEventListener("resize", (e) => {
            this.ctx.imageSmoothingEnabled = false;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.screenLeft = 0;
            this.screenRight = this.canvas.width;
            this.screenTop = 0;
            this.screenBottom = this.canvas.height;
        });

        debug.log("Engine.Create: Adding event listeners: wheel...");
        this.canvas.addEventListener('wheel', (e) => {
            return;
        });

        debug.log("Engine.Create: Adding event listeners: cursor variables...");
        this.isMouseDown = false;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastMouseDragX = 0;
        this.lastMouseDragY = 0;
        this.worldSpaceMouseX = 0;
        this.worldSpaceMouseY = 0;

        debug.log("Engine.Create: Adding event listeners: mousedown...");
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault()
            
            this.scene.forEach(object => {
                for (const component of object.components) {
                    if (component._onMouseDown) {
                        component._onMouseDown(e);
                    }
                }
            });

            this.isMouseDown = true;
        });

        debug.log("Engine.Create: Adding event listeners: mouseup...");
        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault()
            
            this.scene.forEach(object => {
                for (const component of object.components) {
                    if (component._onMouseUp) {
                        component._onMouseUp(e);
                    }
                }
            });

            this.isMouseDown = false;
        });
        
        debug.log("Engine.Create: Adding event listeners: contextmenu...");
        window.addEventListener(`contextmenu`, (e) => {
            e.preventDefault();
        });

        debug.log("Engine.Create: Adding event listeners: mousemove...");
        this.canvas.addEventListener('mousemove', (e) => {
            const inScreenBoundsX = e.clientX >= this.screenLeft && e.clientX <= this.screenRight;
            const inScreenBoundsY = e.clientY >= this.screenTop && e.clientY <= this.screenBottom;
            const inScreenBounds = inScreenBoundsX && inScreenBoundsY;
            if (!inScreenBounds) {
                return;
            }
            
            // this.worldSpaceMouseX = e.clientX - (this.screenRight / 2 - this.screenX);
            // this.worldSpaceMouseY = e.clientY - (this.screenBottom / 2 - this.screenY);
            
            if (this.isMouseDown) {
                this.isDragging = true
                this.lastMouseDragX = e.clientX;
                this.lastMouseDragY = e.clientY;
                return;
            }
            this.isDragging = false
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        debug.log("Engine.Create: Adding event listeners: keydown...");
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3') {
                debug.debugMode = !debug.debugMode;
            }

            this.scene.forEach(object => {
                for (const component of object.components) {
                    if (component._onKeyDown) {
                        component._onKeyDown(e);
                    }
                }
            });
            return;
        });

        debug.log("Engine.Create: Adding event listeners: keyup...");
        document.addEventListener('keyup', (e) => {
            this.scene.forEach(object => {
                for (const component of object.components) {
                    if (component._onKeyUp) {
                        component._onKeyUp(e);
                    }
                }
            });
            return;
        });

        debug.log("Engine.Create: Initializing delta times...");
        this.lastUpdateTime = performance.now();
        this.lastFrameTime = performance.now();
        this.smoothFps = [];

        debug.log("Engine.Create: Initializing empty scene...");
        this.scene = [];
    }

    start(scene) {
        debug.log("Engine.Start: Loading scene...");
        this.loadScene(scene);
        debug.log("Engine.Start: Beginning game loop...");
        this.update();
    }

    loadScene(scene) {
        debug.log("Engine.LoadScene: Obtaining scene objects...");
        this.scene = scene;
        debug.log("Engine.LoadScene: Processing scene objects...");
        this.scene.forEach(object => {
            if (object.start) {
                debug.log(`Object.Start: Starting object: ${object.name}...`);
                object.start();
            }
        });
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        
        this.worldSpaceMouseX = (this.isDragging ? this.lastMouseDragX : this.lastMouseX) - (this.screenRight / 2 - this.screenX);
        this.worldSpaceMouseY = (this.isDragging ? this.lastMouseDragY : this.lastMouseY) - (this.screenBottom / 2 - this.screenY);

        this.scene.forEach(object => {
            if (object.update) {
                object.transform.update(deltaTime);
                object.update(deltaTime);
            }
        });

        this.draw();
        this.drawFps(deltaTime);

        this.lastUpdateTime = currentTime;

        requestAnimationFrame(() => this.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.scene.sort((a, b) => a.transform.vector2D.position.y - b.transform.vector2D.position.y);
        this.ctx.save();
        if (game) {
            this.ctx.translate(
                -this.screenX + this.screenRight / 2,
                -this.screenY + this.screenBottom / 2
            );
        }
        
        this.ctx.fillStyle = this.img;
        this.ctx.fillRect(this.screenX - this.screenRight / 2, this.screenY - this.screenBottom / 2, this.screenRight, this.screenBottom);

        this.ctx.fillStyle = 'black';
        this.scene.forEach(object => {
            const transform = object.transform.getGlobalTransform()
            if (!object.transform.inView) return;
            this.ctx.save();
            // this.ctx.translate(object.transform.vector2D.position.x, object.transform.vector2D.position.y);
            // this.ctx.rotate(object.transform.rotation2D.getRotRad());
            // this.ctx.scale(object.transform.scale2D.scale.x, object.transform.scale2D.scale.y);

            this.ctx.translate(transform.position.x, transform.position.y);
            this.ctx.rotate(transform.rotation.rot);
            this.ctx.scale(transform.scale.x, transform.scale.y);

            object.draw(this.ctx);
            if (debug.debugMode) {
                if (object.transform) {
                    object.transform.draw(this.ctx);
                }
            }
            this.ctx.restore();
        });
        this.drawCursor();
        this.ctx.restore();

        if (debug.debugMode && this.isDragging) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red'
            this.ctx.moveTo(this.lastMouseX, this.lastMouseY);
            this.ctx.lineTo(this.lastMouseDragX, this.lastMouseDragY);
            this.ctx.stroke();
        }
    }

    drawFps(deltaTime) {
        const decimalPlaces = 2;
        const fps = 1 / deltaTime;
        const fontSize = 16;
        const position = new Vector2D(0, 0);

        this.smoothFps.push(fps);
        if (this.smoothFps.length > fps) {
            this.smoothFps.shift();
        }
        const avgFps = this.smoothFps.reduce((a, b) => a + b, 0) / this.smoothFps.length;
        this.ctx.fillStyle = 'black';
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillText(`FPS: ${avgFps.toFixed(decimalPlaces)}`, position.x, this.screenBottom - ( fontSize / 2 ) - position.y);
    }

    drawCursor() {
        this.ctx.fillStyle = 'black';
        this.ctx.save();
        this.ctx.translate(this.worldSpaceMouseX, this.worldSpaceMouseY);
        this.ctx.fillRect(-5, -5, 10, 10);
        this.ctx.restore();
    }
}