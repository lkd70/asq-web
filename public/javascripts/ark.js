  function battleMetrics(map, name) {
    $.get("https://api.battlemetrics.com/game-features/2e0790dc-d6f7-11e7-8461-b3f086e6eb8c/relationships/options", (features_list) => {
		const map_data = (features_list.data.filter((d) => {
			return d.attributes.display.split(' ').join('') === map;
		}));
		if (map_data.length != 1) {
			alert("Failed to find Battlemetrics server for the map: '"+ map +"'");
		} else {
			const url = "https://api.battlemetrics.com/servers?filter[game]=ark&filter[features][2e079b9a-d6f7-11e7-8461-83e84cedb373]=true&filter[features][2e0790dc-d6f7-11e7-8461-b3f086e6eb8c][and][]=" + urlify_string(map_data[0].id) + "&filter[search]=" + urlify_string(name);
			$.get(url, (servers) => {
				servers = servers.data.filter((server) => server.attributes.name === name)
				if (servers.length < 1) {
					alert("Failed to find the server... Perhaps you'd do this better yourself..? https://battlemetrics.com");
				} else {
					window.open("https://www.battlemetrics.com/servers/ark/" + servers[0].attributes.id)
				}
			}).fail(() => alert("Failed to load battlemetrics API call. That's odd..."));
		}
	}).fail(() => alert("Failed to load battlemetrics. Perhaps you have something like uMatrix blocking external sites?"));
  }

function urlify_string(url) {
    return url == undefined ? '' : url.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

function notify(server, count) {
	if (typeof $.cookie('player-count') !== 'undefined') {
		if ($.cookie('player-count').toString() !== count.toString()) {
			if (!Notification) {
				alert('Desktop notifications aren\'t supported by your browser. Try update to a less useless one.');
			} else {
				if (Notification.permission !== "granted") {
					Notification.requestPermission();
				} else {
					var notification = new Notification(server, {
						icon: 'https://survivetheark.com/uploads/monthly_2018_08/favicon.ico.96ba876d97379717b78915b29aaf8936.ico',
						body: 'Player count has changed to: ' + count
					})
					$.cookie('player-count', count, {expires: 1});
				}
			}
		}
	}
}

function enableNotify(count) {
	if (typeof $.cookie('player-count') === 'undefined') {
		$.cookie('player-count', count, {expires: 1});
	} else {
		$.cookie('player-count', null);
	}
}
