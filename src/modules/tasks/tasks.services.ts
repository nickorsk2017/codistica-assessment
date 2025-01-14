import {DBModule} from '@modules/db/db.module';
import {LogsModule} from '@modules/logs/logs.module';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

function awaitFromString(handler) {
  return new Promise((resolve, reject) => {
    new AsyncFunction(
      "resolve",
      "reject",
      `try { await ${handler}; resolve(); } catch (e) { reject(e); }`,
    )(resolve, reject)
  })
}

export class TasksService {
    logs: LogsModule;
    constructor(){
        this.logs = new LogsModule();
    }

    stack: Entity.Task[] = [];
    completedTasks: Array<string> = [];
    wrongExecTasks: Array<string> = [];

    fillStack = async (tasks: Entity.Tasks) => {
        for(let key in tasks){
            const task = tasks[key];

            if(!task.dependencies.length){
                await this.execTask(task);
                this.completedTasks.push(task.id);
            } else {
                this.stack.push(task);
            }
        }  
    }


    execTask = async (task: Entity.Task) => {
        this.logs.log(`\nRUN TASK (${task.id}):`, 'green');

        try{
            const isAsyncFn = task.execute.indexOf('await ') > 1;

            const result = isAsyncFn ? await eval(`async () => {${task.execute}}`)(): await eval(task.execute);

            if(result){
                console.log(result, 'result')
            }

            return true;
        } catch(err){
            this.logs.log(`\nTASK EXECUTION ERROR (${task.id}):`, 'red');
            this.logs.log(err);
        }

        return false;
    }

    loopTasks = async (tasks: Entity.Tasks) => {
        let interations = 0;

        await this.fillStack(tasks);
        
        while(this.stack.length && interations < 100){
            let nextTaskIndex;

            const nextTask = this.stack.find((task, index) => {
                const dependencies = task.dependencies;

                const allChildTaskDone = dependencies.every(i => this.completedTasks.includes(i));
                nextTaskIndex = index;
                
                return allChildTaskDone;
            });

            if(nextTask){
                const result = await this.execTask(nextTask);
                this.stack.splice(nextTaskIndex, 1);

                if(result){
                    this.completedTasks.push(nextTask.id);
                } else {
                    this.wrongExecTasks.push(nextTask.id);
                }
            } else {
                break;
            }
          
          interations++;
        }
    }

    logResults = () => {
        const wrongTasks = this.stack.map((task) => {
            return task.id
        });

        if(wrongTasks.length){
            this.logs.log("WARNING: These tasks have circular or incorrect dependencies:", 'red');
            this.logs.log(JSON.stringify(wrongTasks), 'red');
        }

        if(this.wrongExecTasks.length){
            this.logs.log("\nWARNING: These tasks have issues while exectute:", 'red');
            this.logs.log(JSON.stringify(this.wrongExecTasks), 'red');
        }

        this.logs.log("\nCOMPLETED TASKS:", 'green');
        this.logs.log(JSON.stringify(this.completedTasks), 'green');
    }

    // todo: try convert to asynchronous tasks
    async runAllTasks(){
        this.logs.log("STAGE: Run all tasks \n\n", 'cyan');

        const connection = new DBModule('JSON');
        const tasksORM =  connection.db.getEntity('tasks');

        const tasks = await tasksORM.get();

        await this.loopTasks(tasks);
        this.logResults();
    }
}
