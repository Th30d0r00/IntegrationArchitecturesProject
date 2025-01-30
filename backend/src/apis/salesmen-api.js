const salesmenService = require('../services/salesmen-service')
const Salesman = require("../models/Salesman");
const PerformanceRecord = require("../models/PerformanceRecord");
const {calculateBonus} = require("../services/bonus-service");


/**
 * Endpoint, which creates a new salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.createSalesman = async function (req, res) {
    const db = req.app.get('db');
    const { code, sid, firstname, lastname, jobTitle, department, supervisor } = req.body;

    const newSalesman = new Salesman(code, sid, firstname, lastname, jobTitle, department, supervisor);

    try {
        await salesmenService.add(db, newSalesman);
        res.status(201).json({ message: 'Salesman created', salesman: newSalesman });
    } catch (err) {
        console.error('Error creating salesman:', err);
        res.status(500).json({ message: 'Failed to create salesman', error: err.message });
    }
};

/**
 * Endpoint, which retrieves a specific salesman by sid
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getSalesmanBySid = async function (req, res) {

    try {
        const db = req.app.get('db');
        const sid = parseInt(req.params.sid, 10);
        const salesman = await salesmenService.getBySid(db, sid);

        if (salesman) {
            res.json(salesman);
        } else {
            res.status(404).json({ message: 'Salesman not found' });
        }
    } catch (err) {
        console.error('Error retrieving salesman:', err);
        res.status(500).json({ message: 'Failed to retrieve salesman', error: err.message });
    }
};

/**
 * Endpoint, which retrieves a list of all salesmen
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getAllSalesmen = async function (req, res) {

    try {
        const db = req.app.get('db');
        const salesmen = await salesmenService.getAll(db);

        if (salesmen) {
            res.json(salesmen);
        } else {
            res.status(404).json({ message: 'No salesmen found' });
        }
    } catch (err) {
        console.error('Error retrieving salesmen:', err);
        res.status(500).json({message: 'Failed to retrieve salesmen', error: err.message});
    }
};

/**
 * Endpoint, which deletes a specific salesman by ID
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.deleteSalesman = async function (req, res) {
    try {
        const db = req.app.get('db');
        const sid = parseInt(req.params.sid, 10);
        const result = await salesmenService.delete(db, sid);

        if (result.deletedCount > 0) {
            res.json({ message: 'Salesman deleted' });
        } else {
            res.status(404).json({ message: 'Salesman not found' });
        }
    } catch (err) {
        console.error('Error deleting salesman:', err);
        res.status(500).json({ message: 'Failed to delete salesman', error: err.message });
    }
};

/**
 * Endpoint, which adds a performance record for a specific salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.addPerformanceRecord = async function (req, res) {
    try {
        const db = req.app.get('db');
        const { year, competences } = req.body;
        const sid = parseInt(req.params.sid);


        const { totalBonus, competences: updatedCompetences } = calculateBonus(competences);

        const record = new PerformanceRecord(sid, year, totalBonus, updatedCompetences, false);

        console.log("PerformanceRecord with calculated Bonus:", record);

        await salesmenService.addPerformanceRecord(db, sid, record);
        res.status(201).json({ message: 'Performance record added', record });
    } catch (err) {
        console.error('Error adding performance record:', err);
        res.status(500).json({ message: 'Failed to add performance record', error: err.message });
    }
};

/**
 * Endpoint, which retrieves all performance records for a specific salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getPerformanceRecordsBySalesmanId = async function (req, res) {
    const db = req.app.get('db');
    const sid = parseInt(req.params.sid, 10);

    try {
        const performanceRecords = await salesmenService.getPerformanceRecords(db, sid);

        if (performanceRecords) {
            res.json(performanceRecords);
        } else {
            res.status(404).json({ message: 'No performance records found' });
        }
    } catch (err) {
        console.error('Error retrieving performance records:', err);
        res.status(500).json({ message: 'Failed to retrieve performance records', error: err.message });
    }
};

/**
 * Endpoint, which retrieves a specific performance record by year for a salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getPerformanceRecordByYear = async function (req, res) {
    const db = req.app.get('db');
    const sid = parseInt(req.params.sid, 10);

    try {
        const record = await salesmenService.getPerformanceRecordByYear(db, sid, parseInt(req.params.year, 10));

        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Performance record not found' });
        }
    } catch (err) {
        console.error('Error retrieving performance record:', err);
        res.status(500).json({ message: 'Failed to retrieve performance record', error: err.message });
    }
};

/**
 * Endpoint which retrieves all salesman who have unapproved performance records
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */

exports.getSalesmenWithUnapprovedPerformanceRecords = async function (req, res) {
    const db = req.app.get('db');
    console.log("getSalesmenWithUnapprovedPerformanceRecords");

    try {
        const salesmen = await salesmenService.getAllUnapprovedRecords(db);

        if (salesmen) {
            res.json(salesmen);
        } else {
            res.status(404).json({ message: 'No salesmen found' });
        }
    } catch (err) {
        console.error('Error retrieving salesmen:', err);
        res.status(500).json({ message: 'Failed to retrieve salesmen', error: err.message });
    }
}

/**
 * Endpoint, which deletes a specific performance record by year for a salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.deletePerformanceRecord = async function (req, res) {
    const db = req.app.get('db');
    const sid = parseInt(req.params.sid, 10);

    try {
        const result = await salesmenService.deletePerformanceRecord(db, sid, parseInt(req.params.year, 10));

        if (result.modifiedCount > 0) {
            res.json({ message: 'Performance record deleted' });
        } else {
            res.status(404).json({ message: 'Performance record not found' });
        }
    } catch (err) {
        console.error('Error deleting performance record:', err);
        res.status(500).json({ message: 'Failed to delete performance record', error: err.message });
    }
};
