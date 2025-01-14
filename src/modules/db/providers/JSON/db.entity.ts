import fs from 'fs';
import path from 'path'; 

const pathAssets = "../../../../assets";

export class DbEntity {
    entityName: string;
    filePath: string;

    rallbackToMock = async () => {
        return new Promise((resolve, reject) => {
            const fileMockPath = path.resolve(__dirname, `${pathAssets}/${this.entityName}.mock.json`);

            fs.copyFile(fileMockPath, this.filePath, (err) => {
                if (err) {
                    console.error(err, 'err')

                    reject(err)
                    return;
                }

                resolve(true);
            });
        })
    }

    constructor(entityName: string = "tasks"){
        this.entityName = entityName;
        this.filePath = path.resolve(__dirname, `${pathAssets}/${this.entityName}.json`);
    }

    async write<T extends Entity.Task>(intity: T): Promise<Entity.Tasks> {
        return new Promise((resolve, reject) => {
            try{ 
                const dataPomise = this.get();

                dataPomise.then((data: Entity.Tasks) => {
                    //todo: use deepClone for complex object data
                    const dataObj: Entity.Tasks = {...data};
                    dataObj[intity.id] = intity;
    
                    fs.writeFile(this.filePath, JSON.stringify(dataObj), 'utf8', (err) => {
                        if (err) {
                            console.error(err, 'err')
                            reject(err)
                            return;
                        }
          
                        resolve(dataObj)
                    });
                });
            } catch(err){
                reject(err)
            }          
        });
    }
    
    async get<T>(path?: string):Promise<T> {
        return new Promise((resolve, reject) => {
            fs.readFile(path || this.filePath, 'utf8', (err, dataString) => {
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
