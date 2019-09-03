import { ChallengeRate } from '../models/challenge-rate';

export class ChallengeService {
  static async getChallengeRate(): Promise<number> {
    const challengeRate = await ChallengeRate.findOne();
    return challengeRate.rate;
  }
}
