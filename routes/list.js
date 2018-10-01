'use strict';

const express = require('express');
const router = express.Router();
const config = require('../public/servers.json');

router.get('/', (req, res) => {
	if (Object.keys(config.servers).length) {
		res.render(req.query.json ? 'api/list' : 'list', {
			servers: config.servers
		});
	} else {
		res.render('customerror', {
			error: `It seems the server config is empty... This is a site side issue, sorry!`,
			title: `No Servers found`
		});
	}

});

module.exports = router;
