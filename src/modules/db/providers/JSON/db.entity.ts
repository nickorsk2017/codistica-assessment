import fs from 'fs';
import path from 'path'; 

export class DbEntity {
    entityName: string;
    filePath: string;

    constructor(entityName: string = "tasks"){
        this.entityName = entityName;
        this.filePath = path.resolve(__dirname, `../../../../assets/${this.entityName}.json`);
    }

    async write<T extends { id?: string }>(intity: T){
        return new Promise((resolve, reject) => {
            try{ 
                const dataPomise = this.get();

                dataPomise.then((data: Object) => {
                    //todo: use deepClone for complex object data
                    const dataObj = {...data};
                    dataObj[intity.id] = intity;
    
                    fs.writeFile(this.filePath, JSON.stringify(dataObj), 'utf8', (err) => {
                        if (err) {
                            console.log(err, 'err')
                            reject(err)
                            return;
                        }
          
                        resolve(data)
                    });
                });
            } catch(err){
                reject(err)
            }          
        });
    }
    
    async get<T>():Promise<T> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf8', (err, dataString) => {
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
