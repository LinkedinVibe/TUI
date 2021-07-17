import { ITUI } from './itui';
import { ITerminal } from './iterminal'
import { IAction } from './iaction';
import { Action } from './action';
import { ActionCall } from './actioncall';

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

export class TUI implements ITUI {
    private _stopRequested = false;
    private _actions: Array<IAction>;
    private _terminal: ITerminal;
    private _userExitAction?: IAction;

    constructor(terminal: ITerminal, actions: Array<Partial<Action>>) {
        this._terminal = terminal
        this._actions = actions.map(partialAction => new Action(partialAction))
        const _userExitAction = actions.find((action) => {
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

    private async InternalRun(): Promise<void> {
        const input = await this._terminal.question(ask)
        if (input.length == 0) return;

        const actionCall = new ActionCall(input)
        const action = this._actions.find((action: IAction) => {
            if (action.command == actionCall.command)
                return action;
        })

        if (!action) throw new TUICommandNotFoundError(actionCall.command)

        const res = await action.callback(...actionCall.args)
        if (res) {
            await this._terminal.write(JSON.stringify(res, null, 2))
            await this._terminal.write("\r\n")
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
            try {
                await this.InternalRun()
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
    }
}