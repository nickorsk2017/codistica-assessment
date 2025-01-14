import {DbEntity} from './db.entity';

export class DBService {
    constructor(){}

    getEntity(name: string): DbEntity{
        return new DbEntity(name);
    }
}
