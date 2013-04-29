root = exports ? this
#youtube hangount collection
root.HangOuts = new Meteor.Collection('hangouts')
#{_id:, time:12322, playlist_id: 234322343skdjdld, online_users: 54,
#videos_played: 565, activities: [{}] }
#Playlist collection
root.PlayList = new Meteor.Collection('playlist')
#{_id:, hangout_id, playing: , vid, thumbnail, title, added_at, vote_count,
#played_count, last_played_at }
root.Activity = new Meteor.Collection('activity')
#{_id:, hangout_id, actor, type: to represent activity type, data: dict()}

if Meteor.is_server
	pub_fn = (hangout_id)->
		self = @
		uuid = Meteor.uuid()
		count = 0

		handle = HangOuts.find({_id: hangout_id}).observe({
											changed: (doc, idx, old_doc)->
												self.set("currently-playing", uuid, "video", doc.video.vid)
												self.flush()
							})
		self.onStop(()->
			handle.stop()
			self.unset("currently-playing", uuid, "currently-playing")
			self.flush()
		)
	#Meteor.publish("currently-playing", pub_fn)
