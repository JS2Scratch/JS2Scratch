<div align="center"> 
  
# `✨ JS2Scratch`

**Convert JavaScript code to a usable Scratch project in realtime.** 

</div>

---
This repository contains everything you need to start developing with JavaScript on [Scratch](https://scratch.mit.edu)!

## Prerequisites

**This project requires you to have the following tools installed:**
- [Node](https://nodejs.org) (version >= 16)

## Setup

### Installation

Run `npm i` in your terminal to install all dependencies.

### Building a project using the CLI
To create a project, you can run `npm src new`, with an optional flag of "`-i`" for its location.
Example:
- `node src new` (Creates it in the root folder)
- `node src new -i C:/AmazingScratchPrograms` (`C:/AmazingScratchPrograms/Project`)

To build, you can use (surprisingly) `npm src build`, which has the following flags:
- `-i / -input string`: Input project directory.
- `-o / -out / -output string`: Output project directory. If not provided, then `root/Out`.
- `-t / -turbo / -turbowarp bool`: Whether to open the TurboWarp app if the user is on Windows.

### Project file structure

Projects have a specific file structure that needs to be met so they can be compiled. The Project structure looks like something along these lines:
```
- Project
    - project.d.json
    - Sprite1.sprite
        - main.js

    - Stage.background
        - myEpicFile.js
        - myAmazingFunction.js
```
Every project **must** contain a `project.d.json`. It contains the sprites, costumes, and sounds that you want to import. An example of a `project.d.json`:
```json
{
    "Sprite1": {
        "Type": "Sprite",
        "Costumes": [
            [
                "CostumeName",
                "PathToPNGForCostume"
            ]
        ],
        "Sounds": [
            [
                "SoundName",
                "PathToMP3ForSound"
            ]
        ]
    }
}
```
You should have a folder for your Sprite(s) and your background. Within that folder, there should be `JS` files: Each one serves as a stack of blocks.
Be careful with sprite names. Try to give each sprite a different name. Avoid multiple sprites with the same name, but with different cases. E.g: `sprite1` and `Sprite1`.

**Note:** After compiling, always open the Project in TurboWarp, and re-save it. This removes any micro-corruptions allowing for the project to be used in Scratch.

## Writing programs - Documentation & Tutorials

### Deviations from JavaScript / Scratch

It's impossible to create a 1-1 port of JavaScript to Scratch, so there are a few things that are different:

- Variables declared in scopes are global. All variables can be accessed from anywhere.
- Lists (arrays) start at 1 instead of 0 (Like lua)
- Not all logical expressions can be resolved. Scratch is very picky about what blocks can fit in other blocks.
- In some functions (e.g list.newList), if the types of the arguments are wrong, the block will not get transpiled and it will be ignored. No errors will be thrown.
- In some functions (e.g list.newList), variables cannot be passed and the value (usually a string) must be passed - This only applies to some functions. For example, the sensing.touchingColor function can take any type as an input.
- Nothing needs to be required / imported. Intellisense is provided automatically.

### Writing your first program

The best place to start is to write a "Hello, World!" Program:
```js
// Make our sprite say: "Hello, World!"
looks.say("Hello, World!");
```
This code, once compiled, should create a valid "Hello, World!" Program. There are a variety of modules and functions for you to use.
### Variables

Currently, all variables are global. Like in normal JavaScript, you can declare a variable with the `let` / `var` / `const` keyword(s). `const` does not currently create a constant variable.
You can create a simple program like this:
```js
// Declare our variables
let x = 5;
let y = 2;

// "log" our output.
looks.say(x * y);
```

### Logical Expressions

Scratch is very picky with logical expressions - so not all expected logical expressions can be parsed. Usually, a valid logical expression looks something like:
```js
x == y && y == z
```
As long as the elements either side of the operator (&&, or ||) are:
- Logical Expressions
- Binary Expressions
- Function calls (if the block is a boolean)
- Booleans

an error will not be raised.

### Control Flow

#### If statements

If statements can be used like in normal JavaScript. **Note:** Babel, a dependency, may not compile: `} else if {`, so you may have to do: `} else { if (...) {...} }`.
```js
// Declare our variables
let x = 5;
let y = 2;

// If X multiplied by Y is 10, then tell the user so. Else, say that it isn't.
if (x * y == 10) {
    looks.say("X times Y is 10!");
} else {
    // Join the string together
    looks.say(operation.join("X times Y is not 10, but ", x * y, ""));
}
```

#### While statements

To create a forever statement, pass "`true`" as the condition in the while statement. Whle statements behave exactly like normal while statements.
```js
// Declare our variables
let x = 5;
let y = 2;

// Nested while and forever loops
while (true) {
    while ((x + y) < 20) {
        x++;
        y++;
    } 
}
```

#### Switch statements

Since jump-tables cannot be compiled, switch statements are directly transformed into an if statement. Chaining cases may cause the compiler to fail - In this case, re-compile again until it is successful.
A switch statement *must* take its main operand as a variable. Default cases are currently not supported.
```js
// Declare our variables
let x = 5;
let y = 2;

let result = x*y;

// Display the number.
switch(result) {
    case 10:
        looks.say("The result seems to be 10")
        break;

    case 20:
        looks.say("The result seems not to be 10, but 20")
}
```

### Arrays

Since arrays are constructed during runtime, every function requires its first argument to be a string - the name of the array.
Arrays start at 1, like in lua, instead of 0.

```js
// Create our array
list.newList("myList", ["apple", "banana", "cherry"]);

// Say if our array contains item: "banana".
looks.say(list.listContainsItem("myList", "banana"));
```

### Constants

There are some constant values that exist that you can utilise:

```js
X: number;
Y: number;
Direction: number;

Size: number;

Volume: number;
Answer: string;
MouseX: number;
MouseY: number;
Loudness: number;
Timer: number;
DaysSince2000: number;
Username: string;
```

### Custom blocks (Procedures, or mutations)

Custom blocks, at the moment, do not support parameters and arguments. A custom block must be created in its own JS File.
Suppose you have this file structure:
```
- Root
    -Sprite1.sprite:
        - myAmazingFunction.js
        - main.js
    ...
```
"`myAmazingFunction.js`" would look something like:
```js
// Anything not in the body of the function
// will not be compiled.

function sayHelloWorld() {
    looks.say("Hello, World!");
}
```
This then could be called from `main.js`:
```js
sayHelloWorld();
```

To make a function run without screen refresh, simply add the prefix of "`turbo_`" to the start of the function name. E.g: `turbo_sayHelloWorld()`. When calling the function, you must also add this prefix.
The function name will be compiled into (in the example provided) "sayHelloWorld" - meaning you cannot have 2 functions with the same name, even if one runs without screen refresh. Visual Example:
```js
// myAmazingFunction.js

function turbo_sayHelloWorld() {
    looks.say("Hello, World!");
}

// This will not get compiled.
looks.say("Hello!");

// main.js
turbo_sayHelloWorld();
```
### Event blocks

Sometimes, you may not want the green flag to be the header block of your program. You can add a simple directive to change this. This is a list of all the directives; some directives
require arguments to make them work (E.g, when KEY pressed). These directives MUST be on the first line.
```js
//#whenflagclicked() -> When Green flag clicked
//#whenthisspriteclicked() -> When this sprite clicked
//#start_as_clone() -> When I start as clone
//#whenkeypressed(Key: string) -> When key pressed  -> Example: #whenkeypressed("space")
//#whenbackdropswitchesto(Backdrop: string) -> When backdrop switches to  -> Example: #whenbackdropswitchesto("Backdrop1")
//#whengreaterthan(Type: "loudness" | "timer", Amount: number) -> When greater than  -> Example: #whengreaterthan("loudness", 5)
//#whenbroadcastreceived(Name: string) -> When broadcast received  -> Example: #whenbroadcastreceived("Message1")
```

### Additional functions

There are additional functions that are not in native Scratch that exist:

- `looks.previousCostume()` - Changes the costume to the previous costume.
- `looks.previousBackdrop()` - Changes the backdrop to the previous backdrop.
  
- `math.pow(base: number, exponent: number)` - Raises the number to the given power. Doesn't work with negative numbers.
- `math.pi()` - The ratio of a circle's circumference to its diameter.
  
- `control.heartbeat()` - A more accurate version of `wait`, waiting the exact amount of time provided, ignoring Turbo mode if on.

### Limitations
- Custom blocks arguments
- No error catching
- Medicore error messages
- Extensions cannot be used

### Plans
- Custom block arguments
- Error catching
- Extensions
- Rust-Like error messages
- Realtime compiler as you type.
