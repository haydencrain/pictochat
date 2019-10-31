import { wait } from 'pptr-testing-library';
import { Page } from 'puppeteer';
import config from '../src/config';
import { JWT } from '../e2e-tests/constants';


/**
 * Resets the state of the backend. Allows changes made to the DB to be cleaned up between tests. */
export async function resetBackend() {
  await fetch(`${config.urls.BACKEND_ENDPOINT}/unsafe-testing/reset`, { method: 'POST' });
}

/**
 * Open page using puppeteer browser instance */
export async function openPage(browser, url: string): Promise<Page> {
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

/**
 * Polls the specified callback until it resolves or timeout is reached and then returns the result
 *  */
export async function waitAndGet<R>(cb: () => Promise<R>, options?: {timout?: number, interval?: number}): Promise<R> {
  let result: Promise<R>;
  await wait(() => {
    result = cb();
    return result;
  }, options);
  return result
}

export async function loginWithStaticCookies(page: Page, jwt = JWT) {
  await page.setCookie({name: config.cookieNames.JWT, value: jwt});
  await page.reload();
}
