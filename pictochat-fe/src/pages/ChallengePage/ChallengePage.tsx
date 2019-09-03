import * as React from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import ChallengeService from '../../services/ChallengeService';
import './ChallengePage.less';

interface ChallengePageProps {}

export default function ChallengePage(props: ChallengePageProps) {
  const [sales, setSales] = React.useState<string>();
  const [commission, setComission] = React.useState<number>();

  const handleSalesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSales(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await ChallengeService.submitSales(Number(sales));
    setComission(res.commission);
  };

  return (
    <section id="challenge-page">
      <h1>Commision Challenge</h1>
      <Segment rasied>
        <form onSubmit={handleSubmit}>
          <label>Sales ($):</label>
          <Input type="number" step="0.01" value={sales} onChange={handleSalesChange} />
          <Button type="submit" primary>
            Calculate
          </Button>
        </form>
      </Segment>

      {!!commission && <Segment rasied>Your commission is ${commission}</Segment>}
    </section>
  );
}
