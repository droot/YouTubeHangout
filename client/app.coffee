root = exports ? this

root.init = ()->
	$(document).ready(()->
			$('.carousel').carousel({
				interval: 2000
			})
		Backbone.history.start({pushState: true})
	)
	
Meteor.startup(init)