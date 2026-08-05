const engine = new Engine();
const scene = new Scene();

// Player using Prefab
const player = new Player();
scene.addObject( player );

// Object without prefab
let dummy = new Object();
dummy.name = "dummy";
dummy.transform.vector2D = new Vector2D(-50, 0);
dummy.addComponent(new ColliderRectangle());
const dummyInteraction = new Interactable("player");
dummyInteraction.onInteraction((e) => {
    console.log(e);
})
console.log(dummyInteraction);
dummy.addComponent(dummyInteraction);
dummy.addTag("test");
scene.addObject( dummy );

// Objects Generated
const range = new Vector2D(1000, 1000);
for (let i = 0; i < 100; i++) {
    let res = new Resource();
    res.transform.vector2D = new Vector2D(Math.random() * range.x - range.x / 2, Math.random() * range.y - range.y / 2);
    res.transform.rotation2D.setRotDeg(Math.random() * 360);
    scene.addObject( res );
}

// Start Engine
engine.start(scene.objects);

// Debugging
console.log(engine);