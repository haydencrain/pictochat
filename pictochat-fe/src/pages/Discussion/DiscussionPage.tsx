import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import DiscussionContainer from '../../components/DiscussionContainer';
import './DiscussionPage.less';

interface Props extends RouteComponentProps<any> {}

function DiscussionPage(props: Props) {
  const { id } = parse(props.location.search);
  return (
    <section id="discussion-page">
      <DiscussionContainer id={id.toString()} />
    </section>
  );
}

export default withRouter(DiscussionPage);
