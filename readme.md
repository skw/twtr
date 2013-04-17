# Twitter reader sample app

This is a simple app for reading twitter feeds. Tweets can be filtered via hash tag.

## Functionality

* Tweets refresh every 10 seconds
* Browser sleeps after no activity

## Stack

* Markup
	* [Jade](http://jade-lang.com/)
* Styles
	* [Stylus](http://learnboost.github.io/stylus/)
	* [Bootstrap](http://twitter.github.io/bootstrap/)
* Scripts
	* [Coffescript](http://coffeescript.org/)
	* Backbone
	*	Underscore
	* Backbone Local-Storage

## Considerations

* no testing was conducted for the scope of this project 
* lacks error handling
* localstorage has been implemented, but result view render(s) are based on queries as opposed to what's in local storage.

## Building/Transpiling from Source

The following dependencies are required to build/transpile the source:

* Nodejs
* Git

Once the dependencies are installed we can clone the repo:

	$ git clone https://github.com/shaunwong/twtr.git .
	
Then install required executables for the cakefile:

	$ sudo npm install coffee-script -g
	$ sudo npm install stylus -g
	$ sudo npm install jade -g
	
Then run the cakefile (in the project directory):

	$ cake dev
