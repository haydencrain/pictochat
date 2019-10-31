import * as React from 'react';
import DiscussionPage, { REPLY_PLACEHOLDER_TEXT } from './DiscussionPage';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Route, MemoryRouter } from 'react-router-dom';
import {StoresContext, initStores} from '../../contexts/StoresContext';
import puppeteer, {Browser, Page} from 'puppeteer';

const nodeFetch = jest.requireActual('node-fetch');

// jest.mock('../../services/DiscussionService');
// import DiscussionService from '../../services/DiscussionService';

// jest.mock('../../services/ReactionService');
// import ReactionService from '../../services/ReactionService';

// jest.mock('../../stores/DiscussionStore');
// import DiscussionStore from '../../stores/DiscussionStore';


async function getMainReplyList(page) {
  const listContainerElm = await page.$eval('#main-replies-list-container');
  // const listContainerElm = document.getElementById('main-replies-list-container');
  const postListElm = listContainerElm.getElementsByClassName('post-list');
  return postListElm;
}

async function openPage(url: string): Promise<{browser: Browser, page: Page}> {
  let browser = await puppeteer.launch({headless: false});
  let page = await browser.newPage();
  await page.goto(url);
  return { browser, page };
}

// function mockReactionServiceWithEmptyArrays() {
//   ReactionService.getReactionsPost.mockReturnValue([]);
//   ReactionService.getDiscussionReactions.mockReturnValue([]);
// }

beforeEach(() => {
  // 10 minutes
  // jest.setTimeout(60000 * 10);
  jest.unmock('../../services/DiscussionService');
  // jest.spyOn(global, 'fetch').mockImplementation(() => nodeFetch);
  // jest.dontMock('../../services/DiscussionService');
  // jest.dontMock('../../services/ReactionService');
  // jest.resetModules();
  // mockReactionServiceWithEmptyArrays();
});

test('shows placeholder for posts with no replies', async () => {
  // console.log(fetch);
  // console.log(await ( ( await fetch('http://localhost:443/api/post/1') ).text() ) );
  // const { page, browser } = await openPage('http://localhost:443/discussion/15');



  const stores = initStores();
  const pageComponent = (
    <StoresContext.Provider value={stores}>
      <MemoryRouter initialEntries={["/discussion/15"]}>
        <Route exact path={'/discussion/:id'} component={DiscussionPage} />
      </MemoryRouter>
    </StoresContext.Provider>
  );
  const { getByText, getByRole, unmount } = render(pageComponent);
  const placeholder = await waitForElement(() => getByText(REPLY_PLACEHOLDER_TEXT));
  expect(placeholder).toBeInTheDocument();
  unmount();


  // jest.setTimeout(60000 * 3);
  // let browser = await puppeteer.launch();
  // let page = await browser.newPage();
  // await page.goto('http://localhost:443/discussion/15');
  // const repliesList = await page.$eval('#main-replies-list-container', e => e.innerHTML);
  // console.log('repliesList: ', repliesList);
  // const initialReplyContent = browser.close();
  // browser.close();
});

test.skip('Updates UI when adding replies',  async () => {
  const testImage = new File(['TEST_IMAGE_DATA'], 'image.jpg', { type: 'image/jpg' });
  const completeTestPost = {};
});
