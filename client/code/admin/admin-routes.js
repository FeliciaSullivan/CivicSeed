// var content = $('#content');

var self = module.exports = {

	loadRoutes: function(ss, $app) {

		var $body = $(document.body);
		var tmplEngine = ss.tmpl;

		$app.get('/admin', function(req) {
			$('#container').empty().append(tmplEngine['partials-navigation'].render());
			$('#container').append(tmplEngine['admin-panel'].render({
				message: 'User admin panel.'
			}));
			$('title').text('{ ::: Civic Seed - Admin Panel ::: }');
			$body.attr('class', 'adminPage');
		});





		// // nodeEnv = app.get('env');
		// // User = service.useModel('user');
		// Invitee = service.useModel('user', 'preload');

		// app.get('/admin/invitecodes', function(req, res) {

		// 	// var consoleOutput;
		// 	Invitee.collection.distinct('sessionName', function(err, invitees) {
		// 		if(err) {
		// 			console.error('Could not find document: %s', err);
		// 		}
		// 		// console.log(invitees);
		// 		res.render('admin/invitecodes.hbs', {
		// 			title: 'Invite Codes',
		// 			bodyClass: 'admin invitecodes',
		// 			// nodeEnv: nodeEnv,
		// 			// consoleOutput: consoleOutput,
		// 			message: 'Invite codes.',
		// 			invitees: invitees,
		// 		});
		// 	});

		// });

		// // create a set of codes
		// app.get('/admin/action/create-invite-codes/:sessionName', function(req, res) {
		// 	var i;
		// 	var inviteeGroup = [];
		// 	var inviteeObject;
		// 	var sessionName = req.params.sessionName;
		// 	function createCode() {
		// 		var codeArray = [];
		// 		var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.:;{}[]|-=_+()&^%$#@!?~`ç√∫¥';
		// 		for(var i=0; i < 50; i++) {
		// 			codeArray[i] = charSet.charAt(Math.floor(Math.random() * charSet.length));
		// 		}
		// 		return codeArray.join('');
		// 	};

		// 	// TODO: add in emails...???
		// 	for(i = 0; i < 30; i++) {
		// 		inviteeObject = {};
		// 		inviteeObject.sessionName = sessionName;
		// 		// inviteeObject.email = '???@???.???';
		// 		inviteeObject.accepted = false;
		// 		inviteeObject.code = createCode();
		// 		inviteeGroup.push(inviteeObject);
		// 	}

		// 	// console.log(inviteeGroup);

		// 	Invitee.create(inviteeGroup, function(err) {
		// 		if(err) {
		// 			console.error('  Could not create documents: %s  '.yellow.inverse, err);
		// 			res.send('Error creating invite codes...');
		// 		} else {

		// 			Invitee.find({ sessionName: sessionName }, 'code', function (err, codes) {
		// 				var length = codes.length;
		// 				var i;
		// 				var codesArray = [];
		// 				for(i = 0; i < length; i++) {
		// 					codesArray.push(codes[i].code);
		// 				}
		// 				// console.log(codesArray);
		// 				console.log('CS: '.blue + 'Invite codes created and saved to database: '.green);
		// 				res.send(codesArray);
		// 			});

		// 		}
		// 	});

		// });

		// // recreate/overwrite a set of existing session codes
		// app.get('/admin/action/delete-invite-codes/:session', function(req, res) {
		// 	// res.render('admin/admin.hbs', {
		// 	// 	title: 'Admin',
		// 	// 	bodyClass: 'admin',
		// 	// 	message: req.params.session,
		// 	// });
		// });



	}

};