import fs from 'fs';
import path from 'path'; 

export class DbEntity {
    entityName: string;

    constructor(entityName: string = "tasks"){
        this.entityName = entityName;
    }


    write(){

    }

    
    async get(){
        return new Promise((resolve, reject) => {

            const filePath = path.resolve(__dirname, `../../../../assets/${this.entityName}.json`);
    
            fs.readFile(filePath, 'utf8', (err, dataString) => {
                if (err) {
                  reject(err)
                  return;
                }
                const data = JSON.parse(dataString)

                resolve(data)
            });
        });
    }
}
