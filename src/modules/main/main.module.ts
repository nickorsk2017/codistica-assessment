import {TasksModule} from '@modules/tasks/tasks.module';
import {Module} from '@modules/module';

export class MainModule extends Module {
	providers = [TasksModule]
}