class Projectile extends Object {
    constructor(originPoint, targetPoint) {
        super("projectile", [new ColliderCircle(), new ProjectileController(originPoint, targetPoint)]);
        this.addTag("projectile");
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();

        this.drawOns.forEach(drawOn => {
            drawOn(ctx);
        });
    }
}