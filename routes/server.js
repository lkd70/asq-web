'use strict';

const express = require('express');
const router = express.Router();
const config = require('../public/config.json');
const gamedig = require('gamedig');

const fmtMSS = (s) =>
	(s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;

router.get('/:id?/:auto?/:time?', (req, res) => {
	if (req.params.id in config.servers) {
		gamedig.query(
			{
				host: config.servers[req.params.id].ip,
				port: config.servers[req.params.id].port,
				type: 'protocol-valve'
			},
			(e, state) => {
				if (state === null) {
					res.render('noserver', {
						error: `No Server`,
						title: `No server was found. Perhaps it's offline?`
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
						title: config.servers[req.params.id].prettyname
					});
				}
			}
		);
	} else {
		res.render('noserver', {
			error: `Server ID not found in the config.`,
			title: `Wrong Server ID`
		});
	}
});

module.exports = router;
