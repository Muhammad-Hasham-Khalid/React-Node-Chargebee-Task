const express = require('express');
const controllers = require('../../controllers/chargebee.controller');

const router = express.Router();

router.route('/').get(controllers.getAllCustomers);

module.exports = router;
