import {TasksService} from './tasks.services'

export class TasksModule {
    service: TasksService;
    
    constructor(){
        this.service = new TasksService();
    }

    run(){
        const init = async () => {
            this.service.runAllTasks();
        }
    
        init();
    }
}