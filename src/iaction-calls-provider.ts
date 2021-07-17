import { IActionCall } from "./iaction-call";

export interface IActionCallsProvider {
    get actioncalls() : Array<IActionCall>;
} 