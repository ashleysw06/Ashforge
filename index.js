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
    
    if (e.key == "e")
        player.transform.addChild(parent.transform)
    
    if (e.subAction == "mouseUp") {
        parent.transform.scale.x *= 0.5
        parent.transform.scale.y *= 0.5
    }
    
    if (e.subAction == "mouseDown") {
        parent.transform.scale.x *= 2
        parent.transform.scale.y *= 2
    }
})
dummy.addComponent(dummyInteraction);
dummy.addTag("test");
scene.addObject( dummy );


let parent = new Object();
parent.name = "dummy";
parent.transform.vector2D = new Vector2D(100, 0);
parent.addComponent(new ColliderRectangle());
parent.addTag("test");
scene.addObject( parent );

let child = new Object();
child.name = "dummy";
child.transform.vector2D = new Vector2D(50, 50);
child.addComponent(new ColliderRectangle());
child.addTag("test");
scene.addObject( child );

parent.transform.addChild(child.transform)

setInterval(() => {
    parent.transform.rotation2D.rotateDeg(360 / 4 / 120)
},1000 / 30)

// Resource Generation
const range = new Vector2D(1000, 1000);
for (let i = 0; i < 10; i++) {
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