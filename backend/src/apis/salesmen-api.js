const salesmenService = require("../services/salesmen-service");
const Salesman = require("../models/Salesman");
const PerformanceRecord = require("../models/PerformanceRecord");
const {
  calculateBonusPartA,
  calculateBonusPartB,
} = require("../services/bonus-service");
const { Waiting } = require("../models/Approval-status");

/**
 * Endpoint, which creates a new salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.createSalesman = async function (req, res) {
  const db = req.app.get("db");
  const { code, sid, firstname, lastname, jobTitle, department, supervisor } =
    req.body;

  const newSalesman = new Salesman(
    code,
    sid,
    firstname,
    lastname,
    jobTitle,
    department,
    supervisor
  );

  try {
    await salesmenService.add(db, newSalesman);
    res
      .status(201)
      .json({ message: "Salesman created", salesman: newSalesman });
  } catch (err) {
    console.error("Error creating salesman:", err);
    res
      .status(500)
      .json({ message: "Failed to create salesman", error: err.message });
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
    const db = req.app.get("db");
    const sid = parseInt(req.params.sid, 10);
    const salesman = await salesmenService.getBySid(db, sid);

    if (salesman) {
      res.json(salesman);
    } else {
      res.status(404).json({ message: "Salesman not found" });
    }
  } catch (err) {
    console.error("Error retrieving salesman:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve salesman", error: err.message });
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
    const db = req.app.get("db");
    const salesmen = await salesmenService.getAll(db);

    if (salesmen) {
      res.json(salesmen);
    } else {
      res.status(404).json({ message: "No salesmen found" });
    }
  } catch (err) {
    console.error("Error retrieving salesmen:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve salesmen", error: err.message });
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
    const db = req.app.get("db");
    const sid = parseInt(req.params.sid, 10);
    const result = await salesmenService.delete(db, sid);

    if (result.deletedCount > 0) {
      res.json({ message: "Salesman deleted" });
    } else {
      res.status(404).json({ message: "Salesman not found" });
    }
  } catch (err) {
    console.error("Error deleting salesman:", err);
    res
      .status(500)
      .json({ message: "Failed to delete salesman", error: err.message });
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
    const db = req.app.get("db");
    const { year, competences, productSales } = req.body;
    const sid = parseInt(req.params.sid);

    if (
      await salesmenService.checkForExistingPerformanceRecord(db, sid, year)
    ) {
      res.status(409).json({
        message: "Performance record for this person and year already exists",
      });
      return;
    }

    const { bonusA, productSales: updatedProductSales } =
      calculateBonusPartA(productSales);

    console.log("BonusA:", bonusA);

    const { bonusB, competences: updatedCompetences } =
      calculateBonusPartB(competences);

    console.log("BonusB:", bonusB);

    const totalBonus = bonusA + bonusB;

    const record = new PerformanceRecord(
      sid,
      year,
      bonusA,
      bonusB,
      totalBonus,
      updatedProductSales,
      updatedCompetences,
      Waiting
    );

    console.log("PerformanceRecord with calculated Bonus:", record);

    await salesmenService.addPerformanceRecord(db, sid, record);
    res.status(201).json({ message: "Performance record added", record });
  } catch (err) {
    console.error("Error adding performance record:", err);
    res.status(500).json({
      message: "Failed to add performance record",
      error: err.message,
    });
  }
};

exports.updatePerformanceRecord = async function (req, res) {
    try {
        const db = req.app.get("db");
        const { year, competences, productSales, bonusA } = req.body;

        const sid = parseInt(req.params.sid);

        const { bonusB, competences: updatedCompetences } =
        calculateBonusPartB(competences);

        const totalBonus = bonusA + bonusB;

        const record = new PerformanceRecord(
        sid,
        year,
        bonusA,
        bonusB,
        totalBonus,
        productSales,
        updatedCompetences,
        Waiting
        );

        console.log("PerformanceRecord with calculated Bonus:", record);

        await salesmenService.updatePerformanceRecord(db, sid, record);
        res.status(201).json({ message: "Performance record updated", record });
    } catch (err) {
        console.error("Error updating performance record:", err);
        res.status(500).json({
        message: "Failed to update performance record",
        error: err.message,
        });
    }
}

/**
 * Endpoint, which retrieves all performance records for a specific salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getPerformanceRecordsBySalesmanId = async function (req, res) {
  const db = req.app.get("db");
  const sid = parseInt(req.params.sid, 10);

  try {
    const performanceRecords = await salesmenService.getPerformanceRecords(
      db,
      sid
    );

    if (performanceRecords) {
      res.json(performanceRecords);
    } else {
      res.status(404).json({ message: "No performance records found" });
    }
  } catch (err) {
    console.error("Error retrieving performance records:", err);
    res.status(500).json({
      message: "Failed to retrieve performance records",
      error: err.message,
    });
  }
};

exports.getApprovedPerformanceRecordsBySalesmanId = async function (req, res) {
  const db = req.app.get("db");
  const sid = parseInt(req.params.sid, 10);

  try {
    const performanceRecords =
      await salesmenService.getApprovedPerformanceRecords(db, sid);
    console.log(performanceRecords);

    if (performanceRecords) {
      res.json(performanceRecords);
    } else {
      res.status(404).json({ message: "No performance records found" });
    }
  } catch (err) {
    console.error("Error retrieving performance records:", err);
    res.status(500).json({
      message: "Failed to retrieve performance records",
      error: err.message,
    });
  }
};

/**
 * Endpoint, which retrieves a specific performance record by year for a salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getPerformanceRecordByYear = async function (req, res) {
  const db = req.app.get("db");
  const sid = parseInt(req.params.sid, 10);

  try {
    const record = await salesmenService.getPerformanceRecordByYear(
      db,
      sid,
      parseInt(req.params.year, 10)
    );

    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: "Performance record not found" });
    }
  } catch (err) {
    console.error("Error retrieving performance record:", err);
    res.status(500).json({
      message: "Failed to retrieve performance record",
      error: err.message,
    });
  }
};

/**
 * Endpoint which retrieves all salesman who have unapproved performance records
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */

