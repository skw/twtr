# --------------------------------------------------
# - Twitter Sample Application
# - By Shaun Kirk Wong
# --------------------------------------------------
#$script.ready 'core', ()->
#alert('ping!')
#http://stackoverflow.com/questions/10048728/how-to-use-twitter-rest-api-with-backbone
#models
tweet = Backbone.Model.extend()

#collection
tweets = Backbone.Collection.extend(
	model: Tweet
	url: 'http://search.twitter.com/search.json?q=NYC&callback=?'
	parse: (res) ->
		console.log 'parsing...'
		res.results
)

#views
resultsView = Backbone.View.extend(
	el: $('body')
	events: 
		'click button#add': 'doSearch'
	initialize: () ->
		_.bindAll this, 'render', 'addItem'
		this.tweets = new Tweets()
		_this = this
		this.tweets.bind 'reset', (collection) ->
			_this.$('#tweets').empty
			collection.each () ->
				_this.addItem tweet
		this.counter = 0
		this.render()
)