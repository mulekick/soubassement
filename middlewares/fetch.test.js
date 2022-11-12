/**
 * @jest-environment node
 */

/* eslint-disable no-invalid-this, no-undef */

// import middlewares
import {mfetch, mfallback} from "../middlewares/fetch.js";

describe(`test unprotected resources fetching`, () => {
    let
        // init mock variables
        [ mockRequest, mockResponse, mockNext ] = [ null, null, null ];

    // setup
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            // mock methods (implement a function for chaining)
            status: jest.fn(function() { return this; }),
            send: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe(`main middleware`, () => {
        test(`should return a HTTP 200`, () => {
            // call middleware
            mfetch(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        test(`should return a SHA-256 hash`, () => {
            // call middleware
            mfetch(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.send).toHaveBeenCalled();
        });
    });

    describe(`fallback middleware`, () => {
        test(`should return a HTTP 200`, () => {
            // call middleware
            mfallback(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        test(`should return a default message`, () => {
            // call middleware
            mfallback(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.send).toHaveBeenCalledWith(`resources sitting here will be served to anybody 😁`);
        });
    });

});