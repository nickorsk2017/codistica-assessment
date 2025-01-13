import {DbEntity} from './db.entity';

export class DBService {
    constructor(){}

    getEntity(name: string){
        return new DbEntity(name);
    }
}
