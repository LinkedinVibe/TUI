import { IAction } from "./iaction";

export class ActionFromPartialError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "ActionFromPartialError"
    }
}

export class InvalidParameterError extends ActionFromPartialError {
    constructor(
        public parameterName: string,
        public parameterValue: any
    ) {
        super(`Invalid "${parameterName}" parameter, value : "${parameterValue}"`)
        this.name = "InvalidParameterError"
    }
}

export class Action implements IAction {
    public command: string;
    public description: string;
    public callback: Function;
    public constructor(action: Partial<Action>) {
        if (!action?.command) throw new InvalidParameterError("command", action?.command)
        this.command = action.command
        if (!action?.callback) throw new InvalidParameterError("callback", action?.callback)
        this.callback = action.callback;
        this.description = action?.description ?? "No description."
    }
}
