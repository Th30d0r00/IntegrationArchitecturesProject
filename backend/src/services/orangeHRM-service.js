// src/services/orangeHRM-service.js
const axios = require('axios');
const { getAccessToken } = require('./token-service');

const baseURL = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';

async function getAllEmployees() {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.get(`${baseURL}/api/v1/employee/search`, config);
        const employees = response.data?.data || [];

        if (!Array.isArray(employees)) {
            throw new Error('API response does not contain an array of employees.');
        }

        return employees.map(employee => ({
            code: employee.code || 'Unknown',
            employeeId: employee.employeeId || 'Unknown',
            firstName: employee.firstName || 'Unknown',
            lastName: employee.lastName || 'Unknown',
            jobTitle: employee.jobTitle || 'Unknown',
            unit: employee.unit || 'Unknown',
            supervisor: employee.supervisor || 'Unknown',
        }));

    } catch (error) {
        console.error('Error fetching all employees:', error.message);
        throw new Error(`Failed to fetch employees: ${error.message}`);
    }
}

async function getEmployeeById(sid) {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.get(`${baseURL}/api/v1/employee/${sid}`, config);
        const employeeData = response.data?.data;

        if (!employeeData) {
            throw new Error(`Employee with SID ${sid} not found`);
        }

        return {
            code: employeeData.code || 'Unknown',
            employeeId: employeeData.employeeId || 'Unknown',
            firstName: employeeData.firstName || 'Unknown',
            lastName: employeeData.lastName || 'Unknown',
            jobTitle: employeeData.jobTitle || 'Unknown',
            unit: employeeData.unit || 'Unknown',
            supervisor: employeeData.supervisor || 'Unknown',
        };

    } catch (error) {
        console.error(`Error fetching employee with SID ${sid}:`, error.message);
        throw new Error(`Failed to fetch employee ${sid}: ${error.message}`);
    }
}

async function addBonus(sid, year, bonus) {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            }
        };
        console.log(sid, year, bonus);
        const body = {
            year: year,
            value: bonus,
        };
        const response = await axios.post(`${baseURL}/api/v1/employee/${sid}/bonussalary`, body, config);
        return response.data;
    } catch (error) {
        console.error('Error adding bonus:', error.message);
        throw new Error(`Failed to add bonus for employee ${sid}: ${error.message}`);
    }
}

async function getAllBonuses(sid) {
    try {
        const accessToken = await getAccessToken();
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.get(`${baseURL}/api/v1/employee/${sid}/bonussalary`, config);

        if (response.data?.error?.status === "404" && response.data?.error?.text === "No Bonussalary Found") {
            console.log(`No bonuses found for employee with SID ${sid}`);
            return [];
        }

        return response.data;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error(`No bonuses found for employee with SID ${sid}`);
            return [];
        }

        console.error('Error fetching bonuses:', error.message);
        throw new Error(`Failed to fetch bonuses for employee ${sid}: ${error.message}`);
    }
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    addBonus,
    getAllBonuses,
};
