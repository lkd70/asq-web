'use strict';

const express = require('express');
const router = express.Router();
const gamedig = require('gamedig');

const fmtMSS = (s) =>
	(s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;

router.get('/:ip?/:port?/:auto?/:time?', (req, res) => {
	console.log(req.params);
	if (req.params.ip && req.params.port) {
		gamedig.query(
			{
				host: req.params.ip,
				port: req.params.port,
				type: 'protocol-valve'
			},
			(e, state) => {
				if (state === null) {
					res.render('noquery', {
						error: `No Server was found at the address: ${req.params.ip}:${req.params.port}`,
						title: `No server. Perhaps it's offline?`
					});
				} else {
					const players = [];
					for (let s = 0; s < state.players.length; s++) {
						const player = state.players[s];
						if (typeof player.name !== 'undefined') {
							player.time = fmtMSS(Math.floor(player.time));
							players.push(player);
						}
					}
					res.render(req.query.json ? 'api/server' : 'server', {
						auto: req.params.auto,
						playercount: players.length,
						players,
						time: parseInt(req.params.time) ? parseInt(req.params.time) < 10 ? 10 : parseInt(req.params.time) : 10,
						title: `${req.params.ip}:${req.params.port}`
					});
				}
			}
		);
	} else {
		res.render('noquery', {
			error: `Please specify both the IP and PORT`,
			title: `No IP/PORT`
		});
	}

});

module.exports = router;
