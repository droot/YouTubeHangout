root = exports ? this
root.Template = Template

Handlebars.registerHelper('wif',
							(context, options)->
								#console.log("#{options.hash['type']}")
								op_type = options.hash['op']
								val = parseInt(options.hash['val'], 10)
								switch op_type
									when 'eq' then return options.fn(this) if context == val
									when 'gt' then return options.fn(this) if context > val
						)

Template.activity_view.activities = ()->
		hangout_id = Session.get('hangout_id')
		return Activity.find({hangout_id: hangout_id}, {sort: {when: +1}})
		#return Activity.find({})

Template.message_box.events =
	#'click .close': (ev)->
					#console.log "popup close fired..."
					#$('#myModal').addClass('hide')
					#ev.preventDefault()

	'click #send-btn, submit': (ev)->
					comment = $('#comment-input').val()
					report_activity(activity_actions.SAYS, {comment: comment})
					$('#comment-input').val('')
					refresh_activity_bar()
					ev.preventDefault()

Template.playlist.playlist = ()->
		hangout_id = Session.get('hangout_id')
		return PlayList.find({hangout_id: hangout_id})

Template.playlist.nr_videos = ()->
		hangout_id = Session.get('hangout_id')
		return PlayList.find({hangout_id: hangout_id}).count()

Template.video_list.videos = ->
		return Session.get('videos')

Template.video_list.events =
		'afterinsert': ()->
			console.log "video_list is rendered....."
			refresh_video_search_scroller()

Template.slideshow.events =
		'afterinsert': ()->
			$('.carousel').carousel({
				interval: 2000
			})
Template.playlist.link = ()->
		return "http://yth.meteor.com/#{Session.get('hangout_id')}"

Template.video_search.events =
		"click .search_btn": (ev)->
								ev.preventDefault()
								search_videos($("#search_box").val(),
												(videos)->
													console.log "new set of videos received..."
													Session.set('videos', videos)
												,
												()->
													alert 'error in loading videos...'
								)

		"click .close": (ev)->
						console.log "closing the video search dialog..."
						$('#videoModal').toggle()

root.refresh_video_search_scroller = ()->
						scroller = $('.box-wrap').antiscroll().data('antiscroll')

open_video_search_dialog = ()->
						video_search_initialized = Session.get('video_search_initialized')
						if video_search_initialized
							$('#videoModal').toggle()
						else
							console.log("video search is being intiailized...")
							$('#videoModal').modal({show:false, keyboard: true})
							$('#videoModal').toggle()
							Session.set('video_search_initialized', true)
							load_videos((videos)->
											Session.set('videos', videos)
											refresh_video_search_scroller()
										,
										()->
											alert 'error in loading videos...'
							)

Template.playlist_container.events =
	'click .add_video': (ev)->
							ev.preventDefault()
							open_video_search_dialog()
							return

Template.playlist_item.events =
	'click .play_btn': (ev)->
					ev.preventDefault()
					video = this
					console.log("Video play request #{video.vtitle} vid: #{video.vid}")
					Meteor.call('play_video',
								Session.get('hangout_id'),
								video,
								(err, id)->
									play_video(id)
					)
					report_activity(activity_actions.PLAYED_VIDEO, video)
					refresh_activity_bar()

	'click .remove_btn': (ev)->
					ev.preventDefault()
					video = this
					console.log("Video being removed.... #{video.vtitle} vid: #{video.vid}")
					Meteor.call('remove_video',
								video,
								(err, id)->
									console.log "video deleted successfully...."
					)

Template.name_entry_dialog.show_dialog = ()->
			page = Session.get('page')
			if page == "hangout"
				if Session.get('user_name')
					return false
				else
					return true
			else
				return false

Template.name_entry_dialog.events =
	#'click .close': (ev)->
					#console.log "popup close fired..."
					#$('#myModal').addClass('hide')
					#ev.preventDefault()

	'click #go_btn, submit': (ev)->
					name = $('#name-input').val()
					console.log "user just gave us a name #{name}"
					$('#myModal').removeClass('hide')
					Session.set('user_name', name)
					$.cookie('user_name', name, {path: '/'})
					report_activity(activity_actions.JOINED_HANGOUT, null)
					refresh_activity_bar()
					ev.preventDefault()

Template.video.events =
	'click .queue_btn': (ev)->
					ev.preventDefault()
					console.log("Video requested #{this.title} vid: #{this.vid}")
					Meteor.call('queue_video',
								Session.get('hangout_id'),
								this,
								(err, id)->
									console.log "video queued successfully...."
					)
					report_activity(activity_actions.QUEUED_VIDEO, this)


Template.page_stack.is_hangout_page = ()->
			page = Session.get('page')
			return page == "hangout"

Template.home_page.events =
	"click .start_hangout_btn": (ev)->
			ev.preventDefault()
			#Create an Hangout and get the ID
			#Load the Hangout with the given ID
			#
			Meteor.call('create_hangout',
						'LivingRoom',
						(err, id) ->
							return Router.load_hangout(id) if !err
				)
