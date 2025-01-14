export class Module {

  constructor() {}

  run = () => {
    this.providers.forEach(provider => {
      const providerEntity = new provider();
      providerEntity.run();
    });
  };

  providers: Array<typeof Entity.Module>;
}