exports.getSalesmenWithUnapprovedPerformanceRecords = async function (
  req,
  res
) {
  const db = req.app.get("db");
  console.log("getSalesmenWithUnapprovedPerformanceRecords");

  try {
    const salesmen = await salesmenService.getAllUnapprovedRecords(db);

    if (salesmen) {
      res.json(salesmen);
    } else {
      res.status(404).json({ message: "No salesmen found" });
    }
  } catch (err) {
    console.error("Error retrieving salesmen:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve salesmen", error: err.message });
  }
};

/**
 * Endpoint which updates the approval Status of a performance record for a specific salesman with remarks
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */

exports.updateApprovalStatusPerformanceRecord = async function (req, res) {
  const db = req.app.get("db");
  const sid = parseInt(req.params.sid, 10);
  const year = parseInt(req.params.year, 10);
  const { approvalStatus, remark } = req.body;

  console.log(req.body);
  console.log("Approval Status:", approvalStatus);

  try {
    const result = await salesmenService.updateApprovalStatusPerformanceRecord(
      db,
      sid,
      year,
      approvalStatus,
      remark
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Performance record updated" });
    } else {
      res.status(404).json({ message: "Performance record not found" });
    }
  } catch (err) {
    console.error("Error updating performance record:", err);
    res.status(500).json({
      message: "Failed to update performance record",
      error: err.message,
    });
  }
};

/**
 * Endpoint, which deletes a specific performance record by year for a salesman
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.deletePerformanceRecord = async function (req, res) {
  const db = req.app.get("db");
  const sid = parseInt(req.params.sid, 10);

  try {
    const result = await salesmenService.deletePerformanceRecord(
      db,
      sid,
      parseInt(req.params.year, 10)
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Performance record deleted" });
    } else {
      res.status(404).json({ message: "Performance record not found" });
    }
  } catch (err) {
    console.error("Error deleting performance record:", err);
    res.status(500).json({
      message: "Failed to delete performance record",
      error: err.message,
    });
  }
};

/**
 * Endpoint, which returns the bonus distribution
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getBonusDistribution = async (req, res) => {
  const db = req.app.get("db");
  try {
    const distribution = await salesmenService.getBonusDistribution(db);
    res.status(200).json(distribution);
  } catch (err) {
    console.error("Error getting bonus distribution:", err);
    res.status(500).json({
      message: "Failed to get bonus distribution",
      error: err.message,
    });
  }
};

/**
 * Endpoint, which returns the yearly bonus statistics
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.getYearlyBonusStats = async (req, res) => {
  const db = req.app.get("db");
  try {
    const stats = await salesmenService.getYearlyBonusStats(db);
    res.status(200).json(stats);
  } catch (err) {
    console.error("Error getting yearly bonus stats:", err);
    res.status(500).json({
      message: "Failed to get yearly bonus statistics",
      error: err.message,
    });
  }
};
