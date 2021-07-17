import { ITUI } from './itui';
import { ITerminal } from './iterminal'
import { IAction } from './iaction';
import { Action } from './action';
import { ActionCall } from './action-call';
import { IActionCall } from './iaction-call';
import { IActionCallsProvider } from './iaction-calls-provider';

const exit = "exit"
const ask = '$ '

export class TUIError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "TUIError"
    }
}

export class TUICommandNotFoundError extends TUIError {
    constructor(command: string) {
        super(`Command "${command}" not found`);
        this.name = "TUICommandNotFoundError"
    }
}

export type Actions = Array<Action>;
export type PartialActions = Array<Partial<Action>>

export class TUI implements ITUI {
    private _stopRequested = false;
    private _actions: Actions;
    private _terminal: ITerminal;
    private _userExitAction?: IAction;

    constructor(terminal: ITerminal, partialActions: PartialActions) {
        this._terminal = terminal
        this._actions = partialActions.map(partialAction => new Action(partialAction))
        const _userExitAction = partialActions.find((action) => {
            if (action.command == exit) return action
        })
        this._actions.push(new Action({
            command: exit,
            description: `Calls user defined "exit" if defined and exits. User defined "exit" should not accept any args.`,
            callback: this.Exit.bind(this)
        }))
    }

    public async Exit(): Promise<void> {
        this._stopRequested = true;
        if (this._userExitAction) await this._userExitAction.callback()
        await this._terminal.close()
    }

    private async RunActionCall(action: IAction, actionCall: IActionCall) {
        return await action.callback(...actionCall.args)
    }

    private async RunActionCallPrintResult(action: IAction, actionCall: IActionCall) {
        const res = await this.RunActionCall(action, actionCall)
        if (res) {
            await this._terminal.write(JSON.stringify(res, null, 2))
            await this._terminal.write("\r\n")
        }
    }

    private async ActionFromActionCall(actionCall: IActionCall): Promise<IAction> {
        const action = this._actions.find((action: IAction) => {
            if (action.command == actionCall.command)
                return action;
        })
        if (!action) throw new TUICommandNotFoundError(actionCall.command)
        return action;
    }

    private async RunIteration(actionCall: IActionCall): Promise<void> {
        try {
            const action = await this.ActionFromActionCall(actionCall)
            await this.RunActionCallPrintResult(action, actionCall)
        } catch (error) {
            if (error instanceof TUICommandNotFoundError) {
                await this._terminal.write(error.message)
                await this._terminal.write("\r\n")
                await this.Help()
            }
            else if (error instanceof TUIError) {
                await this._terminal.write(error.message)
                await this._terminal.write("\r\n")
            }
            else throw error;
        }
    }

    private async Help(): Promise<void> {
        for (const { command, description } of this._actions) {
            await this._terminal.write(`  "${command}"\r\n`)
            await this._terminal.write(`     Description: ${description}\r\n`)
        }
    }

    public async Run(): Promise<void> {
        while (!this._stopRequested) {
            const input = await this._terminal.question(ask)
            if (input.length == 0) continue;
            const actionCall = new ActionCall(input)
            await this.RunIteration(actionCall)
        }
    }

    public async RunActionCalls(actionCallsProvider: IActionCallsProvider): Promise<void> {
        for (const actionCall of actionCallsProvider.actioncalls) {
            await this.RunIteration(actionCall)
        }
    }

}