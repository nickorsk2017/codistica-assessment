import {DBService as ServiceJSON} from './providers/JSON/db.service';

// decorator module
export function dbConnection(provider: Entity.Provider) {
  return (target, propertyKey: string) => {

    // Creating connection to DB
    const db = new DBModule(provider);

    const getter: () => DBModule = function () { 
      return db; 
    }; 

    if (typeof target === 'object') {
      Object.defineProperty(target, propertyKey, { 
        get: getter
      }); 
    }

    
  };
}

export class DBModule {
  db: ServiceJSON;
 
  constructor(provider: Entity.Provider) {
    this.db = this.createConnection(provider);
  }

  createConnection(provider: Entity.Provider): ServiceJSON {
    switch (provider) {
      case 'JSON':
        return new ServiceJSON();
      default:
        return null;
    }
  }
}
