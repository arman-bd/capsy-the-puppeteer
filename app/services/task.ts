import puppeteer from "puppeteer";

export default class TaskService {
  /**
   * Take a screenshot of a website
   * @param url : string | null - URL to take screenshot of
   * @returns screenshot : string | Buffer | null - Screenshot of URL
   * @example
   * const screenshot = await this.screenshot("https://google.com");
   * @see https://pptr.dev/#?product=Puppeteer&version=v5.5.0&show=api-pagescreenshotoptions
   */
  public async screenshot(url: string): Promise<string | Buffer> {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for Page to Finish Loading
    await page.waitForNavigation();

    // Take Screenshot
    const screenshot = await page.screenshot({ fullPage: true });

    // Close Browser
    await browser.close();

    // Return Screenshot
    return screenshot;
  }
}
