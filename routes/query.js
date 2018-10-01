'use strict';

const express = require('express');
const router = express.Router();
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

router.get('/:ip?/:port?/:auto?/:time?', (req, res) => {
	if (req.params.ip && req.params.port) {
		gamedig.query(
			{
				host: req.params.ip,
				port: req.params.port,
				type: 'protocol-valve'
			},
			(e, state) => {
				if (state === null) {
					res.render('customerror', {
						docs: 'query',
						error: `No Server was found at the address: ${req.params.ip}:${req.params.port}`,
						title: `No server. Perhaps it's offline?`
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
						ip: req.params.ip,
						playercount: players.length,
						players,
						port: req.params.port,
						time: parseInt(req.params.time) ? parseInt(req.params.time) < 10 ? 10 : parseInt(req.params.time) : 10,
						title: state.name
					});
				}
			}
		);
	} else {
		res.render('customerror', {
			docs: 'query',
			error: `Please specify both the IP and PORT`,
			title: `No IP/PORT`
		});
	}

});

module.exports = router;
