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

Welcome to the JS2Scratch documentation! This `README` file will contain everything you need to know about the project.
The first thing you'll need to do is download JS2Scratch. If you have `git` installed; you can simply run `git clone https://github.com/JS2Scratch/JS2Scratch` to download the latest version; else, you can download it from the github manually. Once downloaded, open the directory in which JS2Scratch is in, and run "`npm run setup`" to start the instalation process! Once done, you should get a fancy message. JS2Scratch has been installed!

### berry

You, the user, aren't provided with the JS2Scratch tool by default. You're actually instead given its handy CLI system, `blackberry`, (or `berry`, for short), which should already be downloaded. You can run `berry -v` to check the current version of `berry`.

Everything in JS2Scratch is handled in a project. There are 2 ways to create a project:
 - `berry init`: Creates a `berry` project in the current directory
 - `berry new [name = "my-project"] [path = "./"]`: Creates a `berry` project with the given name at the given location

Let's create a new project. we can run `berry new` to create a blank project, "my-project". There are now a handful of other commands we can use to make this project functional:
 - `berry run`: Builds & runs the currently-open project
 - `berry build`: Builds the currently-open project
 - `berry add [...lib]`: Add packages
 - `berry remove`: Remove packages
 - `berry update`: Update newly added packages in `Berry.toml`

Currently, we're only interested in `berry run` and `berry build`. `berry run` will build your project into an `sb3`, and open it with the [TurboWarp](https://turbowarp.org/editor) app (if installed). `berry build` just builds the project into an `sb3`. The `sb3` and `sb3` source can be found in `root/targets`.

### File structure

Now lets focus on the file structure, since there's a lot going on. It should look something like:
```bash
my-project:
    > assets
        > Sprite1...
        > stage...
    > lib
    > src
        > Sprite1.js
    > target
    > Berry.toml
    > project.d.json
```

`assets` simply contains.. assets for your project. That be costumes, sounds, etc. The purpose of `lib` will be covered later, so we don't need to worry about that now. `src` contains the scripts for our sprites, and `target` is where the built `sb3` will be placed. `Berry.toml` will also be covered later. Finally, `project.d.json` contains project data.

All of this is relatively simple. In `src`, we have a script named `Sprite1.js`. Since this is a standalone script with a name, it means that the script represents the entire sprite. We can't have another script representing the sprite.

To have multiple scripts representing a sprite, we can create a folder with the name of the sprite, and bundle all of our scripts. For example:

```bash
src
    > Sprite1
        > foo.js
        > bar.js
        > foobar.js
```

In this example, `foo`, `bar`, and `foobar` all belong to `Sprite1`. If you had *another* folder inside of that, it would be ignored, meaning:

```bash
src
    > Sprite1
        > foo.js
        > bar.js
        > mySubFolder
            > foobar.js
```

.. Is the exact same as the previous example. But, if that folders name starts with a "&", then the contents won't be ignored. E.x:

```bash
src
    > Sprite1
        > foo.js
        > bar.js
        > &mySubFolder
            > foobar.js
```
`foobar.js` will be treated as its own sprite, while `foo` and `bar` both belong to `Sprite1`.

The `assets` folder contains sub-folders for each sprite, and a special one named `stage` (which you MUST have for the `sb3` to build). Inside of that, you can find a structure similar to:

```bash
> Sprite1
    > costumes
        > costumes.json
        > default.svg

    > sound
        > sound.json

    >sprite.json
```

`sprite.json` contains details for the sprite that we're using; that be the `x`, `y`, `direction`, etc.
Both the `sound` and `costumes` folder house assets for either sounds or costumes. Each have a `.json` representing the scratch objects. For example, a costume with the name "Costume1" with a path of 'default.png' would be:

```json
[
  {
    "name": "Costume1",
    "file": "default.svg"
  }
]
```
> [!TIP]
> All files must be placed in the root of the `costumes` / `sound` folder. Do not add sub-folders. We also have a special `stage` sprite, which instead of building to a sprite, builds to (surprisingly), the stage!

