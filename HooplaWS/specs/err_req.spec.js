let req = require('request')

const errorlogger = require('../src/utilities/errorlogger');

const reqlogger = require('../src/utilities/requestlogger')

const fs = require('fs')

const wait = () => {
    return (setTimeout(() => {
        return new Promise(resolve => resolve())
    }), 2000);
}

describe('Testing Errorlogger', () => {
    let obj = { "errorlogger": errorlogger }
    let next = () => { }
    beforeEach(() => {
        res = {
            status: undefined,
            json: undefined,
            status: function (status) { this.status = status },
            json: function (json) { this.json = json }
        }
    })

    it('Response status set to 500 by default for Error', () => {
        let err = new Error("ErrorLogger test");
        try {
            obj.errorlogger(err, req, res, next)
        } catch (e) { }
        finally {
            expect(res.status).toEqual(500);
        }
    })


    it('Response status is set using Error status', () => {
        let err = new Error("ErrorLogger test");
        err.status = 404
        try {
            obj.errorlogger(err, req, res, next)
        } catch (e) { }
        finally {
            expect(res.status).toEqual(404);
        }
    })


    it('Response Should Contain Error Message', () => {
        let err = new Error("ErrorLogger test");

        try {

            obj.errorlogger(err, req, res, next)

        } catch (e) { }

        finally {

            expect(res.json.message).toEqual(err.message);

        }

    })

})


describe("Testing RequestLogger", () => {

    let obj = { "Requestlogger": reqlogger }

    let nextObj;

    let res = {}

    beforeEach(() => {

        nextObj = { next() { } }

        spyOn(nextObj, 'next')

        req.url = '/testing'

        req.method = 'get'

        fdata1 = '',

            fdata2 = ''


    })

    it('next should be called', () => {

        try {

            obj.Requestlogger(req, res, nextObj.next);

        }

        finally {

            expect(nextObj.next).toHaveBeenCalled();

        }

    })

    it('Request should be logged in file', () => {

        try {

            fdata1 = fs.readFileSync('../RequestLogger.txt');

            obj.Requestlogger(req, res, nextObj.next);

        }

        catch (e) { }

        finally {

            wait();

            fdata2 = fs.readFileSync('RequestLogger.txt');

            expect(fdata2.length).toBeGreaterThan(fdata1.length);

        }

    })

});