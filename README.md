# URLs - Simple URL objects for node.js

This module provides a simple URL object that provides a clean, easy-to-use interface to 
accessing a URLs values as well as for creating and manipulating URLs.  Each URL object is
immutable: whenever a value is altered, a new instance is returned leaving the original unchanged.

This module builds on top of the core 'url' and 'querystring' modules.

## Sample usage
### Creation:

    var urls = require('urls');

	// Create from string
	var myUrl = urls.parse("http://www.example.com/path/to/here?q=test");

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

### Interrogation:

	// Public properties
	myUrl['protocol']; // 'http';
	myUrl['hostname']; // 'www.example.com';

	// Getter methods
	myUrl.getProtocol(); // 'http'
	myUrl.getHostname(); // 'www.example.com'
	myUrl.getSubdomain(0); // 'www'
	myUrl.getQueryParam('q'); // 'test'
	
## API

Starting with:

    var urls = require('urls');
    var u = urls.parse('http://www.google.com/search?q=node.js#top');

then the various components of `u` can be accessed through properties:

- `u.protocol`, `u.scheme`
- `u.auth`
- `u.hostname`
- `u.port`
- `u.pathname`
- `u.search`
- `u.fragment`, `u.hash`
- `u.href`

and getters:

- `u.getProtocol()`, `u.getScheme()`
- `u.getUser()`
- `u.getPassword()`
- `u.getHostname()`
- `u.getPort()`
- `u.getPathname()`
- `u.getSearch()`
- `u.getHash()`, `u.getFragment()`
- `u.getHref()`, `u.toString()`

Note that these return `Null` when the component has no value.

More detailed interrogation can be performed using:

- `u.getSubdomain(0)`
- `u.getSubdomains()`
- `u.hasQueryParam('q')`
- `u.getQueryParam('q')`
- `u.getPathSegments()`
- `u.getPathSegment(0)`
- `u.isRelative()`
- `u.isAbsolute()`

Setters follow a similar pattern, each returning a new URL object:

- `u.setProtocol('https')`, `u.setScheme('https')`
- `u.setAuth('user', 'secret')`
- `u.setHostname('example.com')`
- `u.setPort('80')`
- `u.setPathname('/')`
- `u.setQueryParam('q', 'testing)`
- `u.setHash('top')`

These can be chained together to create a URL in a fluent, readable manner:

    var v = (new urls.Url()).setProtocol('http')
                            .setHostname('example.com')
                            .setQueryParam('q', 'node.js');

	
	
## Testing

All tests are written in the excellent 'vows' library.  To run them, use
    $ cd /path/to/urls
    $ vows --spec

## Author

David Winterbottom (david.winterbottom@gmail.com)