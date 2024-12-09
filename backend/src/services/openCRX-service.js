const axios = require('axios');

const baseURL = 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX';
const credentials = {
    username: 'guest',
    password: 'guest'
};
const config = {
    headers: { 'Accept': 'application/json' },
    auth: credentials
};

async function fetchAllAccounts() {
    try {
        const response = await axios.get(`${baseURL}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account`, config);
        const accounts = response.data.objects || [];

        return accounts.map(account => {
            const name = account.fullName || 'Unknown';
            const jobRole = account.jobRole || 'Unknown';
            const vcard = account.vcard || '';

            const uidMatch = vcard.match(/UID:([^\n]+)/);
            const uid = uidMatch ? uidMatch[1].trim() : 'UID nicht gefunden';

            return { name, jobRole, uid };
        });

    } catch (error) {
        console.error('Fehler beim Abrufen der Accounts:', error);
        throw error;
    }
}

async function getSalesOrders() {
    try {
        const response = await axios.get(`${baseURL}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder`, config);
        const salesOrders = response.data.objects || [];

        return salesOrders.map(salesOrder => {
            const fullIdentity = salesOrder.identity || 'Unknown';
            const identityParts = fullIdentity.split('/');
            const identity = identityParts[identityParts.length - 1] || 'Unknown';

            let customer = 'Unknown';
            if (salesOrder.customer && salesOrder.customer['@href']) {
                const url = salesOrder.customer['@href'];
                customer = url.split('/').pop() || 'Unknown';
            }

            let year = 'Unknown';
            if (salesOrder.activeOn) {
                const date = new Date(salesOrder.activeOn);
                year = date.getFullYear().toString(); // Jahr als String
            }

            const priority = salesOrder.priority || 'Unknown';

            let salesmanUid = 'Unknown';
            if (salesOrder.salesRep && salesOrder.salesRep['@href']) {
                const url = salesOrder.salesRep['@href'];
                salesmanUid = url.split('/').pop() || 'Unknown';
            }

            return { identity, year, customer, priority, salesmanUid };
        });
    } catch (error) {
        console.error('Error fetching sales orders:', error.message);
        throw new Error('Failed to fetch sales orders.');
    }
}

async function getProductsBySalesOrderId(salesOrderId) {
    try {
        console.log('Fetching products for sales order:', salesOrderId);

        const response = await axios.get(
            `${baseURL}/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${salesOrderId}/position`, config
        );

        console.log('Response:', response.data);

        const positions = response.data.objects || [];

        return positions.map(position => {
            // Identity extrahieren
            const identityFull = position.identity || 'Unknown';
            const identityParts = identityFull.split('/');
            const identity = identityParts[identityParts.length - 1] || 'Unknown';

            // Produkt-ID extrahieren
            let product = 'Unknown';
            if (position.product && position.product['@href']) {
                const url = position.product['@href'];
                const productId = url.split('/').pop();
                product = productId || 'Unknown';
            }

            // Zusätzliche Felder konvertieren
            const quantity = parseFloat(position.quantity || 0);
            const price = parseFloat(position.pricePerUnit || 0);
            const positionCount = parseInt(position.positionNumber || 0, 10);

            // Optional: Produktbeschreibung hinzufügen
            const productDescription = position.productDescription || 'No description available';

            return {
                identity,
                product,
                quantity,
                price,
                positionCount,
                productDescription, // Optional
            };
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw new Error('Failed to fetch products.');
    }
}

async function getProductNameById(id) {
    try {
        const products = await axios.get(
            `${baseURL}/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/${id}`,
            config
        );

        if (products && products.data && products.data.name) {
            return products.data.name;
        } else {
            console.log(`No Products for ${id} found.`);
            return "-";
        }
    } catch (error) {
        console.error('Error while loading products:', error.message);
        throw new Error('Failed to fetch products.');
    }
}

async function getRatingsByAccount(id) {
    try {
        const response = await axios.get(`${baseURL}/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${id}`, config);

        if (response && response.data) {
            return response.data.accountRating;
        } else {
            return 'No rating found';
        }

    } catch (error) {
        console.error('Error fetching ratings:', error.message);
        throw new Error('Failed to fetch ratings.');
    }
}

//Vielleicht nochmal überlegen welches Rating was bedeutet?
function mapRatingToMessage(rating) {
    switch (rating) {
        case 0:
            return 'not relevant';
        case 1:
            return 'excellent';
        case 2:
            return 'very good';
        case 3:
            return 'good';
        default:
            return 'unknown';
    }
}

module.exports = { fetchAllAccounts, getSalesOrders, getProductsBySalesOrderId, getProductNameById,getRatingsByAccount};
