import * as React from 'react';
import { Loader, Segment, Input, Button } from 'semantic-ui-react';
import './ChallengePage.less';

interface ChallengePageProps {}

export default function ChallengePage(props: ChallengePageProps) {
  const [sales, setSales] = React.useState<string>();
  const [commission, setComission] = React.useState<number>();

  const rate = 0.2;

  const handleSalesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSales(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setComission(Number(sales) * rate);
  };

  return (
    <section id="challenge-page">
      <h1>Commision Challenge</h1>
      <Segment rasied>
        <form onSubmit={handleSubmit}>
          <label>Sales ($):</label>
          <Input type="number" value={sales} onChange={handleSalesChange} />
          <Button type="submit" primary>
            Calculate
          </Button>
        </form>
      </Segment>

      {!!commission && <Segment rasied>Your commission is ${commission}</Segment>}
    </section>
  );
}
