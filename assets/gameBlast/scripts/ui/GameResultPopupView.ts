import { SCORE_LABEL_SEPARATOR } from "../core/constants/ScoreViewConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameResultPopupView extends cc.Component {
    @property(cc.Node) private background: cc.Node = null;
    @property(cc.Node) private titleLabelBackgroundImage: cc.Node = null;
    @property(cc.Node) private winTitleLabel: cc.Node = null;
    @property(cc.Node) private loseTitleLabel: cc.Node = null;
    @property(cc.Node) private scoreLabelBackgroundImage: cc.Node = null;
    @property(cc.Label) private scoreLabel: cc.Label = null;

    protected onLoad(): void {
        this.hide();
    }

    public showWin(score: number, targetScore: number): void {
        this.show(score, targetScore, true);
    }

    public showLose(score: number, targetScore: number): void {
        this.show(score, targetScore, false);
    }

    public hide(): void {
        this.node.active = false;
    }

    private show(score: number, targetScore: number, isWin: boolean): void {
        this.node.active = true;
        this.node.scale = 0;

        this.setNodeActive(this.background, true);
        this.setNodeActive(this.titleLabelBackgroundImage, true);
        this.setNodeActive(this.winTitleLabel, isWin);
        this.setNodeActive(this.loseTitleLabel, !isWin);
        this.setNodeActive(this.scoreLabelBackgroundImage, true);

        if (this.scoreLabel)
            this.scoreLabel.string = score + SCORE_LABEL_SEPARATOR + targetScore;

        cc.tween(this.node)
            .to(0.2, { scale: 1 })
            .start();
    }

    private setNodeActive(node: cc.Node, isActive: boolean): void {
        if (node)
            node.active = isActive;
    }
}