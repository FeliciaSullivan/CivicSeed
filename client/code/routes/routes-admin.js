var self = module.exports = {

	loadRoutes: function ($app) {

		require('/admin').init();
		var npcs = require('/npcs');
		npcs.init();

		$app.get('/admin', function (req) {
			$CONTAINER.append(JT['admin-panel']({
				environment: CivicSeed.ENVIRONMENT,
				message: 'User admin panel.'
			}));
			$CONTAINER.addClass('admin-container')
			$('title').text('{ ::: Civic Seed - Admin Panel ::: }');
		});

		$app.get('/admin/startup', function (req) {
			$CONTAINER.append(JT['admin-startup']({
				title: 'Startup',
				// bodyClass: 'admin startup',
				environment: CivicSeed.ENVIRONMENT,
				// consoleOutput: consoleOutput,
				message: 'Startup admin panel.'
			}));
			$CONTAINER.addClass('admin-container')
			$('title').text('{ ::: Civic Seed - Admin Panel - Startup ::: }');
		});

		$app.get('/admin/monitor', function (req) {
			ss.rpc('admin.monitor.getInstanceNames', sessionStorage.userId, function(err, info) {
				if(err) {
					apprise(err);
				} else {
					$CONTAINER.append(JT['admin-monitor']({
						environment: CivicSeed.ENVIRONMENT,
						instances: info
					}));
					$CONTAINER.addClass('admin-container')
					$('title').text('{ ::: Civic Seed - Admin Panel - Monitor ::: }');
				}
			});
		});

		$app.get('/admin/npcs', function (req) {
			ss.rpc('admin.npcs.init', sessionStorage.userId, function(result) {
				if(result) {
					//modify results for data output
					for(var r = 0; r < result.length; r++) {
						var x = result[r].index % 142;
						var y = Math.floor(result[r].index / 142);
						result[r].x = x;
						result[r].y = y;
					}
					// console.log(result);
					$CONTAINER.append(JT['admin-npcs']({
						environment: CivicSeed.ENVIRONMENT,
						npcs: result
					}));
					$CONTAINER.addClass('admin-container')
					$('title').text('{ ::: Civic Seed - Admin Panel - NPCs ::: }');
					// $BODY.attr('class', 'npcsPage');
					npcs.addSprites();
				} else {
					console.log('error');
				}
			});
		});

		$app.get('/admin/npcs/export', function (req) {
			ss.rpc('admin.npcs.exportNpcs', function (result) {
				if (result) {
					// TODO: This is hacky.
					// It should actually send a document of MIME type application/json
					// instead of just overwriting the HTML page.
					document.write(JSON.stringify(result))
				}
				else {
					console.log('error');
				}
			});
		});

		$app.get('/admin/invitecodes', function (req) {
			$CONTAINER.append(JT['admin-invitecodes']({
				title: 'Startup',
				// bodyClass: 'admin startup',
				environment: CivicSeed.ENVIRONMENT,
				// consoleOutput: consoleOutput,
				message: 'Startup admin panel.'
			}));
			$CONTAINER.addClass('admin-container')
			$('title').text('{ ::: Civic Seed - Admin Panel - Invite Codes ::: }');
		});

	}

};
