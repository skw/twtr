# --------------------------------------------------
# - Twitter Sample Application
# - By Shaun Kirk Wong
# --------------------------------------------------

# --------------------------------------------------
# - models
# --------------------------------------------------
Tweet = Backbone.Model.extend()
Query = Backbone.Model.extend()
# --------------------------------------------------
# - collection
# --------------------------------------------------
Tweets = Backbone.Collection.extend(
	model: Tweet
	localStorage: new Backbone.LocalStorage 'bb_twts'
)
tweets = new Tweets
tweets.on(
	'sync'
	()->
		console.log 'tweets synced with local storage'
)
Queries = Backbone.Collection.extend(
	model: Query
	localStorage: new Backbone.LocalStorage 'bb_logs'
)
# --------------------------------------------------
# - views
# --------------------------------------------------
ResultsView = Backbone.View.extend(
	el: $('#search')
	events:
		'click button#s': 'searchHash'
		'keypress input#q': 'keyPressed'
	initialize: ()->
		this.searchHash()
	keyPressed: (e)->
		this.searchHash(e) if e.keyCode is 13 
	searchHash: (e)->
		if e?
			e.preventDefault()
		console.clear() # clear console in chrome
		#$('#results').fadeOut()
		$('#results').empty() # clear resultsz
		q = $('#q').val() # store query string
		hash = '%23'
		console.log 'searching: ' + q
		_this = this
		src_url = 'http://search.twitter.com/search.json?callback=?'
		$.getJSON src_url, 
			q: hash + q, 
			(_data)->
				for i of _data.results
					result = _.pick(
						_data.results[i]
						'created_at'
						'from_user'
						'from_user_id'
						'profile_image_url'
						'source'
						'text'
					)
					_.extend(
						result
						num : parseInt(i) + 1
						hash : q
					)
					tweet = new Tweet result
					tweets.add tweet
					console.log result
					tweetView = new TweetView(
						model: tweet
					)
					tweetView.render()
				#$('#results').fadeIn()

)

TweetView = Backbone.View.extend(
	render: ()->
		this.model.save()
		result_template =
			'<tr>
				<td> <%= num  %> </td>
				<td> <a href="http://twitter.com/<%= from_user %>" title="<%= from_user %>">@<%= from_user %></a> </td>
				<td> <%= text %> </td>
			</tr>'
		tweet = _.template result_template, this.model.toJSON()
		$('#results').append(tweet)
)
# --------------------------------------------------
# - ticker
# --------------------------------------------------
###
ticker = {}
ticker.max = 60000 # 1min
ticker.tick = 10000 # 10s
ticker.current = 0 # current active time
setInterval(
	()->
		if ticker.current < ticker.max
			resultsView = new ResultsView
			resultsView.searchHash()
			ticker.current += ticker.tick
			console.log ticker.current + ' / ' + ticker.max
		else
			console.clear() # clear console in chrome
			console.log 'sleeping...'
			$('#sleep').fadeIn()
	ticker.tick
)

$('#sleep').click(
	()->
		ticker.current = 0
		$('#sleep').fadeOut()
)

$('#sleep').css(
	'cursor'
	'pointer'
)
###
# --------------------------------------------------
# - router
# --------------------------------------------------
Router = Backbone.Router.extend(
	routes:
			"": "index"
	index: ()->
		resultsView = new ResultsView
)

appRouter = new Router()

Backbone.history.start()

