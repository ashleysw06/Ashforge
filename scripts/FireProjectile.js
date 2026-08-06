import Component from '/src/Component.js';
import Transform, { Vector2D, Scale2D, Rotation2D } from '/src/Transform.js';
import Object from '/src/Object.js';

import { ColliderCircle } from '/src/Components/_ModuleImports.js';
import ProjectileController from './ProjectileController.js';

export default class FireProjectile extends Component {
    constructor() {
        super('FireProjectile');
    }

    createProjectile() {
        const mouse = window._mouse.world;
        const position = this.transform.vector2D.clone();
        const projectile = new Object("projectile", [new ColliderCircle(), new ProjectileController(position, new Vector2D(mouse.x, mouse.y))]);
        projectile.addTag("projectile");
        projectile.transform.vector2D = position;
        
        const collider = projectile.getComponent("Collider");
        if (collider) collider.ignoreTag("player");
        projectile.addTag("playerProjectile");

        return projectile;
    }

    _onMouseDown(event) {
        if (event.button == 2) {
            let projectile = this.createProjectile();
            window._gov.scene.addObject(projectile); // TODO: Make import for handling scene interactions
        }
    }
}