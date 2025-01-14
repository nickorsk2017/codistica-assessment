import {describe, expect, test} from '@jest/globals';
import {DBModule} from './db.module';

describe('CHECK DB MODULE', () => {
    const dbConnection = new DBModule('JSON');

    test('Check connection to tasks collection', async () => {
        const tasksORM = dbConnection.db.getEntity('tasks');
        const tasks = await tasksORM.get<Entity.Tasks>();
        const length = Object.keys(tasks).length;

        expect(length).toBeGreaterThan(0);
    });

})