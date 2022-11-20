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
}
