const ApprovalStatus = require('../models/Approval-status');

/**
 * inserts a new salesman into database
 * @param db target database
 * @param {Salesman} salesman new salesman
 * @return {Promise<any>}
 */

exports.add = async function (db, salesman) {
    return (await db.collection('salesmen').insertOne(salesman));
}

/**
 * retrieves a salesman by its sid
 * @param db target database
 * @param {string} id salesman ID
 * @return {Promise<any>}
 */

exports.getBySid = async function (db, sid) {
    return (await db.collection('salesmen').findOne({ sid: sid }));
}

/**
 * retrieves all salesmen
 * @param db target database
 * @return {Promise<any>}
 */

exports.getAll = async function (db) {
    return (await db.collection('salesmen').find().toArray());
}

/**
 * retrieves all salesmen who hava an unnapproved performance record
 * @param db target database
 * @return {Promise<any>}
 */

exports.getAllUnapprovedRecords = async function (db) {
    return await db.collection('salesmen').aggregate([

        { $unwind: "$performance" },


        { $match: { "performance.approvalStatus": ApprovalStatus.Waiting } },


        {
            $project: {
                _id: 0,
                firstname: 1,
                lastname: 1,
                sid: 1,
                department: 1,
                year: "$performance.year",
            }
        }
    ]).toArray();
};



/**
 * deletes a salesman by its sid
 * @param db target database
 * @param {string} id salesman sid
 * @return {Promise<any>}
 */

exports.delete = async function (db, sid) {
    return (await db.collection('salesmen').deleteOne({sid: sid}));
}

/**
 * adds a performance record to a salesman
 * @param db target database
 * @param {string} sid salesman sid
 * @param {PerformanceRecord} record performance record
 * @return {Promise<any>}
 */

exports.addPerformanceRecord = async function (db, sid, record) {
    return (await db.collection('salesmen').updateOne({sid: sid}, {$push: {performance: record}}));
}

/**
 * retrieves all performance records of a salesman
 * @param db target database
 * @param {string} sid salesman sid
 * @return {Promise<any>}
 */

exports.getPerformanceRecords = async function (db, sid) {
    return await db.collection('salesmen').aggregate([
        { $match: { sid: sid } },
        { $unwind: "$performance" },
        {
            $project: {
                _id: 0,
                sid: 1,
                firstname: 1,
                lastname: 1,
                department: 1,
                performance: 1,
                year: "$performance.year"
            }
        }
    ]).toArray();
};



/**
 * retrieves all performance records of a salesman which are approved by CEO and Employee
 * @param db
 * @param sid
 * @returns {Promise<*>}
 */

exports.getApprovedPerformanceRecords = async function (db, sid) {
    return await db.collection('salesmen').aggregate([
        { $unwind: "$performance" },

        {
            $match: {
                sid: sid,
                "performance.approvalStatus": {
                    $in: [ApprovalStatus.Approved, ApprovalStatus.ApprovedByEmployee]
                }
            }
        },

        {
            $project: {
                _id: 0,
                firstname: 1,
                lastname: 1,
                sid: 1,
                department: 1,
                year: "$performance.year",
            }
        }
    ]).toArray();
};




/**
 * retrieves a performance record of a salesman by year
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @return {Promise<any>}
 */

exports.getPerformanceRecordByYear = async function (db, sid, year) {
    const result = await db.collection('salesmen').findOne(
        { sid: sid, 'performance.year': year },
        { projection: { performance: { $elemMatch: { year: year } } } }
    );

    return result?.performance?.[0] || null;
};

/**
 * updates a performance record of a salesman with CEO approval and remark
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @param {string} approvalStatus CEO approval
 * @param {string} remark remark
 */

exports.approvePerformanceRecord = async function (db, sid, year, approvalStatus, remark) {
    return (await db.collection('salesmen').updateOne(
        { sid: sid, 'performance.year': year },
        {
            $set: {
                'performance.$.approvalStatus': approvalStatus,
                'performance.$.remark': remark
            }
        }
    ));
};


/**
 * deletes a performance record of a salesman by year
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @return {Promise<any>}
 */

exports.deletePerformanceRecord = async function (db, sid, year) {
    return (await db.collection('salesmen').updateOne({sid: sid}, {$pull: {performance: {year: year}}}));
}
