root = exports ? this

root.activity_actions =
		JOINED_HANGOUT: 1
		QUEUED_VIDEO: 2 #this needs video data
		PLAYED_VIDEO: 3 #this needs video data
		SAYS: 4 #this needs comment

root.report_activity = (type, data)->
		item =
			actor: Session.get('user_name')
			hangout_id: Session.get('hangout_id')
			type: type
			data: data
		Meteor.call('report_activity',
					item,
					(err, id)->
						console.log("reported activity successfully")
			)
