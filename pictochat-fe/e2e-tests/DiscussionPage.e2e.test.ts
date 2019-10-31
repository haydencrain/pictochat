import path from 'path';
import fetch from 'node-fetch';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import { wait } from 'pptr-testing-library';
import config from '../src/config';
import { REPLY_PLACEHOLDER_TEXT } from '../src/pages/DiscussionPage/DiscussionPage';

import '@testing-library/jest-dom/extend-expect';
import 'pptr-testing-library/extend';
import { openPage, resetBackend, loginWithStaticCookies, waitAndGet } from '../test-utils/E2EUtils';
import { TEST_IMAGE_PATH, NO_REPLY_POST_ID, ONE_REPLY_TEST_ROOT_POST_ID, ONE_REPLY_TEST_REPLY_POST_ID, ONE_REACTION_POST_ID, NO_REPLIES_OR_REACTIONS_TEST_POST_ID } from './constants';

//// CONSTANTS ////
const DISCUSSION_PAGE_URL_ROOT = `${config.urls.FRONTEND_URL_ROOT}discussion/`


//// GLOBALS ////
let browser: Browser;

//// PAGE QUERIES ////

async function getPostItem(page: Page, postId: string): Promise<ElementHandle<Element>> {
  return page.waitForXPath(`//*[@data-postid='${postId}']`);
}

async function getPostImage(page: Page, postId: string): Promise<ElementHandle<Element>> {
  const post = await getPostItem(page, postId);
  return (await post.$$('.post-image'))[0];
}

async function getPostImageSrc(page, postId) {
  const image = await getPostImage(page, postId);
  return image.evaluate(node => node.getAttribute('src'));
}

async function getNoRepliesPlaceholder(page: Page): Promise<ElementHandle<Element>> {
  return page.waitForSelector('.no-posts-message');
}

/** for root post */
async function getMainReplyListContainer(page: Page): Promise<ElementHandle<Element>> {
  return page.waitForSelector('#main-replies-list-container');
}

/** for the root post */
async function getMainPostReplies(page: Page): Promise<ElementHandle<Element>[]> {
  const replyContainer = await getMainReplyListContainer(page);
  return replyContainer.$$('.reply');
}

/** for non-root post */
async function getPostReplyContainer(postContainer: ElementHandle<Element>): Promise<ElementHandle<Element>> {
  return waitAndGet(() => postContainer.$('.post-replies'));
}

/** for non root posts */
async function getPostReplies(page: Page, postId: string): Promise<ElementHandle<Element>[]> {
  const postContainer = await getPostItem(page, postId);
  const replyContainer = await getPostReplyContainer(postContainer);
  return replyContainer.$$('.reply');
}

//// User Actions ////

/**
 * Open puppeteer to discussion page for specified post */
async function openDiscussionPage(browser, rootPostId: string): Promise<Page> {
  return openPage(browser, `${DISCUSSION_PAGE_URL_ROOT}${rootPostId}`);
}

/**
 * Execute user actions to submit image at TEST_IMAGE_PATH as a new reply using
 * the active CreatePostModal
 */
async function simulateCreatePostModal(page: Page) {
  const createPostModal = await page.waitForSelector('.create-post-modal');

  // using a local test image as the file input's value
  const imageFileInput = await createPostModal.$('input[type="file"]');
  await imageFileInput.uploadFile(TEST_IMAGE_PATH);

  const submitBtn = await createPostModal.getByText('Submit');
  await submitBtn.click();
}

/**
 * Execute user actions to submit new reply to the page's main (aka root) post
 */
async function simulateReplyToMainPost(page: Page) {
  const document = await page.getDocument();
  const addReplyBtn = await waitAndGet(() => document.getByText('Add Reply'));
  await addReplyBtn.click(); // opens the create post modal
  await simulateCreatePostModal(page);
}

/**
 * Execute user actions to submit new reply to the specified post
 */
