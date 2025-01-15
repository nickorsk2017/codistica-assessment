# Athor

**Nikolai Stepanov**

email: nickstepargentina@gmail.com

[https://www.linkedin.com/in/nickot/](https://www.linkedin.com/in/nickot/)

# Task

Problem: Dynamic Scheduling System
You are tasked with building a lightweight scheduling system using TypeScript
and Node.js. The system should allow users to register tasks that run at specific
intervals, but with a twist: the tasks may have dependencies on other tasks. A
task should only run once all its dependencies have been successfully completed.

# Architecture design

I prefer the Nest.js in my projects, but for demonstrating my architecture design skills, I designed a mini framework for this task.
My framework has modules, services, assets. I used design techniques, my modules are loosely coupled.

The project has the following structure:

**src** - root folder <br />
**src/assets** - contains resources, DB collections, mocks <br />
**src/modules** - modules of application. You can connect modules with your logic dynamically in Main module using **providers** property.<br />

```bash
export class MainModule extends Module {
    providers = [TasksModule];
}
```

**src/types** - types in format \*.d.ts. You can use types without import / export.

Module with business logic has 3 files:

- **name_module.module.ts** - contains initial settings, and runs a methods from Services. Describe your code in **run** method.
- **name_module.service.ts** - contains business logic
- **name_module.test.ts** - unit tests for module. I used Jest

I used JSON file for imitation DB (folder assets).

Common logic described in src/modules/tasks.
Used tasks with delay.

# Coding algorithm

## Tree algorithms

The task list is essentially a trees. For trees we have BFS and DFS approaches. But we can use a plane tree.
The plane tree is aproache if we store vertex separately from others - we should know only dependencies.
The plane tree is ideal for store data in DB, especially in SQL - because a task might has relations to other entities,for example payments and we can keep data integrity.

## Iteration algorithms

We have 2 algorythm to iterate tree-like structure:

1. **Recursion**
2. **Stack or Queue with iterative algorithm**

I chose Stack for this task for following reasons:
Recursion may overflow the memory. If we iterate all tasks the recursion can easy freeze all application if we have 10000 tasks and tasks have heavy execution.

**Also, if we use stack we can improve technique in future.**
For example we can iterate the plane tree using multiple stacks (chunks). Each stack iterate itself comparing element with common result store (e.g. Hash table). In this store we have all data about executed tasks.
We can put all stacks in isolated memory like JS Worker or execute it in different servers.
If we use Recursion we can't use this approaches.

# Installation and execution

1. Go to the root of project.

2. For installation dependencies use following command:

```bash
npm install
```

3. For running application use:

```bash
npm start
```

4. For checking unit tests use:

```bash
npm run test
```

5. For checking styles of code use:

```bash
npm run lint
```

You also can use Yarn.

# The final chapter

I appreciate the time you took to study my assignment.

If you have any questions or problems, please write to me on LinkedIn:

[https://www.linkedin.com/in/nickot/](https://www.linkedin.com/in/nickot/)

Thank you very much.
