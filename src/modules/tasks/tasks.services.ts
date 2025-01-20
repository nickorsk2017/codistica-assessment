import {logs, LogsModule} from '@modules/logs/logs.module';
import {TasksModel} from './tasks.model';

export class TasksService {
   @logs() logs: LogsModule;

   constructor() {}

   tasksModel: TasksModel = null;

   tasks: Entity.Tasks = {};
   private stack: Entity.Task[] = [];
   completedTasks: Array<string> = [];
   inProgressTasks: Array<string> = [];
   wrongExecTasks: Array<string> = [];
   circularTasks: Array<string> = [];
   private promises: Array<Promise<boolean | object>> = [];

   // Pushing tasks to stack or execution its if doesn't have dependencies
   private fillStack = () => {
     const tasks = this.tasks;

     for (const key in tasks) {
       const task = tasks[key];

       if (!task.dependencies.length) {
         this.execTask(task);
       } else {
         this.stack.push(task);
       }
     }  
   };

   // deleting task from progress list
   private deleteTaskFromProgress = (taskId: string) => {
     this.inProgressTasks = this.inProgressTasks.filter((id) => {
       return id !== taskId;
     });
   };


   // completing task
   private completeTask = (task) => {
     this.completedTasks.push(task.id);
     this.deleteTaskFromProgress(task.id);
   };


   // Pushing task to list tasks with bugs
   private handlerWrongTask = (taskId: string) => {
     this.wrongExecTasks.push(taskId);
     // Deleting task from proggess list
     this.deleteTaskFromProgress(taskId);

     // Flagging child tasks as uncompleted
     this.stack = this.stack.filter((task) => {
       if (task.id === taskId) {
         return false;
       }

       const dependencies = task.dependencies;
       const hasDependence = !!dependencies.includes(taskId);

       if (hasDependence) {
         this.wrongExecTasks.push(task.id);
       }

       return !hasDependence;
     });
   };

   // Executing task
   private execTask = (task: Entity.Task) => {
     this.inProgressTasks.push(task.id);

     // Create promise
     const promise = new Promise<boolean | object>((resolve) => {
       try {
         this.logs.log(`RUN TASK (${task.id})`, 'green');
         const exec = eval(`${task.execute}`);
         // This magic checks if execution has callback.
         // This callback needs for operations with delay like Timeout
         const hasCallback = !!exec.length;
                  

         // If task does't have callback run immediately
         if (!hasCallback) {
           const execResult = exec();

           this.logs.log(`TASK (${task.id}) IS DONE\n`, 'blue');
           execResult.then((result) => {
             this.completeTask(task);
             resolve(result);
           });
         } else {
           // Otherwise logic will be run inside execution of task
           this.logs.log(`TASK (${task.id}) HAS DELAY AND WILL PROCESS ASYNCHONOUSLY\n`, 'yellow');

           const handler = (resultFromTask) => {
             this.completeTask(task); 

             this.logs.log(`TASK (${task.id}) IS DONE\n`, 'blue');
             resolve(resultFromTask);
           };

           exec(handler);
         }
    
       } catch (err) {
         // If execution of task has error log it in  list of wrong tasks
         this.logs.log(`\nTASK EXECUTION ERROR (${task.id}):`, 'red');
         this.logs.log(err);
    
         this.handlerWrongTask(task.id);

         resolve(false);
       }
     });

     // Push promise to list
     this.promises.push(promise);
   };

   // Execution asynchronous tasks and clear it
   private exePromises = async () => {
     if (this.promises.length) {
       await Promise.all(this.promises);
       this.promises = [];
     }
   };

   // Delete a task from stack
   private deleteTaskFromStack = (taskId: string) => {
     this.stack = this.stack.filter((task) => {
       return task.id !== taskId;
     });
   };

   // Log circular tasks
   private addToCircularTasks = (taskId: string) => {
     if (!this.circularTasks.includes(taskId)) {
       this.deleteTaskFromStack(taskId);
       this.circularTasks.push(taskId);
     }
   };

