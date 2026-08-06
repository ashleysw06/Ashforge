import { Component } from '../Ashforge/Engine.js';

export class FireProjectile extends Component {
    constructor() {
        super('FireProjectile');
    }

    createProjectile() {
        const position = this.transform.vector2D.clone();
        new Object("projectile", [new ColliderCircle(), new ProjectileController(position, new Vector2D(engine.worldSpaceMouseX, engine.worldSpaceMouseY))]);
        projectile.addTag("projectile");
        projectile.transform.vector2D = position;
        
        const collider = projectile.getComponent("Collider");
        if (collider) collider.ignoreTag("player");
        projectile.addTag("playerProjectile");

        return projectile;
    }

    _onMouseDown(event) {
        if (event.button == 0) {
            let projectile = this.createProjectile();
            scene.addObject(projectile);
        }
    }
}