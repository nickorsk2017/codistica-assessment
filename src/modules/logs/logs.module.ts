const colors = {
	reset: "\x1b[0m",
	black:"\x1b[30m",
	red:"\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m",
};

type TypeColors = typeof colors;

export class LogsModule  {
	colors = colors;
	disable = false;

	constructor(disable?: boolean){
		this.disable = !!disable;
	}

	log(text: string, color: keyof TypeColors = "black" ): string | null {
		if(!this.disable){
			const colorCode = this.colors[color] || this.colors.black;
			const reset = this.colors.reset;
			const log = `${text} ${reset}`;
			console.log(colorCode, log);

			return log
		}

		return null
	}

	sayHello(){
		this.log("\n\n _____________________________________________\n", 'white');
		this.log("AUTHOR: NIKOLAI STEPANOV", 'white');
        this.log("linkedIn: https://www.linkedin.com/in/nickot/", "blue");
		this.log("\n\n This application simulates backend service with DB", 'white');
		this.log("\n\n See the readme file for details", 'white');
		this.log("_______________________________________________\n\n", 'white');
	}
}