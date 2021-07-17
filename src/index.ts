import { ITUI } from "./itui";
import { TUI, PartialActions,  TUICommandNotFoundError, TUIError } from "./tui";

import { IAction } from "./iaction";
import { Action, ActionFromPartialError, InvalidParameterError } from "./action";

import { ITerminal } from "./iterminal";
import { Terminal } from "./terminal";

import { IActionCallsProvider } from './iaction-calls-provider'
import { ArgsActionCallsProvider } from './args-action-calls-provider'

async function HandleArgs(partialActions: PartialActions): Promise<void> {
    const tui = new TUI(new Terminal(), partialActions);
    const argsActionCallsProvider = ArgsActionCallsProvider.FromProcessArgs(process.argv)
    await tui.RunActionCalls(argsActionCallsProvider)
    tui.Exit()
}

export {
    ITUI,
    TUI,
    TUICommandNotFoundError,
    TUIError,
    IAction,
    Action,
    ActionFromPartialError,
    InvalidParameterError,
    ITerminal,
    Terminal,
    IActionCallsProvider,
    ArgsActionCallsProvider,
    HandleArgs
}