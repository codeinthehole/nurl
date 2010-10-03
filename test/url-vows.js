var vows = require('vows'),
    assert = require('assert');

// Modify assert to add a view convenience methods
assert.isNull = function(value) {
    assert.strictEqual(value, null);
};
assert.equalArrays = function(expected, actual) {
    if (expected.length != actual.length) return false;
    for (var i=0; i<expected.length; i++) {
        if (expected[i] != actual[i]) return false;
    }
    return true;
};
var getNumPublicProperties = function(object) {
    var numPublicProperties = 0;
    for (property in object) {
        numPublicProperties += typeof object[property] == "function" ? 0 : 1;
    }
    return numPublicProperties;
};

var urls = require('urls');

vows.describe("URL objects").addBatch({
    'A URL created from http://www.google.com': {
        topic: urls.createFromString("http://www.google.com"),
        'has protocol "http"': function(url) {
            assert.equal(url.getProtocol(), 'http');
        },
        'has host "www.google.com"': function(url) {
            assert.equal(url.getHostname(), 'www.google.com');
        },
        'has pathname "/"': function(url) {
            assert.equal(url.getPathname(), '/');
        },
        'has an assumed port of 80': function(url) {
            assert.equal(url.getPort(), 80);
        },
        'has no user nor password': function(url) {
            assert.isNull(url.getUser());
            assert.isNull(url.getPassword());
        },
        'returns itself correctly as a string': function(url) {
            assert.equal(url.toString(), "http://www.google.com");
        },
        'does not reveal "protocol" as a public property': function(url) {
            assert.isUndefined(url.protocol);
        },
        'does not reveal any public properties': function(url) {
            assert.equal(getNumPublicProperties(url), 0);
        },
        'returns null as its hash': function(url) {
            assert.isNull(url.getHash());
        }
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
            assert.equalArrays(url.getPathSegments(), ['path', 'to', 'file']);
        },
        'has second path segment "to"': function(url) {
            assert.equalArrays(url.getPathSegment(1), "to");
        },
        'has subdomains ["www", "google", "com"]': function(url) {
            assert.equalArrays(url.getSubdomains(), ["www", "google", "com"]);
        },
        'has top-level domain "com"': function(url) {
            assert.equalArrays(url.getSubdomain(2), "com");
        },
        'returns itself correctly as a string': function(url) {
            assert.equal(url.toString(), "http://www.google.com/path/to/file?q=testing&nocache#something");
        },
        'returns the correct hash using getHash()': function(url) {
        	assert.equal(url.getHash(), 'something');
        },
        'returns the correct hash using getFragment()': function(url) {
        	assert.equal(url.getFragment(), 'something');
        }
    },
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