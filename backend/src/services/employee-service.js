const { getAllEmployees } = require('./orangeHRM-service');
const {add} = require('./user-service');
const User = require("../models/User");

async function loadEmployeesToDB(db) {
    try {
        const employees = await getAllEmployees();

        const salesmanDocuments = [];

        for (const employee of employees) {

            const existingSalesman = await db.collection('salesmen').findOne({
                $or: [
                    { sid: parseInt(employee.employeeId, 10) },
                    { code: parseInt(employee.code, 10) }
                ]
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

async function createUsersFromEmployees(db) {
    try {
        const employees = await db.collection('salesmen').find().toArray();

        for (const employee of employees) {
            const existingUser = await db.collection('users').findOne({
                username: employee.code.toString()
            });

            if (!existingUser) {
                const user = new User(
                    employee.code.toString(),
                    employee.sid,
                    employee.firstname,
                    employee.lastname,
                    '',
                    'password',
                    false,
                    employee.department
                );

                await add(db, user);
            }
        }

        console.log('Users successfully created from Employees.');

    } catch (error) {
        console.error('Error when creating Users from Employees:', error.message);
        throw new Error(`Error when creating Users from Employees: ${error.message}`);
    }
}

module.exports = { loadEmployeesToDB, createUsersFromEmployees };

