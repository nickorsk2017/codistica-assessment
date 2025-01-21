import {describe, expect, test} from '@jest/globals';
import {TasksService} from './tasks.services';
import {TasksModel} from './tasks.model';
import {DBModule} from '../db/db.module';
import { LogsModule} from '@modules/logs/logs.module';

const initService = () => {
  const service = new TasksService();
  const tasksModel = new TasksModel();

  tasksModel.dbConnection = new DBModule('JSON');
  tasksModel.logs = new LogsModule(true);
  service.logs = new LogsModule(true);

  // disable logs in tasks module
  tasksModel.logs.disable(true);
  service.logs.disable(true);

  service.tasksModel = tasksModel;

  return service;
};

describe('CHECK TASKS MODULE', () => {
 
  test('Check DB connection', async () => {
    const service = initService();
    await service.rallbackToMock();

    expect(service.tasksModel.dbConnection?.db).toBeDefined();
  });

  test('Add new task', async () => {
    const service = initService();
    const tasksLengthBefore = Object.keys(service.tasks).length;

    await service.addTask({
      id: 'newTask',
      execute: 'async () => {console.log("Execute new task")}',
      dependencies: []
    });

    const tasksLengthAfter = Object.keys(service.tasks).length;

    expect(tasksLengthAfter).toBeGreaterThan(tasksLengthBefore);

    await service.rallbackToMock();
  });

  test('Run all tasks without errors', async () => {
    const service = initService();
    await service.runAllTasks();

    expect(service.completedTasks.length).toBeGreaterThan(0);
    expect(service.inProgressTasks.length).toEqual(0);
    expect(service.wrongExecTasks.length).toEqual(0);
  });


  test('Run tasks with error syntax', async () => {
    const service = initService();
    // add task with syntax error in execution
    await service.addTask({
      id: 'errorTask',
      execute: 'async () => {console.log("Execute errorTask.....',
      dependencies: []
    });

    await service.runAllTasks();
    expect(service.wrongExecTasks.length).toBeGreaterThan(0);

    await service.rallbackToMock();
  });

  test('Run tasks with circular dependencies A,B,C,D,A', async () => {
    const service = initService();

    await service.addTask({
      id: 'A',
      execute: 'async () => {console.log("Execute A")}',
      dependencies: ['B']
    });

    await service.addTask({
      id: 'B',
      execute: 'async () => {console.log("Execute B")}',
      dependencies: ['C']
    });

    await service.addTask({
      id: 'C',
      execute: 'async () => {console.log("Execute C")}',
      dependencies: ['D']
    });

    await service.addTask({
      id: 'D',
      execute: 'async () => {console.log("Execute D")}',
      dependencies: ['A']
    });

    await service.runAllTasks();

    expect(service.circularTasks.length).toBeGreaterThan(0);

    await service.rallbackToMock();
  });


  test('Run tasks with circular dependencies A,A', async () => {
    const service = initService();
    await service.addTask({
      id: 'A',
      execute: 'async () => {console.log("Execute A")}',
      dependencies: ['A']
    });

    await service.runAllTasks();

    expect(service.circularTasks.length).toBeGreaterThan(0);

    await service.rallbackToMock();
  });

  test('Run tasks with complex circular dependencies A,B,C,A / A,C,A', async () => {
    const service = initService();
    await service.addTask({
      id: 'A',
      execute: 'async () => {console.log("Execute A")}',
      dependencies: ['B', 'C']
    });

    await service.addTask({
      id: 'B',
      execute: 'async () => {console.log("Execute B")}',
      dependencies: ['C']
    });

    await service.addTask({
      id: 'C',
      execute: 'async () => {console.log("Execute C")}',
      dependencies: ['A']
    });

    await service.runAllTasks();

    expect(service.circularTasks.length).toBeGreaterThan(0);

    await service.rallbackToMock();
  });

  test('Rollback DB', async () => {
    const service = initService();
    await service.rallbackToMock();
  });

});