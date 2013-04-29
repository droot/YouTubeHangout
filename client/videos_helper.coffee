root = exports ? this
search_videos = (term, success_cb, error_cb)->
	params =
			url: "http://gdata.youtube.com/feeds/api/videos?q=#{term}&max-results=25&v=2&format=5&alt=json-in-script&callback=?",
			context: this,
			dataType: 'jsonp',
			success: (data)->
				feed = data.feed
				entries = feed.entry || []
				entries = _.map(entries, (item)->
											{'title': item.title.$t,
											'img_url': item.media$group.media$thumbnail[0].url,
											'vid': item.media$group.yt$videoid.$t})
				success_cb(entries)
				#Session.set('videos', entries)
			,
			error: ()->
				error_cb()
				#alert 'Ooops....no donuts for us.. lets try later...'
	$.ajax params

load_videos = (success_cb, error_cb)->
	params =
			url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json-in-script&format=5&callback=?",
			#url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json-in-script&callback=?",
			dataType: 'jsonp',
			success: (data)->
				feed = data.feed
				entries = feed.entry || []
				entries = _.map(entries, (item)->
											{'title': item.title.$t,
											'img_url': item.media$group.media$thumbnail[0].url,
											'vid': item.media$group.yt$videoid.$t})
				#entries = _.map(entries, (item)->
											#{'title': item.title,
											#'img_url': item.thumbnail.sqDefault,
											#'vid': item.id})
				success_cb(entries)
				#Session.set('videos', entries)
			,
			error: ()->
				error_cb()
				#alert 'Ooops....no donuts for us.. lets try later...'
	$.ajax params

root.load_videos = load_videos
root.search_videos = search_videos
