'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { title: `LKD70's Ark Server Query` });
});

module.exports = router;
