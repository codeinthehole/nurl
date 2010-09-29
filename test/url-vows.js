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
    }
}).export(module);