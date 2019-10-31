import { Page } from 'puppeteer';
/**
 * Resets the state of the backend. Allows changes made to the DB to be cleaned up between tests. */
export declare function resetBackend(): Promise<void>;
/**
 * Open page using puppeteer browser instance */
export declare function openPage(browser: any, url: string): Promise<Page>;
/**
 * Polls the specified callback until it resolves or timeout is reached and then returns the result
 *  */
export declare function waitAndGet<R>(cb: () => Promise<R>, options?: {
    timout?: number;
    interval?: number;
}): Promise<R>;
export declare function loginWithStaticCookies(page: Page, jwt?: string): Promise<void>;
