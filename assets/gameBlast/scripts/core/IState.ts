export interface IState {
    enter?(): void;
    exit?(): void;
    update?(dt: number): void;
}