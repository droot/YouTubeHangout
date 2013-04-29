root = exports ? this

player = null
is_player_ready = false

onPlayerReady = (event)->
	console.log "player is ready to play any video..."
	is_player_ready = true
	event.target.playVideo()

onPlayerStateChange = (event)->
	console.log "player state changed received #{event.data}"
	if (event.data == YT.PlayerState.ENDED)
		console.log "A video just finished, lets play next"
		Meteor.call('play_next', Session.get('hangout_id'),
					(err, id)->
						if id
							console.log "new video #{id} is next...."
						else
							console.log "some error in selecting next video"
						#play_video(id)
					)

config =
	height: '390'
	width: '640'
	videoId: 'u1zgFlCw8Aw'
	playerVars:
			autoplay: 0
			controls: 1
			wmode: 'transparent'
	events:
		'onReady': onPlayerReady
		'onStateChange': onPlayerStateChange

onYouTubePlayerAPIReady = ()->
	player = new YT.Player('player', config)

load_player = (vid)->
	if vid
		config.videoId = vid
	tag = document.createElement('script')
	tag.src = "http://www.youtube.com/player_api"
	firstScriptTag = document.getElementsByTagName('script')[0]
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

play_video = (vid)->
	if player and is_player_ready
		player.loadVideoById(vid)
	else
		load_player(vid)

#export out key functions
root.onYouTubePlayerAPIReady = onYouTubePlayerAPIReady
root.load_player = load_player
root.play_video = play_video
