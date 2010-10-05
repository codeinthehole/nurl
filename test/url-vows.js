var vows = require('vows'),
    assert = require('assert');

var urls = require('urls');

//A list of publicly exposed properties on the URL object - we use these to dynamically
//define tests
var properties = ['protocol', 'scheme', 'hostname', 'pathname', 'search', 'fragment', 'hash', 'href'];

// Set up a list of URLs together with their expected properties
var testUrls = {
	'http://www.google.com': {
		'protocol': 'http',
		'user': null,
		'password': null,
		'hostname': 'www.google.com',
		'pathname': '/',
		'port': 80,
		'search': null,
		'hash': null
	},
	'ftp://user:password@host.com': {
		'protocol': 'ftp',
		'auth': 'user:password',
		'hostname': 'host.com'
	},
	'mailto:someone@domain.com': {
		'protocol': 'mailto',
		'auth': 'someone',
		'hostname': 'domain.com'
	}
};	

// A simple function for dynamically creating property assertions
var createPropertyAssertion = function(property, value) {
	return function(url) {
		assert.equal(url[property], value);
	};
};


vows.describe("URL objects").addBatch({
	'A valid URL object can be created from the string ': (function(){ 
        var subContext = {};
        for (urlString in testUrls) {
            subContext["'"+urlString+"'"] = {
            	topic: urlString,
            	"without error": function(str) {
            		assert.doesNotThrow(function(){urls.createFromString(str);}, Error);
            	}
            }; 
        }
        return subContext;
    })(),
    // Verify the properties are accessible as defined in the testUrls object
    'A URL object created from ': (function(){ 
        var subContext = {};
        for (urlString in testUrls) {
        	var subSubContext = {
        		topic: urls.createFromString(urlString)
        	};
        	for (key in testUrls[urlString]) {
        		var property = key;
        		var value = testUrls[urlString][key];
        		subSubContext['has '+property+' '+value] = createPropertyAssertion(property, value);
        	}
            subContext["'"+urlString+"'"] = subSubContext;
        }
        return subContext;
    })(),
    'A URL object created from http://www.google.com': {
        topic: urls.createFromString("http://www.google.com"),
        'has scheme "http" (alias of protocol)': function(url) {
            assert.equal(url.getScheme(), 'http');
        },
        'returns itself correctly as a string': function(url) {
            assert.equal(url.toString(), "http://www.google.com");
        },
        'is equal to a URL created from "HTTP://WWW.GOOGLE.COM"': function(url) {
            assert.equal(urls.createFromString('HTTP://WWW.GOOGLE.COM').toString(), url.toString());
        },
        'exposes protocol as a public property': function(url) {
            assert.equal(url.protocol, 'http');
        },
        // Here we use a lambda to dynamically create a sub-context from the list of 
        // publicly available properties
        'throws a TypeError when ': (function(){ 
            var subContext = {};
            for (key in properties) {
                var property = properties[key];
                subContext[property+" is reassigned"] = function(url) {
                    assert.throws(function(){url[property] = 'something';}, TypeError); 
                };
            }
            return subContext;
        })(),
        'has a public property: ': (function(){ 
            var subContext = {};
            for (key in properties) {
                var property = properties[key];
                subContext[property] = function(url) {
                    assert.isTrue(typeof url[property] != "undefined");
                };
            }
            return subContext;
        })()
    },
    'A URL object created from http://www.google.com/path/to/file?q=testing&nocache#something': {
        topic: urls.createFromString("http://www.google.com/path/to/file?q=testing&nocache#something"),
        'has protocol "http"': function(url) {
            assert.equal(url.getProtocol(), 'http');
        },
        'has host "www.google.com"': function(url) {
            assert.equal(url.getHostname(), 'www.google.com');
        },
        'has no user nor password': function(url) {
            assert.isNull(url.getUser());
            assert.isNull(url.getPassword());
        },
        'has pathname "/path/to/file"': function(url) {
            assert.equal(url.getPathname(), "/path/to/file");
        },
        'has a query parameter "nocache"': function(url) {
            assert.ok(url.hasQueryParam('nocache'));
        },
        'does not have a query parameter "bacon"': function(url) {
            assert.ok(!url.hasQueryParam('bacon'));
        },
        'has a query parameter "q" equal to "testing"': function(url) {
            assert.equal(url.getQueryParam('q'), 'testing');
        },
        'returns an empty string for the value of query param "nocache"': function(url) {
            assert.equal(url.getQueryParam('nocache'), '');
        },
        'has 2 query parameters': function(url) {
            var numKeys = 0;
            for (value in url.getQueryParams()) {
                numKeys++;
            }
            assert.equal(numKeys, 2);
        },
        'has path segments ["path", "to", "file"]': function(url) {
            assert.deepEqual(url.getPathSegments(), ['path', 'to', 'file']);
        },
        'has second path segment "to"': function(url) {
            assert.equal(url.getPathSegment(1), "to");
        },
        'has subdomains ["www", "google", "com"]': function(url) {
            assert.deepEqual(url.getSubdomains(), ["www", "google", "com"]);
        },
        'has top-level domain "com"': function(url) {
            assert.equal(url.getSubdomain(2), "com");
        },
        'returns itself correctly as a string': function(url) {
            assert.equal(url.toString(), "http://www.google.com/path/to/file?q=testing&nocache#something");
        },
        'getHref() returns full string': function(url) {
            assert.equal(url.getHref(), "http://www.google.com/path/to/file?q=testing&nocache#something");
        },
        'returns the correct hash using getHash()': function(url) {
        	assert.equal(url.getHash(), '#something');
        },
        'returns the correct hash using getFragment()': function(url) {
        	assert.equal(url.getFragment(), '#something');
        }
    },
//    'mailto:someuser@domain.com': {
//        topic: function() {
//    		return urls.createFromString(this.context.name);
//    	},
//        ' has protocol "mailto"': function(url) {
//            assert.equal(url.getProtocol(), 'mailto');
//        }
//    },
    // TESTING SETTERS
    'A URL object created from http://www.example.com/path/to/file?q=testing&nocache': {
        topic: urls.createFromString("http://www.example.com/path/to/file?q=testing&nocache"),
        "returns a new URL object when changed": function(url) {
            var newUrl = url.setProtocol('https');
            assert.notEqual(newUrl, url);
        },
        "can have its hostname changed correctly": function(url) {
            var newUrl = url.setHostname('test.example.com');
            assert.equal(newUrl.toString(), "http://test.example.com/path/to/file?q=testing&nocache");
        },
        "can have its subdomain changed correctly": function(url) {
        	var newUrl = url.setSubdomain(0, 'data');
            assert.equal(newUrl.toString(), "http://data.example.com/path/to/file?q=testing&nocache");
        },
        "can have its pathname changed": function(url) {
        	var newUrl = url.setPathname("/another/path");
            assert.equal(newUrl.toString(), "http://www.example.com/another/path?q=testing&nocache");
        },
        "can have a single query parameter changed": function(url) {
        	var newUrl = url.setQueryParam('nocache', 'yes');
            assert.equal(newUrl.toString(), "http://www.example.com/path/to/file?q=testing&nocache=yes");
        },
        "correctly escapes query parameters when they are set": function(url) {
        	var newUrl = url.setQueryParam('nocache', 'yes and no');
            assert.equal(newUrl.toString(), "http://www.example.com/path/to/file?q=testing&nocache=yes%20and%20no");
        },
        "can have individual path segments set": function(url) {
        	var newUrl = url.setPathSegment(0, 'new-path');
            assert.equal(newUrl.toString(), "http://www.example.com/new-path/to/file?q=testing&nocache");
        },
        "correctly escapes path segments when they are set": function(url) {
        	var newUrl = url.setPathSegment(0, 'new path');
            assert.equal(newUrl.toString(), "http://www.example.com/new%20path/to/file?q=testing&nocache");
        }
    },
    'The URL ftp://someuser:somepassword@host.example.com': {
    	topic: 'ftp://someuser:somepassword@host.example.com',
    	"can be created by chaining methods together": function(urlString) {
    		var newUrl = (new urls.Url()).setProtocol('ftp')
    					                 .setAuth('someuser', 'somepassword')
    					                 .setHostname('host.example.com');
    		assert.equal(newUrl.toString(), urlString);
    	},
    	"can be created by using the 'createFromString' factory method": function(urlString) {
    		var newUrl = urls.createFromString(urlString);
    		assert.equal(newUrl.toString(), urlString);
    	},
    	"returns 'someuser:somepassword' from getAuth()": function(urlString) {
    		var newUrl = urls.createFromString(urlString);
    		assert.equal('someuser:somepassword', newUrl.getAuth());
    	}
    },
    'Creation patterns': {
    	topic: null,
    	'/path/to/somewhere?q=test can be created using chained methods': function(notUsed) {
    		var testUrl = (new urls.Url()).setPathname('/path/to/somewhere')
    		 							  .setQueryParam('q', 'test');
    		assert.equal(testUrl.toString(), '/path/to/somewhere?q=test');
    	}
    },
    'Merging URL objects': {
    	topic: function() {
    	    return urls.createFromString('http://www.google.com');
    	},
    	'with non-clashing URLs' : {
    		topic: function(mainUrl) {
    			var mergeUrl = urls.createFromString('/testing');
    			return mainUrl.mergeWith(mergeUrl);
    		},
    		'includes components from the second URL that are null in the first': function(url) {
    			assert.equal(url.toString(), 'http://www.google.com/testing');
    		}
    	},
    	'with clashing URLs' : {
    		topic: function(mainUrl) {
    			var mergeUrl = urls.createFromString('http://www.example.com/testing?q=boom');
    			return mainUrl.mergeWith(mergeUrl);
    		},
    		'includes only components from the second URL that are null in the first': function(url) {
    			assert.equal(url.toString(), 'http://www.google.com/testing?q=boom');
    		}
    	}
    }
}).export(module);