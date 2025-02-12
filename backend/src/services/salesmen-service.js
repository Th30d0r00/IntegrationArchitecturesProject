const ApprovalStatus = require("../models/Approval-status");

/**
 * inserts a new salesman into database
 * @param db target database
 * @param {Salesman} salesman new salesman
 * @return {Promise<any>}
 */

exports.add = async function (db, salesman) {
  return await db.collection("salesmen").insertOne(salesman);
};

/**
 * retrieves a salesman by its sid
 * @param db target database
 * @param {string} id salesman ID
 * @return {Promise<any>}
 */

exports.getBySid = async function (db, sid) {
  return await db.collection("salesmen").findOne({ sid: sid });
};

/**
 * retrieves all salesmen
 * @param db target database
 * @return {Promise<any>}
 */

exports.getAll = async function (db) {
  return await db.collection("salesmen").find().toArray();
};

/**
 * retrieves all salesmen who hava an unnapproved performance record
 * @param db target database
 * @return {Promise<any>}
 */

exports.getAllUnapprovedRecords = async function (db) {
  return await db
    .collection("salesmen")
    .aggregate([
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
        },
      },
    ])
    .toArray();
};

/**
 * deletes a salesman by its sid
 * @param db target database
 * @param {string} id salesman sid
 * @return {Promise<any>}
 */

exports.delete = async function (db, sid) {
  return await db.collection("salesmen").deleteOne({ sid: sid });
};

/**
 * adds a performance record to a salesman
 * @param db target database
 * @param {string} sid salesman sid
 * @param {PerformanceRecord} record performance record
 * @return {Promise<any>}
 */

exports.addPerformanceRecord = async function (db, sid, record) {
  return await db
    .collection("salesmen")
    .updateOne({ sid: sid }, { $push: { performance: record } });
};

exports.checkForExistingPerformanceRecord = async function (db, sid, year) {
  //return (await db.collection('salesmen').updateOne({sid: sid}, {$push: {performance: record}}));
  return (
    (await db
      .collection("salesmen")
      .findOne({ sid: sid, "performance.year": year })) !== null
  );
};

/**
 * retrieves all performance records of a salesman
 * @param db target database
 * @param {string} sid salesman sid
 * @return {Promise<any>}
 */

exports.getPerformanceRecords = async function (db, sid) {
  return await db
    .collection("salesmen")
    .aggregate([
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
          year: "$performance.year",
          approvalStatus: "$performance.approvalStatus"
        },
      },
    ])
    .toArray();
};

/**
 * retrieves all performance records of a salesman which are approved by CEO and Employee
 * @param db
 * @param sid
 * @returns {Promise<*>}
 */

exports.getApprovedPerformanceRecords = async function (db, sid) {
  return await db
    .collection("salesmen")
    .aggregate([
      { $unwind: "$performance" },

      {
        $match: {
          sid: sid,
          "performance.approvalStatus": {
            $in: [ApprovalStatus.Approved, ApprovalStatus.ApprovedByEmployee],
          },
        },
      },

      {
        $project: {
          _id: 0,
          firstname: 1,
          lastname: 1,
          sid: 1,
          department: 1,
          year: "$performance.year",
        },
      },
    ])
    .toArray();
};

/**
 * retrieves a performance record of a salesman by year
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @return {Promise<any>}
 */

exports.getPerformanceRecordByYear = async function (db, sid, year) {
  const result = await db
    .collection("salesmen")
    .findOne(
      { sid: sid, "performance.year": year },
      { projection: { performance: { $elemMatch: { year: year } } } }
    );

  return result?.performance?.[0] || null;
};

/**
 * updates a performance record of a salesman with the corresponding approval and remark
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @param {string} approvalStatus approval Status
 * @param {string} remark remark
 */

exports.updateApprovalStatusPerformanceRecord = async function (
  db,
  sid,
  year,
  approvalStatus,
  remark
) {
  return await db.collection("salesmen").updateOne(
    { sid: sid, "performance.year": year },
    {
      $set: {
        "performance.$.approvalStatus": approvalStatus,
        "performance.$.remark": remark,
      },
    }
  );
};

/**
 * deletes a performance record of a salesman by year
 * @param db target database
 * @param {string} sid salesman sid
 * @param {string} year year of the record
 * @return {Promise<any>}
 */

exports.deletePerformanceRecord = async function (db, sid, year) {
  return await db
    .collection("salesmen")
    .updateOne({ sid: sid }, { $pull: { performance: { year: year } } });
};

exports.getBonusDistribution = async function (db) {
  const result = await db
    .collection("salesmen")
    .aggregate([
      { $unwind: "$performance" },
      {
        $match: {
          "performance.approvalStatus": ApprovalStatus.Approved,
        },
      },
      {
        $bucket: {
          groupBy: "$performance.totalBonus",
          boundaries: [0, 500, 1000, 1500, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          range: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-500€" },
                { case: { $eq: ["$_id", 500] }, then: "501-1000€" },
                { case: { $eq: ["$_id", 1000] }, then: "1001-1500€" },
                { case: { $eq: ["$_id", 1500] }, then: "1500€+" },
              ],
            },
          },
          count: 1,
        },
      },
    ])
    .toArray();

  // Convert to object format needed by the chart
  const distribution = {};
  result.forEach((item) => {
    distribution[item.range] = item.count;
  });

  return distribution;
};

exports.getYearlyBonusStats = async function (db) {
  const result = await db
    .collection("salesmen")
    .aggregate([
      { $unwind: "$performance" },
      {
        $match: {
          "performance.approvalStatus": ApprovalStatus.Approved,
        },
      },
      {
        $group: {
          _id: "$performance.year",
          averageBonus: { $avg: "$performance.totalBonus" },
          totalCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          averageBonus: { $round: ["$averageBonus", 2] }
        }
      }
    ])
    .toArray();

  // Convert to format needed by the chart
  const stats = {};
  result.forEach(item => {
    stats[item.year] = {
      average: item.averageBonus
    };
  });

  return stats;
};
