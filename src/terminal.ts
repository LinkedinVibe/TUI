import { ITerminal } from "./iterminal";
import { createInterface, Interface } from "readline";

export class Terminal implements ITerminal {
    private _terminal: Interface;
    constructor() {
        this._terminal = createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }
    async question(query: string): Promise<string> {
        return new Promise(resolve => this._terminal.question(query, data => resolve(data)))
    }
    async write(data: string): Promise<void> {
        await this._terminal.write(data)
    }
    async close(): Promise<void> {
        await this._terminal.close()
    }

}