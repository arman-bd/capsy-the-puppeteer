import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
const {executablePath} = require('puppeteer')
require('dotenv').config()
export default class TrackerService {
  /**
   * Track CARU Containers
   * @param id: string - ID of Container
   * @returns HTML of Container Details
   * @example
   * const html = await new TrackerService().track_caru("WSCU5700298");
   */
  public async track_caru(id: string): Promise<string> {

    // Load Puppeteer
    puppeteer.use(RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: process.env.CAPTCHA_API_KEY
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    }));

    // Launch Puppeteer
    const browser = await puppeteer.launch(
      {
        headless: true,
        executablePath: executablePath()
      }
    );

    // Open New Page
    const page = await browser.newPage();
    page.setViewport({width: 1920, height: 1080});
    page.setDefaultNavigationTimeout(0); // Disable Timeout

    // Go to Caru
    await page.goto(
      "https://portal.carucontainers.com/scripts/caruweb02.wsc/WService=caru/system/web/sp-web-menu.r?program=DP.WEB-UNIT_INQUIRY&clearsearch=yes"
    );

    // Wait for Captcha
    await page.waitForSelector("#g-recaptcha-response");

    console.log("Solving Captcha... @ " + page.url());

    // Solve reCAPTCHA
    await page.solveRecaptchas();

    // Click Input with Type Submit with Value Continue
    await page.click("input[type=submit][value=Continue]");

    // Wait for Navigation to Finish
    await page.waitForNavigation();

    console.log("Page URL:", page.url());

    // Wait Until Input with Name containernumber is Visible
    await page.waitForSelector('input[name="containernumber"]');

    // Fill in Container Number
    await page.type('input[name="containernumber"]', id);

    // Click Input with Type Submit and Value Open
    await page.click('input[type="submit"][value="Open"]');

    // Wait for Navigation to Finish
    await page.waitForNavigation();

    console.log("Page URL:", page.url());

    // Get HTML from First TD with Class aa_page_text
    const html = await page.$eval("td.aa_page_text", (e) => e.innerHTML);

    // Close Browser
    await browser.close();

    // Return HTML
    return html;
  }

  /**
   * Track Evergreeen Containers
   * @param id: string - ID of Container
   * @returns HTML of Container Details
   * @example
   * const html = await new TrackerService().track_evergreen("EMCU8717530");
   */
   public async track_evergreen(id: string): Promise<string> {

    // Launch Puppeteer
    const browser = await puppeteer.launch(
      {
        headless: false,
        executablePath: executablePath()
      }
    );

    // Open New Page
    const page = await browser.newPage();
    page.setViewport({width: 1920, height: 1080});
    page.setDefaultNavigationTimeout(0); // Disable Timeout

    // Go to Caru
    await page.goto(
      "https://ct.shipmentlink.com/servlet/TDB1_CargoTracking.do"
    );

    // Wait for Page to Load
    await page.waitForSelector("#NO");

    console.log("Page URL:", page.url());

    // Select Container
    await page.click('#s_cntr');

    // Fill in Container Number
    await page.type('#NO', id);

    // Click Submit
    await page.click('#nav-quick > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td.ec-text-start > table > tbody > tr > td > div:nth-child(2) > input');

    // Wait for Navigation to Finish
    await page.waitForNavigation();

    // Select Table
    const table = await (await page.$('body > div.content_style > center > table:nth-child(4)'));
    const html = await page.evaluate(table => table.innerHTML, table);

    // Close Browser
    await browser.close();

    // Return HTML
    return html;
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
