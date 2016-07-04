class ICommand {

    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    execute(command_param) {
        console.log("execute command" + "---" + this._name);
    }
}