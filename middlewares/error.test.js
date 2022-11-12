/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

import merror from "./error.js";

describe(`test error throwing middleware`, () => {
    // test against the error message
    it(`should throw an error`, () => {
        // calls to error throwing functions need to be wrapped
        // in another function or the toThrow() matcher will fail
        expect(() => merror()).toThrow(`some asshole purposely threw an error 😡`);
    });
});