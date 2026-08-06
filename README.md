# Ashforge

## About
A game engine built in JavaScript for Web based projects. Heavily inspired by Unity's component and transform system.<br>
This project is very work in progress. Many system will be rewritten. My current work flow is to get a feature working and leave it alone until it bothers me enough to want to fix.

## Why
Developed for no greater reason or to solve any problem. Just a personal project to make development of personal projects easier, while working in a codebase I made and understand.

# TODO
An unorganized mostly unfinished list of more or less everything I want to do or fix with this project,
- Switch everything to module script instead of index script references
- Engine Components vs User Made Components
- Make Collider base Component extending or required by Collider Rectangle and Circle.
- Rigidbody component instead of object to object collisions being built into collisions
- Class options `new Component(options)` for setting variables or other conditions in/used by the component
- Fix Children objects having inversed X and Y positions to their Parent object
- A lot more stuff I'm too lazy too think of right now


# Documentation
A lot of this is subject to change. This is written for now mostly as a placeholder.

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