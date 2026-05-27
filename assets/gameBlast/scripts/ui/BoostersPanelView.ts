const { ccclass, property } = cc._decorator;

@ccclass
export default class BoostersPanelView extends cc.Component {
    @property(cc.Label) private teleportCountLabel: cc.Label = null;
    @property(cc.Label) private bombCountLabel: cc.Label = null;
    @property(cc.Button) private teleportButton: cc.Button = null;
    @property(cc.Button) private bombButton: cc.Button = null;

    public render(
        teleportCount: number,
        bombCount: number,
        isTeleportSelected: boolean,
        isBombSelected: boolean
    ): void {
        if (this.teleportCountLabel)
            this.teleportCountLabel.string = teleportCount.toString();

        if (this.bombCountLabel)
            this.bombCountLabel.string = bombCount.toString();

        if (this.teleportButton)
            this.teleportButton.interactable = teleportCount > 0;

        if (this.bombButton)
            this.bombButton.interactable = bombCount > 0;

        if (this.teleportButton)
            this.teleportButton.node.opacity = isTeleportSelected ? 180 : 255;

        if (this.bombButton)
            this.bombButton.node.opacity = isBombSelected ? 180 : 255;
    }
}