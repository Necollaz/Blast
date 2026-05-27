import { SCORE_MULTIPLIER } from "../constants/ScoreViewConstants";

export class ScoreService {
    public calculateScore(groupSize: number): number {
        return groupSize * groupSize * SCORE_MULTIPLIER;
    }
}