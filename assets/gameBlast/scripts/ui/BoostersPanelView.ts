import {
    BOOSTER_DEFAULT_OPACITY,
    BOOSTER_SELECTED_OPACITY
} from "../core/constants/UiConstants";

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
            this.teleportButton.node.opacity = isTeleportSelected ? BOOSTER_SELECTED_OPACITY : BOOSTER_DEFAULT_OPACITY;

        if (this.bombButton)
            this.bombButton.node.opacity = isBombSelected ? BOOSTER_SELECTED_OPACITY : BOOSTER_DEFAULT_OPACITY;
    }
}