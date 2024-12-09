// src/controllers/orangehrm-controller.js
const { getAllEmployees, getEmployeeById, getAllBonuses } = require('../services/orangehrm-service');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees' });
    }
};

exports.getEmployeeById = async (req, res) => {
    const { sid } = req.params;
    try {
        const employee = await getEmployeeById(sid);
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Error fetching employee' });
    }
};

exports.getAllBonuses = async (req, res) => {
    const { sid } = req.params;
    try {
        const bonuses = await getAllBonuses(sid);
        res.status(200).json(bonuses);
    } catch (error) {
        console.error('Error fetching bonuses:', error);
        res.status(500).json({ message: 'Error fetching bonuses' });
    }
};
