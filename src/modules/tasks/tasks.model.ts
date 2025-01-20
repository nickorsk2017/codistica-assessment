import {dbConnection, DBModule} from '@modules/db/db.module';
import {logs, LogsModule} from '@modules/logs/logs.module';

export class TasksModel {
  
  @logs() logs: LogsModule;
  @dbConnection('JSON') dbConnection: DBModule;

  constructor() {}

  // Get list of task 
  getList = async () => {
    try {
      const tasksORM = this.dbConnection.db.getEntity('tasks');
      const tasks = await tasksORM.get<Entity.Tasks>();
    
      return tasks;
    } catch (err) {
      this.logs.log('ERROR ', 'red');
      this.logs.log(err);
    }
  };
  
  // Add new task to stack
  // returns list with new task
  add = async (task: Entity.Task) => {
    try {
      const tasksORM = this.dbConnection.db.getEntity('tasks');
      const tasks = await tasksORM.write<Entity.Task>(task);

      return tasks;
    } catch (err) {
      this.logs.log('ERROR ', 'red');
      this.logs.log(err);
    }
  };
  
  // return DB data to initial state
  rallbackToMock = async () => {
    const tasksORM = this.dbConnection.db.getEntity('tasks');
    await tasksORM.rallbackToMock();
  };
  
}
  