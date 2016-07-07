class CommandService{

	constructor(){
		this._commands = {};
	}

	execute_command(command, command_param){
		console.log(command_param);
		if (this._commands.hasOwnProperty(command)){
			this._commands[command].execute(command_param);
		}
	}

	register_command(command){
		if (this._commands.hasOwnProperty(command.name)){
			return false;
		}
		this._commands[command.name] = command;
		return true;
	}
}

var cmd_service = new CommandService();
