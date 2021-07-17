export interface ITerminal {
    question(query: string): Promise<string>;
    write(data: string): Promise<void>;
    close(): Promise<void>;
}