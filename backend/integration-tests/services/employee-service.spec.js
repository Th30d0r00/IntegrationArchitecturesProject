const proxyquire = require('proxyquire');
const { expect } = require('chai');
const sinon = require('sinon');
const { initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB } = require("../../unit-tests/support/mongodb-mocking");

const hrmModuleMock = {
    getAllEmployees: sinon.stub(),
};

const odooModuleMock = {
    getAllEmployeesFromOdoo: sinon.stub(),
    getBonusesFromOdoo: sinon.stub(),
};

const { loadEmployeesToDB, createUsersFromEmployees } = proxyquire("../../src/services/employee-service", {
    "../../src/services/orangeHRM-service": hrmModuleMock,
    "../../src/services/odoo-service": odooModuleMock,
});

describe("Integration tests for employee-service", function () {
    let db;

    beforeEach(async () => {
        db = await initMockedMongoDB();
    });

    afterEach(async () => {
        await resetMockedMongoDB(db); // DB leeren
        sinon.restore();
    });

    after(async () => {
        await closeMockedMongoDB(db);
    });

    it("employees saved", async function () {

        hrmModuleMock.getAllEmployees.resolves([
            { employeeId: "1", code: "101", firstName: "Alice", lastName: "Smith", jobTitle: "Sales Rep", unit: "Sales", supervisor: "John Doe" }
        ]);
        odooModuleMock.getAllEmployeesFromOdoo.resolves([
            { employeeId: "2", code: "102", firstName: "Bob", lastName: "Johnson", jobTitle: "Sales Manager", unit: "Sales", supervisor: "Jane Doe" }
        ]);
        odooModuleMock.getBonusesFromOdoo.resolves([
            { employeeId: "1", year: 2023, totalBonus: 5000, approvalStatus: "approved" }
        ]);

        await loadEmployeesToDB(db);

        const salesmen = await db.collection("salesmen").find().toArray();
        expect(salesmen).to.have.lengthOf(2);
        expect(salesmen[0]).to.include({ firstname: "Alice", lastname: "Smith" });
        expect(salesmen[1]).to.include({ firstname: "Bob", lastname: "Johnson" });
        expect(salesmen[0].performance[0].totalBonus).to.equal(5000);
    });

    it("No Salesman saved if a salesman exists with the same sid", async function () {
        await db.collection("salesmen").insertOne({ sid: 1 });

        hrmModuleMock.getAllEmployees.resolves([
            { employeeId: "1", code: "101", firstName: "Alice", lastName: "Smith", jobTitle: "Sales Rep", unit: "Sales", supervisor: "John Doe" }
        ]);
        odooModuleMock.getAllEmployeesFromOdoo.resolves([]);
        odooModuleMock.getBonusesFromOdoo.resolves([]);

        await loadEmployeesToDB(db);

        const salesmen = await db.collection("salesmen").find().toArray();
        expect(salesmen).to.have.lengthOf(1);
    });

    it("throw error if OrangeHRM is not available", async function () {
        hrmModuleMock.getAllEmployees.rejects(new Error("OrangeHRM down"));

        try {
            await loadEmployeesToDB(db);
            throw new Error("Fehlermeldung wurde nicht geworfen");
        } catch (error) {
            expect(error.message).to.include("Error when loading Employees: OrangeHRM down");
        }
    });

    it("users created from employees", async function () {
        hrmModuleMock.getAllEmployees.resolves([
            { employeeId: "1", code: "101", firstName: "Alice", lastName: "Smith", jobTitle: "Sales Rep", unit: "Sales", supervisor: "John Doe" }
        ]);
        odooModuleMock.getAllEmployeesFromOdoo.resolves([
            { employeeId: "2", code: "102", firstName: "Bob", lastName: "Johnson", jobTitle: "Sales Manager", unit: "Sales", supervisor: "Jane Doe" }
        ]);

        await createUsersFromEmployees(db);

        const users = await db.collection("users").find().toArray();
        expect(users).to.have.lengthOf(2);
        expect(users[0]).to.include({ username: "101" });
        expect(users[1]).to.include({ username: "102" });
    });
});
