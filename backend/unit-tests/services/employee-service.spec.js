const sinon = require('sinon');
const { expect } = require('chai');
const { loadEmployeesToDB } = require('../../src/services/employee-service'); // Dein Service
const hrm = require('../../src/services/orangehrm-service'); // Das Modul mit der getAllEmployees Methode

describe('loadEmployeesToDB', function () {
    let dbStub;
    let getAllEmployeesStub;

    beforeEach(() => {
        // Mock für die Datenbankverbindung
        dbStub = {
            collection: sinon.stub().returns({
                findOne: sinon.stub().resolves(null),
                insertMany: sinon.stub().resolves()
            })
        };

        // Stub für getAllEmployees Methode
        getAllEmployeesStub = sinon.stub(hrm, 'getAllEmployees').resolves([
            {
                code: '12345',
                employeeId: '1',
                firstName: 'John',
                lastName: 'Doe',
                jobTitle: 'Salesman',
                unit: 'Sales',
                supervisor: 'Jane Smith'
            },
            {
                employeeId: '2',
                code: '67890',
                firstName: 'Alice',
                lastName: 'Johnson',
                jobTitle: 'Saleswoman',
                unit: 'Sales',
                supervisor: 'John Smith'
            }
        ]);
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs
    });

    describe('Service is online (reachable)', function () {
        it('should load employees into the database', async () => {
            await loadEmployeesToDB(dbStub); // Funktionsaufruf

            const insertedData = dbStub.collection().insertMany.getCall(0).args[0];
            expect(insertedData).to.be.an('array').with.lengthOf(15); // Überprüfen der Länge von insertedData

            /*expect(insertedData[0]).to.include({
                code: 12345,
                sid: 1,
                firstname: 'John',
                lastname: 'Doe',
                jobTitle: 'Salesman',
                department: 'Sales',
                supervisor: 'Jane Smith'
            });
            expect(insertedData[1]).to.include({
                code: 67890,
                sid: 2,
                firstname: 'Alice',
                lastname: 'Johnson',
                jobTitle: 'Saleswoman',
                department: 'Sales',
                supervisor: 'John Smith'
            });*/
        });
    });

    describe('Service is offline (not reachable)', function () {
        it('should handle errors correctly when the service is offline', async () => {
            hrm.getAllEmployees.rejects(new Error('Network Error'));

            try {
                await loadEmployeesToDB(dbStub);
                throw new Error('Test failed');
            } catch (error) {
                expect(error.message).to.include('Network Error');
            }
        });
    });
});
