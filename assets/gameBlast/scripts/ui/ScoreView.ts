import { SCORE_LABEL_SEPARATOR } from "../core/constants/ScoreViewConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreView extends cc.Component {
    @property(cc.Label)
    private scoreLabel: cc.Label = null;

    public render(currentScore: number, targetScore: number): void {
        if (!this.scoreLabel)
            this.scoreLabel = this.getComponent(cc.Label);

        if (!this.scoreLabel)
            return;

        this.scoreLabel.string = currentScore + SCORE_LABEL_SEPARATOR + targetScore;
    }
}