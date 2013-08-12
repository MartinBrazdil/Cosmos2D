Cosmos2D
========

What is Cosmos2D?
Cosmos2D is my JavaScript game engine prototype. Its objective is modularity, reusability and readability. I am trying to achieve the goal with separation of abstraction from parametrization.

Basic idea?
Core interface consists of Space and Time. There live Entities. Each Entity has Properties. Those Properties are parametrized by Assets. Parametrization supports Value and Event binding.

How does it work?
Empty Entities (without Properties) does not manifest in Space and Time automatically they just exist (are accesible in Cosmos2D). Basic Properties are for example Unordered/Ordered_callback (provides Time) or Physics (provides Space). Other Properties can bind to them just as to any arbitrary Property by Value and Event binding.

Features
Entities can be found by string in constant time (faster than using Object hashing) in Teserakt (my prototype of high-dimensonal hash table)
Teserakt will support wildcards in future for group access in constant time (like 'e*' for ea eb ec ed ef) with support for such naming convention
Properties are parametrized by Assets using JSON notation with extra parsing supporting easy and readable syntax for Event and Value binding.
Entities can easily add or remove Properties while recreating all bindings supporting great modularity if written respecting this
Entities will support merging to one Entity or splitting to more Entities (maybe by Assets)
Properties available: Unordered/Ordered_callback provides (ordered) access to time (game cycle provided by core)
Properties available: Physics provides space (bounding boxes with collision detection, quadtree division for spatial interaction)
Properties available: Model, Audio, Animator, Controls for easy resource usage (with memory management provided by core)

Example Marine Asset:

Will be added soon, its ready already working, just minor changes
