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
}

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
        }
    },
    'A URL object created from http://www.google.com/path/to/file?q=testing&nocache': {
        topic: urls.createFromString("http://www.google.com/path/to/file?q=testing&nocache"),
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
            assert.equal(url.toString(), "http://www.google.com/path/to/file?q=testing&nocache");
        }
    },
    'A URL object created from http://www.example.com/path/to/file?q=testing&nocache': {
        topic: urls.createFromString("http://www.example.com/path/to/file?q=testing&nocache"),
        "can have it's protocol changed to https": function(url) {
            url.setProtocol('https');
            assert.equal(url.toString(), "https://www.example.com/path/to/file?q=testing&nocache");
        },
        "can have it's hostname changed correctly": function(url) {
            url.setHostname('test.example.com');
            assert.equal(url.toString(), "https://test.example.com/path/to/file?q=testing&nocache");
        }
    }
}).export(module);