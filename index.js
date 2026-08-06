import Engine from '/src/Engine.js';
import Scene from '/src/Scene.js';
import Transform, { Vector2D, Scale2D, Rotation2D } from '/src/Transform.js';
import Object from '/src/Object.js';

import { Camera, Collider, ColliderCircle, ColliderRectangle, Interactable, PlayerController } from '/src/Components/_ModuleImports.js';

import FireProjectile from '/scripts/FireProjectile.js';
import ProjectileController from '/scripts/ProjectileController.js';
import ResourceHandler from '/scripts/ResourceHandler.js';

const engine = new Engine(document.getElementById('PlayField'));
const scene = new Scene();

// Player
const player = new Object("player", [new Camera(engine, true), new ColliderRectangle(), new PlayerController(), new FireProjectile()]);
player.addTag("player");
scene.addObject( player );

// Dummy
let dummy = new Object();
dummy.name = "dummy";
dummy.transform.vector2D = new Vector2D(-50, 0);
dummy.addComponent(new ColliderRectangle());
const dummyInteraction = new Interactable("player");
dummyInteraction.onInteraction((e) => {
    console.log(e);
})
dummy.addComponent(dummyInteraction);
dummy.addTag("test");
scene.addObject( dummy );

// Resource Generation
const range = new Vector2D(1000, 1000);
for (let i = 0; i < 100; i++) {
    let res = new Object("recources", [new ColliderCircle(), new Interactable("player"), new ResourceHandler()]);
    res.addTag("resource");
    res.transform.vector2D = new Vector2D(Math.random() * range.x - range.x / 2, Math.random() * range.y - range.y / 2);
    res.transform.rotation2D.setRotDeg(Math.random() * 360);
    scene.addObject( res );
}

// Start Engine
engine.start(scene);

// Debugging
console.log(engine);