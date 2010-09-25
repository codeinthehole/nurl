URLs - Simple URL objects for node.js
=====================================

Isn't there already a 'url' module for node.js?
-----------------------------------------------
True, but it is relatively simple: offering a few methods for parsing and formatting
URLs.  This module provides a simple URL object that can be interrogated and
manipulated.

Sample usage
------------
    var urls = require('urls');
	var myUrl = urls.createFromString("http://www.example.com/path/to/here?q=test");

Testing
-------
All tests are written in the excellent 'vows' library.  To run them, use
    ? cd /path/to/urls
    ? vows --spec url-rows.js

This README is not finished yet.