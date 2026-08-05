// Expirimental Class. For testing. Won't ship with engine outside of Examples
class FireProjectile extends Component {
    constructor() {
        super('FireProjectile');
    }

    createProjectile() {
        const position = this.transform.vector2D.clone();
        let projectile = new Projectile(position, new Vector2D(engine.worldSpaceMouseX, engine.worldSpaceMouseY));
        projectile.transform.vector2D = position;
        
        const collider = projectile.getComponent("Collider");
        if (collider) collider.ignoreTag("player");
        projectile.addTag("playerProjectile");

        return projectile;
    }

    _onMouseDown(event) {
        if (event.button == 0) {
            let projectile = this.createProjectile();
            console.log(projectile)
            scene.addObject(projectile);
        }
    }
}