   // Handler tasks with circular dependencies
   private handlerCircularTasks = (task: Entity.Task) => {
     const dependencies = task.dependencies;
     let hasCircular = false;

     // check if task has circular dependency to itself
     if (dependencies.includes(task.id)) {
       hasCircular = true;
       this.addToCircularTasks(task.id);
     }

     // check if subtasks have other circular dependencies
     if (dependencies.find((taskId: string) => {
       return this.circularTasks.includes(taskId);
     })) {
       hasCircular = true;
       this.addToCircularTasks(task.id);
     }

     // check if subtasks have circular dependency to parent task 
     for (const childTask of this.stack) {
       if (dependencies.includes(childTask.id)) {

         const dependenciesChild = childTask.dependencies;

         if (dependenciesChild.includes(task.id)) {
           hasCircular = true;

           this.addToCircularTasks(task.id);
           this.addToCircularTasks(childTask.id);
         }

       }
     }

     return hasCircular;
   };

   //**
   // The loop tasks works independently of tasks execution.
   // Look to taskB in JSON file, this task has delay and is added to completed list at the end but before parent task.
   //  */
   private loopTasks = async () => {
     // Pushing tasks without dependencies
     this.fillStack();
            
     /** The loop is waiting while tasks in stack or progress list
                and works until all tasks are completed and the stack is empty.
                If task has syntax error in 'execute' field it will be ignored.
            */
     while ((this.stack.length || this.inProgressTasks.length)) {
       //Get first task with completed dependencies from stack
       const nextTask = this.stack.find((task) => {
         // skip if the task in progress or completed 
         if (this.inProgressTasks.includes(task.id) || this.completedTasks.includes(task.id)) {
           this.deleteTaskFromStack(task.id);
           return false;
         }

         // skip if the task has circular dependencies.
         const hasCircular = this.handlerCircularTasks(task);
         if (hasCircular) {
           return false;
         }
                
         const dependencies = task.dependencies;

         // skip if the task has not completed dependencies.
         const allChildTaskDone = dependencies.every(i => this.completedTasks.includes(i));
                    
         return allChildTaskDone;
       });
    
       // If at least one task is on the stack
       // delete this task from stack and try execute it.
       if (nextTask) {
         this.deleteTaskFromStack(nextTask.id);
         this.execTask(nextTask);
       } else {
         // Otherwise try to execute asynchronous tasks
         await this.exePromises();
       }
     }
   };

   // Run all tasks
   runAllTasks = async () => {
     this.logs.log('STAGE: Run all tasks \n\n', 'magenta');
     this.tasks = await this.tasksModel.getList();

     // Processing tasks
     await this.loopTasks();
     this.logResults();
   };

   // Add new task to stack 
   addTask = async (task: Entity.Task) => {
     try {
       this.tasks = await this.tasksModel.add(task);
     } catch (err) {
       this.logs.log('ERROR ', 'red');
       this.logs.log(err);
     }
   };

   // return DB data to initial state
   rallbackToMock = async () => {
     await this.tasksModel.rallbackToMock();
   };

   init = async () => {
     // Init tasks model
     this.tasksModel = new TasksModel();
   };

   /*
    Log result after execution 
  */
   private logResults = () => {

     this.logs.log('\nSTAGE: TASKS PROCESSED', 'magenta');

     if (this.circularTasks.length) {
       this.logs.log('WARNING: These tasks have circular or incorrect dependencies:', 'red');
       this.logs.log(JSON.stringify(this.circularTasks), 'red');
     }

     if (this.wrongExecTasks.length) {
       this.logs.log('\nWARNING: These tasks have issues while exectute:', 'red');
       this.logs.log(JSON.stringify(this.wrongExecTasks), 'red');
     }

     this.logs.log('\nCOMPLETED TASKS:', 'cyan');
     this.logs.log(JSON.stringify(this.completedTasks), 'cyan');

     this.logs.sayHello();
   };
}
