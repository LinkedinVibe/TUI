import { ActionCall } from "./action-call";
import { IActionCall } from "./iaction-call";
import { IActionCallsProvider } from "./iaction-calls-provider";

export class ArgsActionCallsProvider implements IActionCallsProvider {
    private _actionCalls = new Array<IActionCall>();
    constructor(args: string[]) {
        for (let i = 0; i < args.length;) {
            const cmd = args[i];
            let actionCallCommand = '';
            if (cmd[cmd.length - 1] == '.') {
                actionCallCommand = cmd.substring(0, cmd.length - 1)
                i++;
            } else {
                let actionCallArgs = args[i + 1]
                actionCallArgs = actionCallArgs ?? "";
                actionCallCommand = `${cmd} ${actionCallArgs}`;
                i += 2;
            }
            this._actionCalls.push(new ActionCall(actionCallCommand))
        }
    }
    get actioncalls(): IActionCall[] {
        return this._actionCalls
    }

    public static FromProcessArgs(argv: string[]) : ArgsActionCallsProvider {
        return new ArgsActionCallsProvider(argv.slice(2))
    }
}