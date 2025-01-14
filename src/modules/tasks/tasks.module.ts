import {TasksService} from './tasks.services';

export class TasksModule {
  service: TasksService;
    
  constructor() {
    this.service = new TasksService();
  }

  run() {
    const init = async () => {
      await this.service.init();

      await this.service.addTask({
        id: 'task1',
        // JSON file support only functions in string format
        execute: 'async () => {console.log("Execute task1")}',
        dependencies: ['task2', 'task3']
      });

      await this.service.addTask({
        id: 'task2',
        execute: 'async () => {console.log("Execute task2")}',
        dependencies: []
      });

      await this.service.addTask({
        id: 'task3',
        execute: 'async () => {console.log("Execute task3")}',
        dependencies: []
      });

      await this.service.runAllTasks();
    };
    
    init();
  }
}