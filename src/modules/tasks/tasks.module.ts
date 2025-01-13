import {DBModule} from '@modules/db/db.module'

export class TasksModule {

    static run(){
        const init = async () => {
            const connection = new DBModule('JSON');
            const tasksORM =  connection.db.getEntity('tasks');
    
            const tasks = await tasksORM.get();

            console.log(tasks)
        }
    
        init();
    }
}