import {describe, expect, test} from '@jest/globals';
import {LogsModule} from './logs.module';

describe('CHECK LOGS MODULE', () => {
    const logs = new LogsModule();

    test('Logging test', async () => {
        const result = logs.log('Hello world')

        expect(result).not.toBeNull();
    });

})