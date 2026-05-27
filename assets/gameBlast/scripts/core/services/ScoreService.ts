import { SCORE_MULTIPLIER } from "../constants/GameControllerConstants";

export class ScoreService {
    public calculateScore(groupSize: number): number {
        return groupSize * groupSize * SCORE_MULTIPLIER;
    }
}