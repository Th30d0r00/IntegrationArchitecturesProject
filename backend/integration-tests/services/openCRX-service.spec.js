const { expect } = require("chai");
const sinon = require("sinon");
const axios = require("axios");
const { fetchAllAccounts, getSalesOrders } = require("../../src/services/openCRX-service");

describe("Integration Tests for openCRX", function () {
    let axiosStub;

    beforeEach(() => {
        axiosStub = sinon.stub(axios, "get");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("get all accounts from OpenCRX", async function () {
        const mockAccountsData = {
            data: {
                objects: [
                    {
                        fullName: "John Doe",
                        jobRole: "Sales Manager",
                        vcard: "UID:12345",
                        governmentId: "1234"
                    },
                    {
                        fullName: "Jane Smith",
                        jobRole: "Accountant",
                        vcard: "UID:67890",
                        governmentId: "5678"
                    }
                ]
            }
        };

        axiosStub.resolves(mockAccountsData);

        const accounts = await fetchAllAccounts();

        expect(accounts).to.have.lengthOf(2);
        expect(accounts[0]).to.include({
            name: "John Doe",
            jobRole: "Sales Manager",
            uid: "12345",
            governmentId: "1234"
        });
        expect(accounts[1]).to.include({
            name: "Jane Smith",
            jobRole: "Accountant",
            uid: "67890",
            governmentId: "5678"
        });
    });

    it("get all sales orders from OpenCRX", async function () {
        const mockSalesOrdersData = {
            data: {
                objects: [
                    {
                        identity: "salesOrder/001",
                        customer: { '@href': "/customer/001" },
                        activeOn: "2022-01-01T00:00:00Z",
                        priority: "High",
                        salesRep: { '@href': "/salesRep/123" }
                    },
                    {
                        identity: "salesOrder/002",
                        customer: { '@href': "/customer/002" },
                        activeOn: "2023-01-01T00:00:00Z",
                        priority: "Low",
                        salesRep: { '@href': "/salesRep/456" }
                    }
                ]
            }
        };

        // Stub für axios.get erstellen, das die simulierten Sales Orders zurückgibt
        axiosStub.resolves(mockSalesOrdersData);

        const salesOrders = await getSalesOrders();

        // Überprüfen, ob die Sales Orders-Daten korrekt verarbeitet wurden
        expect(salesOrders).to.have.lengthOf(2);
        expect(salesOrders[0]).to.include({
            identity: "001",
            year: "2022",
            customer: "001",
            priority: "High",
            salesmanUid: "123"
        });
        expect(salesOrders[1]).to.include({
            identity: "002",
            year: "2023",
            customer: "002",
            priority: "Low",
            salesmanUid: "456"
        });
    });

    it("throw an error if accounts are not loaded", async function () {
        axiosStub.rejects(new Error("Error when fetching accounts"));

        try {
            await fetchAllAccounts();
            throw new Error("Error was not thrown");
        } catch (error) {
            expect(error.message).to.include("Error when fetching accounts");
        }
    });

    it("throw an error if sales orders are not fetched", async function () {
        axiosStub.rejects(new Error("Error fetching sales orders"));

        try {
            await getSalesOrders();
            throw new Error("Error was not thrown");
        } catch (error) {
            expect(error.message).to.include("Failed to fetch sales orders.");
        }
    });
});
