export interface ITUI {
    Run(): Promise<void>;
    Exit(): Promise<void>;
}