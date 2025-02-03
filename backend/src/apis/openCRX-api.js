const {fetchAllAccounts, getSalesOrders, getProductsBySalesOrderId, getProductNameById, getRatingsByAccount,
    getSalesOrdersByAccountAndYear
} = require('../services/openCRX-service');

exports.getAccounts = async function (req, res) {
    try {
        const accounts = await fetchAllAccounts();
        console.log('Accounts successfully retrieved:', accounts);
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Error fetching accounts' });
    }
}

exports.getSalesOrdersByUid = async function (req, res) {
    try {
        const salesOrders = await getSalesOrders();
        console.log('Sales Orders successfully retrieved:', salesOrders);
        res.status(200).json(salesOrders);
    } catch (error) {
        console.error('Error fetching sales orders:', error);
        res.status(500).json({ message: 'Error fetching sales orders' });
    }
}

exports.getProductBySalesOrderId = async function (req, res) {
    try {
        const products = await getProductsBySalesOrderId(req.params.uid);
        console.log('Products successfully retrieved:', products);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
}

exports.getProductNameById = async function (req, res) {
    try {
        const productName = await getProductNameById(req.params.uid);
        console.log('Product name successfully retrieved:', productName);
        res.status(200).json(productName);
    } catch (error) {
        console.error('Error fetching product name:', error);
        res.status(500).json({ message: 'Error fetching product name' });
    }
}

exports.getRatingsByAccount = async function (req, res) {
    try {
        const rating = await getRatingsByAccount(req.params.uid);
        console.log('Rating successfully retrieved:', rating);
        res.status(200).json(rating);
    } catch (error) {
        console.error('Error fetching rating:', error);
        res.status(500).json({ message: 'Error fetching rating' });
    }
}

exports.getSalesOrdersByAccountAndYear = async function (req, res) {
    try {
        const salesOrders = await getSalesOrdersByAccountAndYear(req.params.governmentId, req.params.year);
        console.log('Sales Orders successfully retrieved:', salesOrders);
        res.status(200).json(salesOrders);
    } catch (error) {
        console.error('Error fetching sales orders:', error);
        res.status(500).json({ message: 'Error fetching sales orders' });
    }
}