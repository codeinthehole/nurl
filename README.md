URLs - Simple URL objects for node.js
=====================================

Isn't there already a 'url' module for node.js?
-----------------------------------------------
True, but it is relatively simple: offering a few methods for parsing and formatting
URLs.  This module complements that functionality by providing a simple URL object that can be interrogated and
manipulated.  

What's good about this URL object?
----------------------------------
All URL objects are immutable and offer a clean, intention-revealing API
that makes them easy to work with.  Each URL exposes it's properties through both getter methods
(e.g. getProtocol) and public properties (defined using __defineGetter__).  When a property is altered
on a URL object, a new instance is returned.

Sample usage
------------
Creation:

    var urls = require('urls');

	// Create from string
	var myUrl = urls.createFromString("http://www.example.com/path/to/here?q=test");

	// Create using chained methods
	var anotherUrl = (new urls.Url()).setProtocol('https')
							         .setHostname('www.google.com')
									 .setQueryParam('q', 'node.js');

	// Create by mutating an existing URL
	var modifiedUrl = myUrl.setQueryParam('q', 'javascript');
	anotherUrl.toString(); // 'http://www.google.com/q=javascript'
	anotherUrl == modifiedUrl; // false

	// Create by merging two existing URLs 
    var url1 = urls.createFromString("http://www.example.com");
    var url2 = urls.createFromString("/path/#frag");
    var url3 = url1.mergeWith(url2);
	url3.toString(); // 'http://www.example.com/path#frag'

Interrogation:

	// Public properties
	myUrl['protocol']; // 'http';
	myUrl['hostname']; // 'www.example.com';

	// Getter methods
	myUrl.getProtocol(); // 'http'
	myUrl.getHostname(); // 'www.example.com'
	myUrl.getSubdomain(0); // 'www'
	myUrl.getQueryParam('q'); // 'test'
	
Testing
-------
All tests are written in the excellent 'vows' library.  To run them, use
    ? cd /path/to/urls
    ? vows --spec

Author
-----
David Winterbottom (david.winterbottom@gmail.com)