# Programming

Opening the generated JS program, you should see something like:

```js
looks.say("Hello, World!");
```

This program is pretty self-explanitory. It makes the sprite say, "Hello, World!". There are a variety of JS features that are natively ported:

## Variables & assignment

All variables are global. If you have a variable and a list with the same name, the `sb3` will not build correctly.

```js
let x = 3; // Valid
let y = x; // Valid

y = 2 * 3; // Valid

// Reference to a list named 'example' (the _list_ will be omitted)
let z = _list_example

// hello_world.js

let myStr = "Hello, World!";
looks.say(myStr);
```

## Logical expressions

Keep in mind scratch is very strict with logical expressions. In some cases, JS2Scratch will attempt to solve them if they're not allowed in scratch, but it's better to know what the limitations are to avoid errors. A logical operator (`not`, `and`, `or`) can only have 2 possible values on either side. Another spiky block, a logical operator, or a binary operator (such as `<`, and `>`).

```js
5 && 3 // Invalid
5 < 2 && true // Valid
5 + 1 && false // Valid in some cases
```

## Control flow

### If statements

`if statements` work the same they do in normal JS; however you cannot do single-line `if statements`, such as:

```js
if (foo) foo.bar();
```

You can also use `else` and `else if` to extend the `if statement`:

```js
if (foo) {
    foo.bar();
} else {
    bar.foo();
}

if (barfoo) {
    foo.baz();
} else if (f) {
    baz.foo();
}
```

### While statements

Again, like `if statements`, `while statements` work exactly like they do in native JS:

```js
while (foo) {
    bar();
}
```

The only exception to this is that passing `true` makes it a `forever` loop:

```js
while (true) {
    bar();
}

foo(); // This will not be in the final program,
       // Since you can't have any blocks after a 
       // "forever" block.
```

### For Statements

`for statements`, again, are exactly like normal JS; the only exception being the first parameter must be an identifier:

```js
let i = 0;
for (i; i < 10) // Defaults to "i++";
{
    looks.say(i); 
}
```

### Switch statements

`switch statements`, in the final build, are compiled to `if statements`, so it's recomended you use `if statements` instead them! `switch statements` still work as normal. `break` is not necessary as the code won't flow through, so you can ommit it from your code.

```js
switch(foo)
{
    case bar: 
        looks.say("foobar!");
        break; // Optional. Will be ignored!
    
    case foobar:
    case foobaz: 
        looks.say("foobar, or foobaz!");
        break; // Optional. Will be ignored!
}
```

### Assignment

All compound operators (`++`, `--`, `+=`, `-=`, `*=`, `/=`) are present and can be used.

### Functions

All blocks provided in scratch (other than extension blocks, by default) are available for use.
Some blocks return values instead of blocks; meaning they won't work. For example:

```js
let x = operation.join("Hello, ", "World!"); // Works
operation.join("Hello, ", "World!"); // Unknown library "operation", Unknown function "join"
```

You, the user, can also define your own functions like in normal JS:

```js
function foo(bar)
{
    looks.say(operation.join("foo", bar, "!"));
}

foo("bar");
```

We can make this function "run without screen refresh" by giving it the `turbo` prefix:

```js
function turbo_foo(bar)
{
    looks.say(operation.join("foo", bar, "!"));
}

turbo_foo("bar");
```

This function will have a name of `foo`, and will "run without screen refresh".

> [!WARNING]
> Passing too many arguments, or too little, will cause the function to not run at all. The correct amount of arguments, if any, must be passed.

# Event blocks

Sometimes, you may not want the green-flag to be the header block of your program. You can add a simple directive to change this; the following is a list of all the directives. Some directives require arguments to make them work (E.g, when KEY pressed). These directives MUST be on the first line:

