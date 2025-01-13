import {DBService as ServiceJSON} from './providers/JSON/db.service'


export class DBModule {
    db;
 
	constructor(provider){
        this.db = this.createConnection(provider);
    }

    createConnection(provider){
        switch(provider){
            case "JSON":
            return new ServiceJSON();
            default:
            return null;
        }
    }
}