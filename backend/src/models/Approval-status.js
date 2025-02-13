const ApprovalStatus = Object.freeze({
    Waiting: 'Waiting for CEO Approval',
    ApprovedByCEO: 'CEO approved',
    ApprovedByEmployee: 'Employee approved',
    RejectedByCEO: 'CEO rejected',
    RejectedByEmployee: 'Employee Rejected'
});

module.exports = ApprovalStatus;