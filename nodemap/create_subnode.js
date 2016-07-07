class CreateSubNode extends ICommand{
    constructor(){
        super("create_subnode");
    }

	execute(command_param){
		console.log("create subnode succeed.");
		data_model.create_node(command_param.parent_node_id);
	}    
}

var registered = cmd_service.register_command(new CreateSubNode());
