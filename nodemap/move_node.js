class MoveNode extends ICommand{
    constructor(){
        super("move_node");
    }

	execute(command_param){
		console.log("move node succeed.");
	}    
}

var registered = cmd_service.register_command(new MoveNode());
