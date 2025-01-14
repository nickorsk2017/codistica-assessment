import {DBService as ServiceJSON} from './providers/JSON/db.service'


export class DBModule {
    db: ServiceJSON;
 
	constructor(provider: Entity.Provider){
        this.db = this.createConnection(provider);
    }

    createConnection(provider: Entity.Provider): ServiceJSON{
        switch(provider){
            case "JSON":
            return new ServiceJSON();
            default:
            return null;
        }
    }
}