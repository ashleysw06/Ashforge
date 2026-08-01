class Game {
    constructor() {
        debug.log("Game.Initializing: Starting game initialization...");
        debug.log("Game.Initializing: Creating engine...");
        this.engine = new Engine();
        debug.log("Game.Initializing: Creating scene...");
        this.scene = new Scene();

        // ----- CREATE PLAYER -----
        const player = new Player();
        this.scene.addObject( player );

        // ----- DUMMY EXPIRIMENTS -----
        let dummy = new Object();
        dummy.name = "dummy";
        dummy.transform.vector2D = new Vector2D(-50, 0);
        //  dummy.transform.rotation2D.setRotDeg(45);
        // dummy.transform.scale2D = new Scale2D(8, 8);
        dummy.addComponent(new ColliderRectangle());

        //dummy.transform.setParent( player.transform );

        const dummyInteraction = new Interactable("player");
        dummyInteraction.onInteraction((e) => {
            console.log(e);
        })
        console.log(dummyInteraction);

        dummy.addComponent(dummyInteraction);
        dummy.addTag("test");
        this.scene.addObject( dummy );

        // ----- GENERATE RESOURCES -----
        const range = new Vector2D(1000, 1000);
        for (let i = 0; i < 100; i++) {
            let res = new Resource();
            res.transform.vector2D = new Vector2D(Math.random() * range.x - range.x / 2, Math.random() * range.y - range.y / 2);
            res.transform.rotation2D.setRotDeg(Math.random() * 360);
            this.scene.addObject( res );
        }

        this.isRunning = false;
    }

    start() {
        debug.log("Game.Start: Starting game...");
        this.isRunning = true;
        this.scene.game = this;
        this.engine.start(this.scene.objects);
    }
}