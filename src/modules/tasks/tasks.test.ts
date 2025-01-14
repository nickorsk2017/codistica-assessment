import {describe, expect, test} from '@jest/globals';
import {TasksService} from './tasks.services';

describe('CHECK TASKS MODULE', () => {
  const service = new TasksService(true);

  test('Check DB connection', async () => {
    await service.init();
    await service.rallbackToMock();

    expect(service.dbConnection?.db).toBeDefined();
  });

  test('Add new task', async () => {
    const tasksLengthBefore = Object.keys(service.tasks).length;

    await service.addTask({
      id: 'newTask',
      execute: 'async () => {console.log("Execute new task")}',
      dependencies: []
    });

    const tasksLengthAfter = Object.keys(service.tasks).length;

    expect(tasksLengthAfter).toBeGreaterThan(tasksLengthBefore);
  });

  test('Run all tasks without errors', async () => {
    await service.runAllTasks();

    expect(service.completedTasks.length).toBeGreaterThan(0);
    expect(service.inProgressTasks.length).toEqual(0);
    expect(service.wrongExecTasks.length).toEqual(0);
  });


  test('Run tasks with error syntax', async () => {
    // add task with syntax error in execution
    await service.addTask({
      id: 'errorTask',
      execute: 'async () => {console.log("Execute errorTask.....',
      dependencies: []
    });

    await service.runAllTasks();
    expect(service.wrongExecTasks.length).toBeGreaterThan(0);
  });

  test('Run tasks with circular dependencies', async () => {
    // add task with syntax error in execution
    await service.addTask({
      id: 'task_circular_1',
      execute: 'async () => {console.log("Execute task3")}',
      dependencies: ['task_circular_2']
    });

    await service.addTask({
      id: 'task_circular_2',
      execute: 'async () => {console.log("Execute task2")}',
      dependencies: ['task_circular3']
    });

    await service.addTask({
      id: 'task_circular3',
      execute: 'async () => {console.log("Execute task3")}',
      dependencies: ['task_circular_2']
    });

    await service.runAllTasks();

    expect(service.circularTasks.length).toBeGreaterThan(0);
  });

  test('Rollback DB', async () => {
    await service.rallbackToMock();
  });

});