async function simulateReplyToPost(page: Page, postId: string) {
  const post = await getPostItem(page, postId);
  // extracting first match as child posts will also have 'reply' buttons
  const replyBtn = (await waitAndGet(() => post.getAllByText('reply')))[0];
  await replyBtn.click(); // opens create post modal
  await simulateCreatePostModal(page);
}

/**
 * Execute user actions to delete specified post
 */
async function simulateDeletePost(page: Page, postId: string) {
  const post = await getPostItem(page, postId);
  // extracting first match as child posts will also instances of this button
  // const deletePostBtn = await ( waitAndGet(() => post.$$('.delete-post')) )[0];
  const deleteElms = await waitAndGet(() => post.getAllByText('delete'));
  const deletePostBtn = deleteElms[0];
  await deletePostBtn.click();
}

/// TESTS ///

beforeEach(async () => {
  // 10 minutes
  jest.setTimeout(60000 * 2);
browser = await puppeteer.launch({ headless: false, slowMo: 200 });
  await resetBackend();
});

afterEach(async () => {
  await browser.close();
});

describe('Reply to posts feature', () => {
  test('shows placeholder for posts with no replies', async () => {
    const page = await openDiscussionPage(browser, NO_REPLY_POST_ID);
    const placeholder = await getNoRepliesPlaceholder(page);
    expect(placeholder).toBeDefined();
    const placeholderText = await placeholder.evaluate(node => node.innerHTML);
    expect(placeholderText).toBe(REPLY_PLACEHOLDER_TEXT);
  });

  test('Updates main reply list when user adds reply',  async () => {
    const page = await openDiscussionPage(browser, NO_REPLY_POST_ID);
    await loginWithStaticCookies(page);

    // Add first reply
    await simulateReplyToMainPost(page);

    const getReplies = () => getMainPostReplies(page);
    await wait(() => expect(getReplies()).resolves.toHaveLength(1));

    // Add a second reply
    await simulateReplyToMainPost(page);
    await wait(() => expect(getReplies()).resolves.toHaveLength(2));
  });

  test('Updates child reply list when user adds reply to a reply', async () => {
    const page = await openDiscussionPage(browser, ONE_REPLY_TEST_ROOT_POST_ID);
    await loginWithStaticCookies(page);

    // Add first reply
    await simulateReplyToPost(page, ONE_REPLY_TEST_REPLY_POST_ID);

    const getReplies = () => getPostReplies(page, ONE_REPLY_TEST_REPLY_POST_ID);
    await wait(() => expect(getReplies()).resolves.toHaveLength(1));

    // Add second reply
    await simulateReplyToPost(page, ONE_REPLY_TEST_REPLY_POST_ID);
    await wait(() => expect(getReplies()).resolves.toHaveLength(2));
  });
});

describe('Edit/delete posts feature', () => {
  test("Post image is updated when deleting post with replies", async () => {
      const postId = ONE_REPLY_TEST_ROOT_POST_ID;
      const page = await openDiscussionPage(browser, postId);
      await loginWithStaticCookies(page);
      const initialSrc = await getPostImageSrc(page, postId);

      await simulateDeletePost(page, postId);

      await wait(async () => {
        const updatedSrc = getPostImageSrc(page, postId);
        console.log(`[postId: ${postId}] updatedSrc: ${await updatedSrc}`);
        return expect(updatedSrc).resolves.not.toEqual(initialSrc);
      }, {timeout: 50});
    }
  );

  test('Deleted Post is removed when it has no replies ', async () => {
    const page = await openDiscussionPage(browser, NO_REPLIES_OR_REACTIONS_TEST_POST_ID);
    await loginWithStaticCookies(page);
    await simulateDeletePost(page, NO_REPLIES_OR_REACTIONS_TEST_POST_ID);
    await wait(async () => {
      await expect(getPostItem(page, NO_REPLIES_OR_REACTIONS_TEST_POST_ID)).rejects.toThrow();
    });
  });
});
