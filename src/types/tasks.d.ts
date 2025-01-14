export {};

declare global {
    namespace Entity {
      type Task = {
        id: string,
        execute: string,
        dependencies: Array<string>
      };

      type Tasks = Record<string, Task>
    }
  }
  