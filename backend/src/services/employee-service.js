const { getAllEmployees } = require('./orangeHRM-service');
const { getAllEmployeesFromOdoo, getBonusesFromOdoo } = require('./odoo-service');
const {add} = require('./user-service');
const User = require("../models/User");

async function loadEmployeesToDB(db) {
    try {
        const employeesFromOrangeHRM = await getAllEmployees();
        const employeesFromOdoo = await getAllEmployeesFromOdoo();
        const employees = [...employeesFromOrangeHRM, ...employeesFromOdoo];

        const bonuses = await getBonusesFromOdoo();

        const salesmanDocuments = [];

        for (const employee of employees) {
            if (employee.unit === "Sales") { // Only add employees from the "Sales" department
                const sid = employee.employeeId;
                const existingSalesman = await db.collection('salesmen').findOne({
                    $or: [
                        { sid: parseInt(employee.employeeId, 10) },
                        { code: parseInt(employee.code, 10) }
                    ]
                });

                if (!existingSalesman) {
                    const employeeBonuses = bonuses.filter(bonus => bonus.employeeId === sid);

                    let salesman = {
                        code: parseInt(employee.code, 10),
                        sid: parseInt(employee.employeeId, 10),
                        firstname: employee.firstName,
                        lastname: employee.lastName,
                        jobTitle: employee.jobTitle,
                        department: employee.unit,
                        supervisor: Array.isArray(employee.supervisor) ? employee.supervisor[0]?.name : employee.supervisor
                    };

                    // If the salesman has bonuses, add the `performance` field
                    if (employeeBonuses.length > 0) {
                        salesman.performance = employeeBonuses.map(b => ({
                            sid: parseInt(b.employeeId, 10),
                            year: b.year,
                            totalBonus: b.totalBonus,
                            ceoApproval: b.ceoApproval,
                        }));
                    }

                    console.log("✅ Adding Salesman:", salesman);

                    salesmanDocuments.push(salesman);
                }
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
        const employeesFromOrangeHRM = await getAllEmployees();
        const employeesFromOdoo = await getAllEmployeesFromOdoo();
        const employees = [...employeesFromOrangeHRM, ...employeesFromOdoo];

        for (const employee of employees) {
            const existingUser = await db.collection('users').findOne({
                username: employee.code.toString()
            });

            if (!existingUser) {
                const user = new User(
                    employee.code.toString(),
                    employee.firstName,
                    employee.lastName,
                    '',
                    'password',
                    false,
                    employee.unit 
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

