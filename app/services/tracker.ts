import puppeteer from "puppeteer";

export default class TrackerService {
  /**
   * Track CARU Containers
   * @param id: string - ID of Container
   * @returns HTML of Container Details
   * @example
   * const html = await new TrackerService().track_caru("WSCU5700298");
   */
  public async track_caru(id: string): Promise<string> {
    // Launch Puppeteer
    const browser = await puppeteer.launch();

    // Open New Page
    const page = await browser.newPage();

    // Go to Caru
    await page.goto(
      "https://portal.carucontainers.com/scripts/caruweb02.wsc/WService=caru/system/web/sp-web-menu.r?program=DP.WEB-UNIT_INQUIRY&clearsearch=yes"
    );

    // Wait for Page to Finish Loading Recaptcha
    await page.waitForSelector("div.g-recaptcha");

    // Bypass Captcha via 2Captcha
    const captcha = await this.solve_recaptchav3(page);

    // Fill in Captcha [ g-recaptcha-response ]
    await page.type("#g-recaptcha-response", captcha);

    // Click Input with Type Submit with Value Continue
    await page.click("input[type=submit][value=Continue]");

    // Wait for Navigation to Finish
    await page.waitForNavigation();

    // Wait Until Input with Name containernumber is Visible
    await page.waitForSelector('input[name="containernumber"]');

    // Fill in Container Number
    await page.type('input[name="containernumber"]', id);

    // Click Input with Type Submit and Value Open
    await page.click('input[type="submit"][value="Open"]');

    // Wait for Navigation to Finish
    await page.waitForNavigation();

    // Get HTML from First TD with Class aa_page_text
    const html = await page.$eval("td.aa_page_text", (e) => e.innerHTML);

    // Close Browser
    await browser.close();

    // Return HTML
    return html;
  }

  /**
   * Solve ReCaptcha v3 via 2Captcha
   * @param page : puppeteer.Page - Page to Solve Captcha
   * @returns token : string - Captcha Token
   * @example
   * const token = await this.solve_recaptchav3(page);
   */
  public async solve_recaptchav3(page: puppeteer.Page): Promise<string> {
    // Get Site Key for reCaptchav3
    const site_key = await page.$eval("div.g-recaptcha", (e) =>
      e.getAttribute("data-sitekey")
    );

    // Get Token from 2Captcha
    const token = await this.get_recaptchav3_token(site_key);

    // Return Token
    return token;
  }

  /**
   * Get ReCaptcha v3 Token via 2Captcha
   * @param site_key : string - Site Key for reCaptchav3
   * @returns token : string - Captcha Token
   * @example
   * const token = await this.get_recaptchav3_token("6LcU3cQU...");
   * @see https://2captcha.com/2captcha-api#solving_recaptchav3
   */
  public async get_recaptchav3_token(site_key: string) {
    // Get 2Captcha API Key from Environment Variable
    const api_key = process.env.CAPTCHA_API_KEY;

    // Get 2Captcha API URL from Environment Variable
    const api_url = process.env.CAPTCHA_API_URL;

    // Get 2Captcha API URL
    const url = `${api_url}?key=${api_key}&method=userrecaptcha&googlekey=${site_key}&pageurl=https://portal.carucontainers.com/scripts/caruweb02.wsc/WService=caru/system/web/sp-web-menu.r?program=DP.WEB-UNIT_INQUIRY&clearsearch=yes`;

    // Get Response from 2Captcha
    const response = await fetch(url);

    // Get JSON from Response
    const json = await response.json();

    // Return Token
    return json.request;
  }
}
