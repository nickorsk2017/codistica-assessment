export class Module {

    constructor(){}

    run = () => {
		this.providers.forEach(provider => {
			provider.run()
		});
	}

    providers: Array<any>;
}