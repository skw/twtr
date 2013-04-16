# --------------------------------------------------
# - Twitter Sample Application
# - By Shaun Kirk Wong
# --------------------------------------------------

#models
Tweet = Backbone.Model.extend()

# collection
Tweets = Backbone.Collection.extend(
	model: Tweet
	#url: 'http://search.twitter.com/search.json?q=NYC&callback=?'
	#parse: (res) ->
	#	console.log 'parsing...'
	#	res.results
)

# views
ResultsView = Backbone.View.extend(
	el: $('#search')
	events:
		'click button#s': 'searchHash'
		'keypress :input': 'keyPressed'
	keyPressed: (e)->
		this.searchHash(e) if e.keyCode is 13 
	searchHash: (e)->
		e.preventDefault()
		console.clear() # clear console in chrome
		$('#results').fadeOut()
		$('#results').empty()
		q = $('#q').val() # store query string
		hash = '%23'
		console.log 'searching: ' + q
		_this = this
		$.getJSON 'http://search.twitter.com/search.json?callback=?', 
			q: hash + q, 
			(data)->
				for i of data.results
					console.log i
					tweet = new Tweet data.results[i]
					console.log data.results[i]
					tweetView = new TweetView(
						model: tweet
					)
					tweetView.render()
				$('#results').fadeIn()
)

TweetView = Backbone.View.extend(
	render: ()->
		result_template = '
		<tr>
			<td> <%= id %> </td>
			<td> <a href="http://twitter.com/<%= from_user %>" title="<%= from_user %>">@<%= from_user %></a> </td>
			<td> <%= text %> </td>
		</tr>'
		tweet = _.template result_template, this.model.toJSON()
		$('#results').append(tweet)
)

# router
Router = Backbone.Router.extend(
	routes:
			"": "index"
	index: ()->
		resultsView = new ResultsView
)

appRouter = new Router()

Backbone.history.start()
