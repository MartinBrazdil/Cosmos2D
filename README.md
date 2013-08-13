Cosmos2D
========

What is Cosmos2D?

Cosmos2D is JavaScript game engine prototype. Its objective is modularity, reusability and readability. I am trying to achieve the goal by workflow which separates abstraction and parametrization.

Project structure?

Project is divided to modules (inspired by JQuery module syntax) and there is python script which builds code together and minify it to one file. For now it also includes Properties (explained next).

Basic idea?

Core interface consists of Space and Time. There live Entities. Each Entity has Properties. Those Properties are parametrized by Assets. Parametrization supports Value and Event binding.

How does it work?

Empty Entities (without Properties) does not manifest in Space and Time automatically they just exist (are accesible). Basic Properties are for example Unordered/Ordered_callback (provides Time) or Physics (provides Space). Other Properties can bind to them just as to any arbitrary Property by Value and Event binding.

How one develop with Cosmos2D?

There are two basic levels of development 1) using Properties or coding new 2) parametrizing them by creating Assets. This workflow supports clean readable code and forces you to focus on creating (refactoring) reusable Properties (modules) which are time/value/event bound which can be add/removed or you can merge/split to another Entities which recreates bindings much like in reality. Entity can be anything from hero, weapon, menu, stats to more abstract like AI or group selection.

Features

1) Entities can be found by string in constant time (faster than using Object hashing) in Teserakt (my prototype of high-dimensonal hash table)
Teserakt will support wildcards in future for group access in constant time (like 'e*' for ea eb ec ed ef, with support for such naming convention).

2) Properties are parametrized by Assets using JSON notation with extra parsing supporting easy and readable syntax for Event and Value binding.

3) Entities can easily add or remove Properties while recreating all bindings supporting great modularity if written respecting this.

4) Entities will support merging to one Entity or splitting to more Entities (maybe by Assets).

5) Properties available: Unordered/Ordered_callback provides (ordered) access to time (game cycle provided by core).

6) Properties available: Physics provides space (bounding boxes with collision detection, quadtree division for spatial interaction).

7) Properties available: Model, Audio, Animator, Controls for easy resource usage (with memory management provided by core).

Example Marine Asset:

Will be added soon, its ready already working, just minor changes
