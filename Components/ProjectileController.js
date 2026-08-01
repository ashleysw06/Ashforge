class ProjectileController extends Component {
    constructor(originPoint, targetPoint) {
        super('ProjectileController');

        this.speed = 500;
        this.range = 500;
        
        this.originPoint = originPoint.clone() || new Vector2D(0, 0);
        this.targetPoint = targetPoint.clone() || new Vector2D(0, 0);
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        const tDistance = Math.sqrt( 
            Math.pow(this.transform.vector2D.position.x - this.originPoint.position.x, 2) + 
            Math.pow(this.transform.vector2D.position.y - this.originPoint.position.y, 2) 
        )

        if (this.range && tDistance > this.range) {
            this.gameObject.destroy();
            return;
        }

        const xDistance = this.targetPoint.position.x - this.originPoint.position.x;
        const yDistance = this.targetPoint.position.y - this.originPoint.position.y;
        const angle = Math.atan2(yDistance, xDistance) * (180 / Math.PI);
        this.transform.rotation2D.setRotDeg(angle);
        
        const velocity = (new Vector2D(xDistance, yDistance)).normalize();
        
        velocity.position.x *= this.speed;
        velocity.position.y *= this.speed;

        this.transform.vector2D.position.x += velocity.position.x * deltaTime;
        this.transform.vector2D.position.y += velocity.position.y * deltaTime;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.transform.vector2D.position.x, this.transform.vector2D.position.y);
        ctx.rotate(this.transform.rotation2D.getRotRad());
        ctx.scale(this.transform.scale2D.x, this.transform.scale2D.y);

        ctx.fillRect(-12, -12, 25, 25, 'green');

        ctx.restore();
    }
}