const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Ann array of viewport sizes for different devices.
  const viewports = [{
      width: 1600,
      height: 992
    },
    {
      width: 1280,
      height: 802
    },
    {
      width: 768,
      height: 1024
    },
    {
      width: 320,
      height: 480
    }
  ]

  await page.goto('http://flyve.org/');

  for (let i = 0; i < viewports.length; i++) {
    let vw = viewports[i];

    // The height doesn't matter since we are screenshotting the full page.
    await page.setViewport({
      width: vw.width,
      height: vw.height
    });

    await page.screenshot({
      path: `screenshots/screen-${vw.width}x${vw.height}.png`,
      fullPage: true
    });
  }

  browser.close();
})();