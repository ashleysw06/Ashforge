class Player extends Object {
    constructor() {
        super("player", [new Camera(true), new ColliderRectangle(), new PlayerController(), new FireProjectile()]);
        this.addTag("player");
    }

    draw(ctx) {
        ctx.fillRect(-2, -2, 4, 4);

        this.drawOns.forEach(drawOn => {
            drawOn(ctx);
        });
    }
}