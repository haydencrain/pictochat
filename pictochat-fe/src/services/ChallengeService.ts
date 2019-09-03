import ApiService from './ApiService';
import ChallengeResponse from '../models/ChallengeResponse';

class ChallengeService {
  async getChallengeTest(): Promise<void> {
    return await ApiService.get(`/challenge/test`);
  }

  async submitSales(sales: number): Promise<ChallengeResponse> {
    const data = { sales };
    return await ApiService.post('/challenge', data);
  }
}

export default new ChallengeService();
