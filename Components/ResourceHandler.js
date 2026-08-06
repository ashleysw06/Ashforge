// Expirimental Class. For testing. Won't ship with engine outside of Examples
class ResourceHandler extends Component {
    constructor() {
        super('ResourceHandler');
        this.requireComponent("Collider");
        this.requireComponent("Interactable");

        this.flash = 0;
        this.health = 10;
    }

    start() {
        super.start();
        this.transform.scale2D = new Scale2D(7.5, 7.5)

        const collider = this.gameObject.getComponent("Collider");
        collider.onCollision((self, object) => {
            if (object.hasTag("player")) {
                //self.destroy();
            }
        })

        const interaction = this.gameObject.getComponent("Interactable");
        interaction.onInteraction((e) => {
            if (e.action == "click" && e.mouse == 1) {
                this.health -= 1;
                this.flash = 0.75;

                
                const position = this.transform.vector2D.clone();
                let projectile = new Projectile(position, new Vector2D(position.x, position.y - 100));
                projectile.removeComponent("Collider")
                projectile.transform.vector2D = position;
                projectile.getComponent("ProjectileController").speed = 150
                projectile.getComponent("ProjectileController").range = 150
                projectile.draw = (ctx) => {
                    ctx.rotate(-projectile.transform.rotation2D.getRotRad());
                    const size = 8
                    const text = "-1"
                    ctx.font = `${size}px serif`;
                    ctx.fillStyle = "red";
                    ctx.fillText(text, -text.length / 2 * size / 2, -4);
                };
                this.scene.addObject(projectile);
            }
        })
        interaction.range = 50;

        this.gameObject.drawOns.push((ctx) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.flash)})`;
            ctx.fillRect(-2, -2, 4, 4);
        })
    }

    update(deltaTime) {
        if (this.health < 1) {
            this.gameObject.destroy();
        }
        this.flash -= deltaTime * 5;
    }

    _onKeyDown(event) {
    }

    _onKeyUp(event) {
    }

    _onMouseDown(event) {
    }

    _onMouseUp(event) {
    }
}