root = exports ? this

class YTHRouter extends Backbone.Router
	routes:
		"":	"home",
		":id": "hangout"
	home: ()->
		#alert 'help called'
		Session.set('page', 'home')
	hangout: (id)->
		initialize_hangout id
	
	load_hangout: (id)->
		@.navigate("#{id}", true)

root.Router = new YTHRouter()
