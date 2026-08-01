class Resource extends Object {
    constructor() {
        super("recources", [new ColliderCircle(), new Interactable("player"), new ResourceHandler()]);
        this.addTag("resource");
    }

    draw(ctx) {
        if (!this.transform.inView) return;

        ctx.fillRect(-2, -2, 4, 4);

        this.drawOns.forEach(drawOn => {
            drawOn(ctx);
        });
    }
}