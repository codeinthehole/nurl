# nURL - A simple URL object for node.js

This module provides a simple URL object that provides a clean, easy-to-use interface to 
accessing a URLs values as well as for creating and manipulating URLs.  Each URL object is
immutable: whenever a value is altered, a new instance is returned leaving the original unchanged.

This module builds on top of the core 'url' and 'querystring' modules.

## Installation

Nothing more than:

    npm install nurl

## Sample usage
	
URLs are modelled as:

    scheme://user:password@hostname:port/pathname?search#fragment

Note that the `//` following the scheme is optional for certain schema (eg mailto).	

Now, starting with:

    var nurl = require('nurl');

you can create a URL object using one of:

    var u = nurls.parse('http://www.google.com/search?q=node.js#top');
    var u = (new nurl.Url()).setScheme('http')
						    .setHostname('www.google.com')
							.setPathname('/search')
							.setQueryParam('q', 'node.js')
							.setFragment('top');
	var u = new nurl.Url('http', Null, Null, 'www.google.com', Null, '/search', 'q=node.js', 'top');

The various components of `u` can be accessed through both read-only properties and getter methods:

    u.protocol, u.scheme, u.getProtocol(), u.getScheme() // => 'http'
	u.getUser() // => Null
	u.getPassword() // => Null
    u.auth, u.getAuth() // => Null
    u.hostname, u.getHostname() // => 'www.google.com'
    u.port, u.getPort() // => 80
    u.pathname, u.getPathname() // => '/search'
    u.search, u.getSearch() // => '?node.js'
    u.fragment, u.hash, u.getFragment(), u.getHash() // => 'top'
    u.href, u.getHref() // => 'http://www.google.com/search?q=node.js#top'

Note that:

- both the properties and getters return `Null` when the component has no value.
w
- some property names are aliases (such as 'protocol' and 'scheme')

More detailed interrogation can be performed using:

    u.getSubdomains() // => ['www', 'google', 'com']
    u.getSubdomain(0) // => 'www'
    u.hasQueryParam('q') // => True
    u.getQueryParam('q') // => 'node.js'
    u.getPathSegments() // => ['search']
    u.getPathSegment(0) // => 'search'
    u.isRelative() // => False
    u.isAbsolute() // => True

Setters follow a similar pattern, each returning a new URL object:

    u.setProtocol('https'), u.setScheme('https')
    u.setAuth('user', 'secret')
    u.setHostname('example.com')
    u.setSubdomain(0, 'sample') // => 'sample.google.com'
    u.setPort('80')
    u.setPathname('/')
    u.setPathSegment(1, 'extension') // => '/search/extension'
    u.setQueryParam('q', 'testing')
    u.setHash('top')

URL objects can be merged to create a new object - the properties of the passed in
URL will fill in any missing components:

    var u1 = nurl.parse('http://www.google.com');
	var u2 = nurl.parse('/search?q=test.js');
	u1.mergeWith(u2) // => 'http://www.google.com/search?q=test.js'

	
## Testing

All tests are written in the excellent [vows](http://vowsjs.org/) library.  To run them, use

    $ cd /path/to/nurl
    $ vows --spec

## Author

David Winterbottom (david.winterbottom@gmail.com)