'use strict';

const express = require('express');
const router = express.Router();
const config = require('../public/servers.json');
const gamedig = require('gamedig');

const formatSeconds = (sec, and = true) => {
	sec = Number(sec);
	const d = Math.floor(sec / 86400);
	const h = Math.floor(sec % 86400 / 3600);
	const m = Math.floor(sec % 86400 % 3600 / 60);
	const s = Math.floor(sec % 86400 % 3600 % 60);

	return (d > 0 ? h + (h === 1 ? ' day' : ' days') : '') +
			(h > 0 ? (d ? ', ' : '') + h + (h === 1 ? ' hour' : ' hours') : '') +
			(m > 0 ? (h ? ', ' : '') + m + (m === 1 ? ' minute' : ' minutes') : '') +
			(s > 0 ? (m ? ', ' + (and ? 'and ' : '') : '') + s + (s === 1 ? ' second' : ' seconds') : '');
};

router.get('/:id?/:auto?/:time?', (req, res) => {
	if (req.params.id in config.servers) {
		gamedig.query(
			{
				host: config.servers[req.params.id].ip,
				port: config.servers[req.params.id].query_port,
				type: 'protocol-valve'
			},
			(e, state) => {
				if (state === null) {
					res.render('customerror', {
						docs: 'server',
						error: `No Server`,
						title: `No server was found. Perhaps it's offline?`
					});
				} else {
					const players = [];
					for (let s = 0; s < state.players.length; s++) {
						const player = state.players[s];
						if (typeof player.name !== 'undefined') {
							player.time = formatSeconds(Math.floor(player.time));
							players.push(player);
						}
					}

					res.render(req.query.json ? 'api/server' : 'server', {
						additional: state,
						auto: req.params.auto,
						playercount: players.length,
						players,
						time: parseInt(req.params.time) ? parseInt(req.params.time) < 10 ? 10 : parseInt(req.params.time) : 10,
						title: config.servers[req.params.id].pretty_name
					});
				}
			}
		);
	} else {
		res.render('customerror', {
			docs: 'server',
			error: `Server ID not found in the config.`,
			title: `Wrong Server ID`
		});
	}
});

module.exports = router;
