import { IActionCallsProvider } from "./iaction-calls-provider";

export interface ITUI {
    Run(): Promise<void>;
    Exit(): Promise<void>;
    RunActionCalls(actionCallsProvider: IActionCallsProvider): Promise<void>
}