const axios = require('axios');
const xml2js = require('xml2js');
const ApprovalStatus = require('../models/Approval-status');

const odooBaseURL = 'https://sepp-odoo.inf.h-brs.de';
const apiKey = 'dabacfdf8afdd4bb70c0e199a1e4f6e035e36576';
const userId = 6;

async function getAllEmployeesFromOdoo() {
    try {
        const xmlRequest = `<?xml version="1.0"?>
        <methodCall>
            <methodName>execute_kw</methodName>
            <params>
                <param>
                    <value><string>sepp-odoo</string></value>
                </param>
                <param>
                    <value><int>${userId}</int></value>
                </param>
                <param>
                    <value><string>${apiKey}</string></value>
                </param>
                <param>
                    <value><string>hr.employee</string></value>
                </param>
                <param>
                    <value><string>search_read</string></value>
                </param>
                <param>
                    <value>
                        <array>
                            <data>
                                <value>
                                    <array>
                                        <data>
                                            <value>
                                                <array>
                                                    <data>
                                                        <value><string>department_id</string></value>
                                                        <value><string>=</string></value>
                                                        <value><int>2</int></value>
                                                    </data>
                                                </array>
                                            </value>
                                        </data>
                                    </array>
                                </value>
                            </data>
                        </array>
                    </value>
                </param>
                <param>
                    <value>
                        <struct>
                            <member>
                                <name>fields</name>
                                <value>
                                    <array>
                                        <data>
                                            <value><string>name</string></value>
                                            <value><string>job_id</string></value>
                                            <value><string>department_id</string></value>
                                        </data>
                                    </array>
                                </value>
                            </member>
                        </struct>
                    </value>
                </param>
            </params>
        </methodCall>`;

        const config = {
            headers: {
                'Content-Type': 'text/xml',
            }
        };

        const response = await axios.post(`${odooBaseURL}/xmlrpc/2/object`, xmlRequest, config);
        const parsedResponse = await xml2js.parseStringPromise(response.data);

        if (!parsedResponse || !parsedResponse.methodResponse) {
            throw new Error('Invalid Odoo XML response');
        }

        const employees = parsedResponse.methodResponse.params[0].param[0].value[0].array[0].data[0].value.map(emp => {
            const fullName = emp.struct[0].member.find(m => m.name[0] === 'name').value[0].string[0] || 'Unknown Unknown';
            const [firstName, ...lastNameParts] = fullName.split(' ');
            const lastName = lastNameParts.join(' ') || 'Unknown';

            return {
                code: `187${emp.struct[0].member.find(m => m.name[0] === 'id').value[0].int[0] || 'Unknown'}`,
                employeeId: `187${emp.struct[0].member.find(m => m.name[0] === 'id').value[0].int[0] || 'Unknown'}`,
                firstName: firstName,
                lastName: lastName,
                jobTitle: emp.struct[0].member.find(m => m.name[0] === 'job_id').value[0].array[0].data[0].value[1].string[0] || 'Unknown',
                unit: emp.struct[0].member.find(m => m.name[0] === 'department_id').value[0].array[0].data[0].value[1].string[0] || 'Unknown',
                supervisor: 'Unknown', 
            };
        });

        return employees;
    } catch (error) {
        console.error('Error fetching employees from Odoo:', error.message);
        throw new Error(`Failed to fetch employees from Odoo: ${error.message}`);
    }
}

async function getBonusesFromOdoo() {
    try {
        const xmlRequest = `<?xml version="1.0"?>
        <methodCall>
            <methodName>execute_kw</methodName>
            <params>
                <param>
                    <value><string>sepp-odoo</string></value>
                </param>
                <param>
                    <value><int>${userId}</int></value>
                </param>
                <param>
                    <value><string>${apiKey}</string></value>
                </param>
                <param>
                    <value><string>bonus.request</string></value>
                </param>
                <param>
                    <value><string>search_read</string></value>
                </param>
                <param>
                    <value>
                        <array>
                            <data>
                                <!-- No filter, fetch all bonuses -->
                            </data>
                        </array>
                    </value>
                </param>
                <param>
                    <value>
                        <struct>
                            <member>
                                <name>fields</name>
                                <value>
                                    <array>
                                        <data>
                                            <value><string>bonus_amount</string></value>
                                            <value><string>employee_id</string></value>
                                            <value><string>bonus_reason_id</string></value>
                                            <value><string>state</string></value>
                                        </data>
                                    </array>
                                </value>
                            </member>
                        </struct>
                    </value>
                </param>
            </params>
        </methodCall>`;

        const config = {
            headers: { 'Content-Type': 'text/xml' }
        };

        const response = await axios.post(`${odooBaseURL}/xmlrpc/2/object`, xmlRequest, config);
        const parsedResponse = await xml2js.parseStringPromise(response.data);

        if (!parsedResponse || !parsedResponse.methodResponse) {
            throw new Error('Invalid Odoo XML response');
        }

        // Extract bonuses
        const bonuses = parsedResponse.methodResponse.params[0].param[0].value[0].array[0].data[0].value.map(bonus => {
            const employeeId = parseInt(bonus.struct[0].member.find(m => m.name[0] === 'employee_id').value[0].array[0].data[0].value[0].int[0], 10);
            const formattedEmployeeId = employeeId ? `187${employeeId}` : null;

            const bonusAmount = parseFloat(bonus.struct[0].member.find(m => m.name[0] === 'bonus_amount').value[0].double[0]) || 0;
            const bonusReason = bonus.struct[0].member.find(m => m.name[0] === 'bonus_reason_id').value[0].array[0].data[0].value[1].string[0] || 'Unknown';
            const state = bonus.struct[0].member.find(m => m.name[0] === 'state').value[0].string[0] || 'unknown';

            // Determine approval status
            let approvalStatus = state.includes("manager_approved") ? ApprovalStatus.ApprovedByCEO : ApprovalStatus.Waiting;

            // Extract the year from the bonus reason (assume format contains YYYY somewhere)
            const yearMatch = bonusReason.match(/\b(19|20)\d{2}\b/);
            const year = yearMatch ? parseInt(yearMatch[0], 10) : null;

            return {
                employeeId: formattedEmployeeId,
                totalBonus: bonusAmount,
                year,
                approvalStatus
            };
        });

        console.log('Bonuses:', bonuses);
        return bonuses;
    } catch (error) {
        console.error('Error fetching bonuses from Odoo:', error.message);
        throw new Error(`Failed to fetch bonuses from Odoo: ${error.message}`);
    }
}

module.exports = {
    getAllEmployeesFromOdoo,
    getBonusesFromOdoo
};