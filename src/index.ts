import 'module-alias/register';
import {MainModule} from '@modules/main/main.module';
import {LogsModule} from '@modules/logs/logs.module';


(() => {
  function init() {   
    console.clear();
    const logs = new LogsModule();
    logs.sayHello();
    logs.log('STAGE: Initializing the application', 'magenta');

    const app = new MainModule();  
    app.run();
  }

  init();
})();