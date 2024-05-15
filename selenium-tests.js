const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

async function runTests(browser) {
    let driver;
    if (browser === 'chrome') {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    } else if (browser === 'firefox') {
        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options()).build();
    }

    try {
        await driver.get('http://aihome.local:2000'); // set up proper url for your app
        // Add your tests here
        let title = await driver.getTitle();
        console.log(`Title is: ${title}`);
        // Expected title is "MQTT Dashboard"
        if (title === "MQTT Dashboard") {
            console.log("Test passed!");
        } else {
            console.log("Test failed!");
        }
    } finally {
        await driver.quit();
    }
}

const browser = process.argv[2];
runTests(browser).catch(console.error);
