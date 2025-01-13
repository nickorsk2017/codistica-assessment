import 'module-alias/register';
import {MainModule} from "@modules/main/main.module";

console.clear();
console.log("\x1b[37m","AUTHOR: NIKOLAI STEPANOV");
console.log("\x1b[36m","https://www.linkedin.com/in/nickot/ \n\n");

(() => {
    function init(){    
        console.log("\x1b[35m","STAGE: Initializing the application \x1b[0m");
        const app = new MainModule();  
        app.run();
    }

    init();
})()