```js
//#whenflagclicked() -> When Green flag clicked
//#whenthisspriteclicked() -> When this sprite clicked
//#start_as_clone() -> When I start as clone
//#whenkeypressed(Key: string) -> When key pressed  -> Example: #whenkeypressed("space")
//#whenbackdropswitchesto(Backdrop: string) -> When backdrop switches to  -> Example: #whenbackdropswitchesto("Backdrop1")
//#whengreaterthan(Type: "loudness" | "timer", Amount: number) -> When greater than  -> Example: #whengreaterthan("loudness", 5)
//#whenbroadcastreceived(Name: string) -> When broadcast received  -> Example: #whenbroadcastreceived("Message1")
```

# The `berry` registry

`berry` does more than just create projects; it's a whole package manager! You can import a package from the `berry registry`, found [here](https://github.com/JS2Scratch/berry-registry)!

## Adding packages to a project

Open a project, and pick a package (along with a version). For example, lets choose `example-package`. We can simply run: `berry add example-package` to add it to the `lib` folder of our project.

> [!WARNING]
> This command may fail! It sends HTTP requests straight to the `git` api, meaning if you download too many packages in a short timeframe, errors may occur! It is actually better to specify the version you want to download (since it doesn't need to fetch the latest version, and instead downloads the specified version).

You can specify a specific version to download like so: `name@version`, for example: `example-package@0.0.1`.

## Removing packages from a project

Once the project is open, you can simply run: `berry remove <package-name>` to remove the given package(s). For example, `berry remove example-package`.

## Adding dependencies with `Berry.toml`

Opening `Berry.toml`, you may notice that you have a `[dependencies]` header, which contains a list of dependencies. You can add dependencies here, and run `berry update` to add them. Removing dependencies from this list won't work, as you'll have to use `berry remove`.

So, if you wanted to install `example-package`, version `0.0.1`:

```toml
[dependencies]
example-package = "0.0.1"
```

This command is ran automatically everytime you build.

## What even is a package?

A package contains data that extends the functionalities of the JS2Scratch compiler itself. This means adding:

```
- Extra functions
- Extra globals
- Extra JS features
```

# Package specification

> [!TIP]
> Everything you need to know about compiling projects is above. All the content below is for people who want to extend and add more to JS2Scratch!

You can create a package using `berry lib [name = my-package] [path = "./"]`. 
The file structure should look something like:

```bash
my-package
    > src
        > index.ts

    > utils
        > internal.ts
        > library.ts

    > Berry.toml
```

Unsurprisingly, `src` contains the source for our package, in `ts`. `utils` simply contains some blank type annotations for us (`.d.ts` files sometimes don't work!)

Lets create a simple package that adds functions / globals with the value of `tau`, `pi` * 2.
What we're looking for is a function that returns a value, a library, specifically known as a "valueLibrary".
We can return (using `module.exports`) in this format to get ready to create our function:

```ts
module.exports = {
    libraries: {
        valueLibraries: [
            
        ]
    }
};
```

Now, in the `valueLibraries` array, we can use the `createValueFunction`, from the `library` class, to create our function:

```ts
import { CallExpression } from "@babel/types";
import { BlockClustering, buildData, createValueFunction } from "../utils/library";

module.exports = {
    libraries: {
        valueLibraries: [
            createValueFunction({
                body: ((callExpression: CallExpression, blockCluster: BlockClustering, parentId: string, buildData: buildData) => {
                    return {
                        block: null,
                        blockId: null,
                        isStaticValue: true,
                    }
                })
            })
        ]
    }
};
```

And that's a HUGE amount of code to what we just had a second ago. We create a value-function using the `createValueFunction` function (that sentence is hard to read, I know), where we pass a function of name `body`. All that this function actually does is return ANOTHER function which contains type-checking, and other things that you may need while making a function.

As of above, all we return is a blank block (that will error). `block` contains a scratch value, and `blockId`, along with `isStaticValue` can be ignored.

Since all we're doing is returning a scratch-type, we can use the `getScratchType` function, from the `internal` class, to return a scratch-number. In this case, we're returning `tau`:

```ts
return {
    block: getScratchType(ScratchType.number, Math.PI * 2),
    blockId: null,
    isStaticValue: true,
}
```

And that's that function done. But this code won't actually work. That's because this code is a standalone function and not part of a library. We can wrap it in a library with the `createLibrary` function:

```ts
import { CallExpression } from "@babel/types";
import { BlockClustering, buildData, createLibrary, createValueFunction } from "../utils/library";
import { getScratchType, ScratchType } from "../utils/internal";

module.exports = {
    libraries: {
        valueLibraries: [
            createLibrary("example", {
                tau: createValueFunction({
                    body: ((callExpression: CallExpression, blockCluster: BlockClustering, parentId: string, buildData: buildData) => {
                        return {
                            block: getScratchType(ScratchType.number, Math.PI * 2),
                            blockId: null,
                            isStaticValue: true,
                        }
                    })
                })
            })
        ]
    }
};
```

This code will allow us to use the `example.tau()` function in our programs.
And to use this code, it's as simple as dragging it into the `lib` folder of a project.
Then, we can use this code:

```js
let foo = example.tau();
```

Now we can compile and run, using `berry run`, and voila! We created our own function, nice!
But, wouldn't it be nicer if it was a global instead of a function? Well, we can do that, and its even EASIER:

```ts
import { createGlobal } from "../utils/library";
import { getScratchType, ScratchType } from "../utils/internal";

module.exports = {
    globals: [
        createGlobal("tau", (() => {
            return {
                block: getScratchType(ScratchType.number, Math.PI * 2),
                blockId: null,
                isStaticValue: true,
            }
        }))
    ]
};
```

Here we create a global named `tau`, which has a value of.. well tau.
We can now replace our JS code with:

```js
let foo = tau;
```

Compile and run...It works! We set `foo` to the global `tau`, which has the value of `PI` * 2! Great.

## Other features of packages

We can also add full blocks. It works exactly the same way `createValueFunction` works, but we use `createFunction` instead, and put it under `blockLibraries` instead of `valueLibraries`.  To actually
ADD blocks, we need to utilise `BlockCluster`s (the `BlockClustering` type). These allow us to add clusters
of blocks. We can use the method `addBlocks` to add an object full of blocks. A block can be created with the `CreateBlock` function, and it represents a scratch block. E.x:

```ts
let id = "test"; // All blocks need a Block ID.
                 // Refer to the sb3 file structure
                 // For more information!

blockCluster.addBlocks({
    [id]: createBlock({
        opcode: BlockOpCode.LooksHide
    })
});
```

> [!TIP]
> Usually, you are provided with a `ParentId`. This is should be the ID of the first block you add. If your function returns a VALUE, it is the ID of the block your value is going to be added too.

Finally, you're also provided with `implementations`, which allow you to override the code that runs when the program encounters a specific `babel` type. There are 2 types of `implementations`, `implements`, and `type_implements`.

`implements` are used for a `babel` type that represent a block, or a group of blocks, for example, `IfStatement`. `type_implements` are used for `babel` types that represent values, like a `NumericLiteral`.

Like with globals, you can simply export it `implementations` under `implements`, or `type_implements`, depending on the type.

> [!TIP]
> `implementations` actually override the default JS2Scratch scripts, meaning you could rewrite code for every aspect!

The `createImplementation` function is used to.. create an `implementation`. All you need to do to create an implementation, is to pass the `babel` type, along with a function that will be ran. E.x:

```ts
import { buildData, createImplementation } from "../utils/library";
import { getScratchType, ScratchType } from "../utils/internal";
import { NumericLiteral } from "@babel/types";
import { BlockCluster } from "../../../../src/util/blocks";

module.exports = {
    type_implements: createImplementation<NumericLiteral>("NumericLiteral", ((blockCluster: BlockCluster, NumericLiteral, buildData: buildData) => {
        console.log("Encountered a number!")
        
        return {
            isStaticValue: true,
            blockId: null,
            block: getScratchType(ScratchType.number, NumericLiteral.value)
        }
    }))
};
```