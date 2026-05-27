const { ccclass, property } = cc._decorator;

@ccclass
export default class MovesView extends cc.Component {
    @property(cc.Label)
    private movesLabel: cc.Label = null;

    public render(movesLeft: number): void {
        if (!this.movesLabel)
            this.movesLabel = this.getComponent(cc.Label);

        if (!this.movesLabel)
            return;

        this.movesLabel.string = movesLeft.toString();
    }
}