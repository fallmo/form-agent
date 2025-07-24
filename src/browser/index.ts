import puppeteer from "puppeteer";
import { formConfiguration } from "../types/form-configuration";

export async function handleForm(config: formConfiguration) {
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS === "false" ? false : true,
  });
  const pages = await browser.pages();
  const page = pages[0];

  console.log("Navigating to page...");
  await page.goto(config.url);

  console.log("Beginning form filling");
  for (let i = 0; i < config.fields.length; i++) {
    console.log(`Working with field at index [${i}]...`);
    console.log("Waiting for field...");
    const field = config.fields[i];
    await page.waitForSelector(field.selector);

    console.log("Entering value for field...");
    if (field.kind === "text") {
      await page.type(field.selector, field.value);
    } else {
      throw new Error(`Unexpected field kind '${field.kind}'`);
    }
    console.log(`Successfully filled field at index [${i}]`);
  }

  console.log("Awaiting submit button");
  await page.waitForSelector(config.submitBtnSelector);

  console.log("Submitting form");
  await page.click(config.submitBtnSelector);

  console.log("Form submitted, awaiting result");

  const abortController = new AbortController();
  const resultsArray: Array<Promise<boolean>> = [];

  for (let i = 0; i < config.failedElementSelectors.length; i++) {
    resultsArray.push(
      new Promise((resolve, reject) => {
        page
          .waitForSelector(config.failedElementSelectors[i], {
            timeout: config.timeoutSeconds * 1000,
            signal: abortController.signal,
          })
          .then(async () => {
            abortController.abort();
            await browser.close();
            throw new Error(
              `Form submission failed. Found error selector at index [${i}] '${config.failedElementSelectors[i]}'`
            );
          })
          .catch((err) => {
            console.log(err + `\nfailure selector at index [${i}] `);
          });
      })
    );
  }

  for (let i = 0; i < config.successElementSelectors.length; i++) {
    resultsArray.push(
      new Promise((resolve, reject) => {
        page
          .waitForSelector(config.successElementSelectors[i], {
            timeout: config.timeoutSeconds * 1000,
            signal: abortController.signal,
          })
          .then(async () => {
            abortController.abort();
            await browser.close();
            resolve(true);
            console.log(
              `Form submission succeeded. Found success selector at index [${i}] '${config.successElementSelectors[i]}'`
            );
          })
          .catch((err) => {
            console.log(err + `\nsuccess selector at index [${i}] `);
          });
      })
    );
  }

  const success = await Promise.race(resultsArray);
  if (success) return;

  throw new Error(
    "Timeout out waiting for success selector or failure selector"
  );
}
