# Twitter reader sample app

This is a simple app for reading twitter feeds. Tweets can be filtered via hash tag.

## Features

* Tweets refresh every 10 seconds
* Browser sleeps after no activity

## Stack

* Markup
	* Jade
* Styles
	* Stylus
	* Nib
	* Bootstrap
* Scripts
	* Coffescript
	* Ender - Requirejs alternative that utilizes a buildscript and microlibs
	* PouchDB - 

## Considerations

* No testing was conducted for the scope of this project. 

## Building/Transpiling from Source

The following dependencies are required to build/transpile the source:

* Nodejs
* Git

Once the dependencies are installed we can clone the repo:

	$ git clone whatever.git .
	
Then install required executables for the cakefile:

	$ sudo npm install coffee-script -g
	$ sudo npm install stylus -g
	$ sudo npm install jade -g
	
Then run the cakefile (in the project directory):

	$ cake dev
