URLs - Simple URL objects for node.js
=====================================

Isn't there already a 'url' module for node.js?
-----------------------------------------------
True, but it is relatively simple: offering a few methods for parsing and formatting
URLs.  This module provides a simple URL object that can be interrogated and
manipulated.  All URL objects are immutable and offer a clean, intention-revealing API
that makes them easy to work with.

Sample usage
------------
    var urls = require('urls');
	var myUrl = urls.createFromString("http://www.example.com/path/to/here?q=test");

	// Sample getters
	myUrl.getProtocol(); // 'http'
	myUrl.getHostname(); // 'www.example.com'
	myUrl.getSubdomain(0); // 'www'
	myUrl.getQueryParam('q'); // 'test'
	
	// Create a new URL using chained methods
	var anotherUrl = (new urls.Url()).setProtocol('https')
							         .setHostname('www.google.com')
									 .setQueryParam('q', 'node.js');

	// Create a new URL from an existing one
	var modifiedUrl = anotherUrl.setQueryParam('q', 'javascript');
	anotherUrl.toString(); // 'http://www.google.com/q=javascript'
	anotherUrl == modifiedUrl; // false

Testing
-------
All tests are written in the excellent 'vows' library.  To run them, use
    ? cd /path/to/urls
    ? vows 

Author
-----
David Winterbottom (david.winterbottom@gmail.com)


This README is not finished yet.