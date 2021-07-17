import { IActionCall } from "./iaction-call";

export class ActionCallCreationError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "ActionCallCreationError"
    }
}

export class ActionCall implements IActionCall {
    public command: string;
    public args: Array<string>;
    constructor(input: string) {
        const words = input.split(" ").filter((element) => {
            if (element != "" || element != null) return element
        })
        if (!words.length) throw new ActionCallCreationError(`Seems like input string was empty, input string : "${input}"`)
        this.command = words[0]
        this.args = words.slice(1)
    }
}
