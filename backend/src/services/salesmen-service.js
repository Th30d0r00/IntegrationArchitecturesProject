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
    return (await db.collection('salesmen').findOne({sid: sid}, {projection: {performance: 1}}));
}

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
 * deletes a performance record of a salesman by year
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @return {Promise<any>}
 */

exports.deletePerformanceRecord = async function (db, sid, year) {
    return (await db.collection('salesmen').updateOne({sid: sid}, {$pull: {performance: {year: year}}}));
}
