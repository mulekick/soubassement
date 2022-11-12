/**
 * @jest-environment node
 */

/* eslint-disable no-invalid-this, no-undef */

// import middlewares
import mupload from "../middlewares/upload.js";

describe(`test file upload `, () => {
    let
        // init mock variables
        [ mockRequest, mockResponse, mockNext ] = [ null, null, null ];

    // setup
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            // mock methods (implement a function for chaining)
            status: jest.fn(function() { return this; }),
            cookie: jest.fn(function() { return this; }),
            send: jest.fn(),
            end: jest.fn()
        };
        mockNext = jest.fn();
    });

    // it is very difficult to mock a POST request containing multipart data
    // thus we can only test the error throwing on an invalid request ...

    describe(`upload middleware`, () => {
        test(`should pass error to next()`, async() => {
            // call middleware
            await mupload(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockNext).toHaveBeenCalled();
        });
    });
});