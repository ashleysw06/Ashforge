# Ashforge

## About

A game engine built in JavaScript for Web based projects. Heavily inspired by Unity's component and transform system.

This project is very work in progress. Many system will be rewritten. My current work flow is to get a feature working and leave it alone until it bothers me enough to want to fix.

Version: v0.0.1b

# TODO & GOALS
An unorganized mostly unfinished list of more or less everything I want to do or fix with this project,

- Rigidbody component instead of object to object collisions being built into collisions component 🤯
- Class options `new Component(options)` for setting variables or other conditions in/used by the component
- UI system ( Panels, Buttons, Controller input / Changing menus with ←↑↓→) ( + Styling system )
- Audio system
- (Maybe Fixed?) Fix Children objects having inversed X and Y positions to their Parent object
- A lot more stuff I'm too lazy too think of right now
- Optimization ( Currently FPS starts dropping after 250 resources, Reached 30FPS by 500 resources )
- Expiriment with multiplayer
- Increase event type support
- Proper Documentation, Examples and Guide on how to get started
- Game Enginify ( Game window, Heirarchy, Inspector, Scripting, Exporting, Importing)
- Fix collisions ( Thinking polygon system for everything )
- Develop more of the game experience thing
- Built in Save / Load support


# Documentation ( OUTDATED... PROBABLY )
A lot of this is subject to change. This is written for now mostly as a placeholder.

## Getting Started

Here's a basic Example to get you started

```js
const engine = new Engine();
const scene = new Scene();

const player = new Object();

player.addComponent(new Camera(true))
player.addComponent(new PlayerController())

scene.addObject( player );

engine.start(scene.objects);
```

#### Initiating Engine:

`const engine = new Engine();`

- Must be named `engine`
- Creates the Engine that will handle and manage all gameObjects

`const scene = new Scene();`

- Must be named `scene` | This will be changed later once support for more scenes is added
- Create a Scene that you can add objects too with `scene.addObject( object );`

#### Creating The Player:

`const player = new Object();` - Create's an object we'll call Player

`player.addComponent(new Camera(true))`

- Gives player the Camera Component
- `new Camera(true)` the `true` for the Camera Component assigns it as the main camera

`player.addComponent(new PlayerController())`

- Add Player Controller Component
- Basic player movement
- Changes how the camera works |  This will probably be changed later as it moves away from being an Expirimental Component

#### Adding Objects To The Scene:

`scene.addObject( player );` 

- Add's the player to the scene
- This works for any object you create
- As of now there is no handling if you add the same object multiple times, issues not tested for

#### Starting The Engine:

`engine.start(scene.objects);` - This starts the engine, call it after you've set everything up

## Transform

Transform handles most if not all positional data:

#### Local transform information

- `vector2D` as `position`
- `scale2D` as `scale`
- `rotation2D` as `rotation`

#### Global transform information

you can get the global from `transform.getGlobalTransform()`, there is also `getGlobalPosition()`, `getGlobalScale()`, and `getGlobalRotation()`. 

#### Other transform

`setParent( transform )` sets the transform of another object to the parent of this object
`addChild( transform )` sets the transform of this object to the parent of another object
`getCardinalDirection()` returns data about what direction it's facing, looks like `{ direction: "N", name: "North", startAngle: -22.5, endAngle: 22.5 }`

## Components
`requireComponent(ComponentName: string)` checks if a component is on the same gameObject, with ComponentName, assigned with `super('ComponentName');` ( not the class name ) when the component is constructed.
```js
class ComponentName extends Component {
    constructor() {
        super('ComponentName');
        this.requireComponent("AnotherComponentName") // Case sensitive, super('ComponentName');
    }

    start() {
        super.start();
    }

    update(deltaTime) {
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
```

## Prefabs & Objects

Objects extend the Object class, which gives many usefull functions.

```js
class ObjectName extends Object {
    constructor() {
        super("objectName", [new ComponentA(), new ComponentB(), new ComponentC()]);
        this.addTag("object");
    }

    draw(ctx) { }
}
```

Or define a new object as an `Object`

```js
let object = new Object();
object.name = "Object";
object.addTag("object");

object.transform.vector2D = new Vector2D(-50, 0);

object.addComponent(new ColliderRectangle());

const interactableComponent = new Interactable("player");
interactableComponent.onInteraction((e) => {
    console.log(e);
})
object.addComponent(interactableComponent);

scene.addObject( dummy );
```

## The Scene

`scene.addObject( new ObjectClassName() );` - Adds an object to the Scene