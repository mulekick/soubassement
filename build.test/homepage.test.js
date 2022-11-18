/* eslint-disable node/no-unpublished-import, no-undef, node/no-process-env, no-shadow */

// import primitives
import process from "node:process";
import console from "node:console";
import {fork} from "node:child_process";

// import modules
import puppeteer from "puppeteer";
import {getDocument, queries, waitFor} from "pptr-testing-library";
import config from "../config.js";

const
    // destructure config values
    {APP_PORT} = config,
    // create abort controller
    controller = new AbortController(),
    // extract testing-library's puppeteer queries ...
    {getByText, getByTestId, getAllByAltText} = queries;

describe(`app integration tests suite`, () => {

    let [ browser, page, response, documentHandle ] = [ null, null, null, null ];

    // setup
    beforeAll(async() => {
        console.log(`starting app ...`);
        const
            // start app
            testapp = fork(`server.js`, {
                // submit to abort controller signal for termination
                signal: controller.signal,
                // not-so-obvious default option
                env: process.env,
                // use SIGTERM
                killSignal: `SIGTERM`,
                // mute app output
                stdio: `ignore`
            });

        testapp
            // termination handler
            .on(`error`, e => {
                console.error(`express server shut down: ${ e.message }\n${ controller.signal.reason }`);
            });

        // let's give the app one second to breathe ...
        await new Promise(r => { setTimeout(() => r(), 1e3); });

        console.log(`starting browser ...`);
        // start browser (allow self-signed certificates)
        browser = await puppeteer.launch({args: [ `--ignore-certificate-errors` ]});
        page = await browser.newPage();
        // navigate to home page (all tests will run on a single page load) ...
        response = await page.goto(`https://localhost:${ APP_PORT }`);
        documentHandle = await getDocument(page);
    });

    describe(`when navigating to the home page`, () => {

        // test response code
        it(`HTTP request should have returned a code 200`, () => {
            expect(response.status()).toBe(200);
        });
        // test /fetch/inline route
        it(`should display a random string of length 64`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getByText(documentHandle, /[0-9a-f]{64}/ui));
        });

        // test button
        it(`should display a 'request token' button`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getByText(documentHandle, `request a token`));
        });

        // test /protected route (no token)
        it(`should display an 'access to protected resources denied' message`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getByText(documentHandle, `you are not allowed to access this resource 😬`));
        });

        // test file input
        it(`should display a 'browse for a file' button`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getByTestId(documentHandle, `afile`));
        });

        // test button
        it(`should display an 'upload file' button`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getByText(documentHandle, `upload file`));
        });

        // test vite logo
        it(`should display the vite.js logo`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getAllByAltText(documentHandle, `Vite logo`));
        });

        // test pepe
        it(`should display some pepe ASCII art`, async() => {
            // test for the required element to not throw ...
            await waitFor(() => getByTestId(documentHandle, `pepe`));
        });

    });

    describe(`when requesting a token`, () => {
        // test /protected route (with token)
        it(`should display an 'access to protected resources allowed' message`, async() => {
            // request a token ...
            await page.click(`#tokenplease`);
            // test for the required element to not throw ...
            await waitFor(() => getByText(documentHandle, `you now have access to protected resources 😎`));
        });
    });

    // teardown
    afterAll(async() => {
        // close browser
        console.log(`stopping browser ...`);
        await browser.close();
        // send abort signal to app
        console.log(`stopping app ...`);
        controller.abort(`tests are completed`);
    });

});