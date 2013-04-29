#Here we will implement what is all required to HangOut to work
#
#
root = exports ? this

play_current_video = ()->
	update = ()->
		ctx = new Meteor.deps.Context()
		ctx.on_invalidate(update)
		ctx.run ()->
			current_video = HangOuts.findOne({_id: Session.get('hangout_id')})
			if current_video and current_video.vid
				console.log "currently played video: #{current_video.vid}"
				play_video(current_video.vid)
	update()

ensure_user_name = ()->
	name = $.cookie('user_name')
	console.log "read user name #{name}"
	if name
		Session.set('user_name', name)

root.refresh_activity_bar = ()->
	return
	scroller = Session.get('scroller')
	if scroller
		scroller.refresh()
	else
		scroller = $('.box-wrap').antiscroll().data('antiscroll')
		Session.set('scroller', scroller)

update_activity_bar = ()->
	update = ()->
		ctx = new Meteor.deps.Context()
		ctx.on_invalidate(update)
		ctx.run ()->
			hangout_id = Session.get('hangout_id')
			num = Activity.find({hangout_id: hangout_id}, {sort: {when: +1}}).count()
			if num
				refresh_activity_bar()
				#scroller = $('.box-wrap').antiscroll().data('antiscroll')
				#scroller.refresh()
				#console.log "currently played video: #{current_video.vid}"
				#play_video(current_video.vid)
	update()

load_hangout = (id)->
	Session.set('page','hangout')
	Session.set('hangout_id', id)
	ensure_user_name()
	play_current_video()
	#update_activity_bar()
	#load popular videos by default....
	#load_videos((videos)->
					#Session.set('videos', videos)
				#,
				#()->
					#alert 'error in loading videos...'
	#)
	#scroller = $('.box-wrap').antiscroll().data('antiscroll')
	#scroller.refresh()
	#search_videos("jason marz details of the fabric",
					#(videos)->
						#Session.set('videos', videos)
					#,
					#()->
						#alert 'error in loading videos...'
	#)

root.initialize_hangout = load_hangout
