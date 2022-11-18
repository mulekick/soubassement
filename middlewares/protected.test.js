/**
 * @jest-environment node
 */

/* eslint-disable no-invalid-this, no-undef */

// import middlewares
import {mtoken, mprotection, mfallback} from "../middlewares/protected.js";

describe(`test protected resources fetching`, () => {
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

    describe(`token request middleware`, () => {
        it(`should return a HTTP 201`, async() => {
            // call middleware
            await mtoken(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        });
        it(`should add set-cookie header to response`, async() => {
            // call middleware
            await mtoken(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.cookie).toHaveBeenCalled();
        });
        it(`should end response`, async() => {
            // call middleware
            await mtoken(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.end).toHaveBeenCalled();
        });
    });

    describe(`protection middleware (no token)`, () => {
        it(`should pass error to next()`, async() => {
            // call middleware
            await mprotection(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe(`fallback middleware`, () => {
        it(`should return a HTTP 200`, () => {
            // call middleware
            mfallback(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        it(`should return a default message`, () => {
            // call middleware
            mfallback(mockRequest, mockResponse, mockNext);
            // actual test
            expect(mockResponse.send).toHaveBeenCalledWith(`you now have access to protected resources 😎`);
        });
    });
});