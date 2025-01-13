const { getAllEmployees } = require('./orangehrm-service');
const {app} = require("express/lib/request");

async function loadEmployeesToDB(db) {
    try {
        const employees = await getAllEmployees();

        const salesmanDocuments = [];

        for (const employee of employees) {

            const existingSalesman = await db.collection('salesmen').findOne({
                $or: [{ sid: employee.employeeId }, { code: employee.code }]
            });

            if (!existingSalesman) {

                const salesman = {
                    code: parseInt(employee.code, 10),
                    sid: parseInt(employee.employeeId, 10),
                    firstname: employee.firstName,
                    lastname: employee.lastName,
                    jobTitle: employee.jobTitle,
                    department: employee.unit,
                    supervisor: Array.isArray(employee.supervisor) ? employee.supervisor[0]?.name : employee.supervisor
                };
                console.log('New Salesman:', salesman);

                salesmanDocuments.push(salesman);
            }
        }

        if (salesmanDocuments.length > 0) {
            await db.collection('salesmen').insertMany(salesmanDocuments);
            console.log('New Salesmen successfully saved.');
        } else {
            console.log('No new Salesmen for saving.');
        }
    } catch (error) {
        console.error('Error when loading Employees into DB:', error.message);
        throw new Error(`Error when loading Employees: ${error.message}`);
    }
}

module.exports = { loadEmployeesToDB };
