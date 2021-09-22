const validator = require("../src/utilities/validator");


describe("Testing  user data", () => {

    beforeEach(() => {

        data = {

            uEmail: "john@gmail.com",

            uPass: "John@1234",

            uName: "John",

            dob: "2018-06-08",

            uphone: "8265839081",

            uAddress: "bangalore"

        }

    }

    )

    it("testing an Email of user", () => {

        data.uEmail = "john2gmailcom"

        expect(function () { validator.validateemailId(data.uEmail) }).toThrow(new Error("Email id format is wrong"));

    })
    it("testing an Email of user:correct", () => {

        data.uEmail = "john@gmail.com"

        expect(validator.validateemailId(data.uEmail)).toEqual(undefined);

    })


    it("testing name of user", () => {

        data.userName = " John "

        expect(function () { validator.validateUsername(data.userName) }).toThrow(new Error("Should be at least 3 characters long consisting of alphabet and spaces and spaces should not be present at start or end"));

    })
    it("testing name of user:correct", () => {

        data.userName = "John"

        expect(validator.validateUsername(data.userName)).toEqual(undefined);

    })

    it("testing date of birth", () => {

        data.dob = "2020-12-12"

        expect(function () { validator.validatedob(data.dob) }).toThrow(new Error("User DOB should be less than today's date"));

    })
    it("testing date of birth:correct", () => {

        data.dob = "2019-02-10"

        expect(validator.validatedob(data.dob)).toEqual(undefined)

    })

    it("testing of mobile number", () => {

        data.mobileNumber = "826D!583901"

        expect(function () { validator.validatemobileNumber(data.mobileNumber) }).toThrow(new Error("Mobile number should be of 10 digits"));

    })
    it("testing of mobile number:correct", () => {

        data.mobileNumber = "9898766754"

        expect(validator.validatemobileNumber(data.mobileNumber)).toEqual(undefined)

    })


    it("testing of password", () => {

        data.password = "b@!2A}"

        expect(function () { validator.validatePassword(data.password) }).toThrow(new Error("Should be 7-20 characters long consisiting of alphabets with at least 1 uppercase , 1 lowercase,1 digits and any of !@#$%&"));

    })

    it("testing of password:correct", () => {

        data.password = "Xyz@1234"

        expect(validator.validatePassword(data.password)).toEqual(undefined)

    })

    it("testing of address", () => {

        data.address = " ge@eeTw"

        expect(function () { validator.validateaddress(data.address) }).toThrow(new Error("Provide proper address of at least 10 characters"));

    })
    it("testing of address:correct", () => {

        data.address = "edtghyulkhg"

        expect(validator.validateaddress(data.address)).toEqual(undefined)

    })


})
