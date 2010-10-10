var urllib = require('url'), 
    qs = require('querystring');

// Url object - standard constructor takes all possible values as arguments
var Url = exports.Url = function(scheme, user, password, hostname, port, pathname, search, hash) {
	// Store properties in a private obj and provide "privileged" getter method to allow access.
    var properties = {
        "scheme": scheme || null,
        "user": user || null,
        "password": password || null,
        "hostname": hostname || null,
        "port": port || null,
        "pathname": pathname || null,
        "search": search || null,
        "hash": hash || null
    };
    this.__getProperty = function(property) {
        return properties[property];
    };
    // Returns a clone of the properties object - this is to keep each object immutable
    // there is no write access to the core properties
    this.__getProperties = function() {
    	var clonedProperties = {};
    	for (key in properties) {
    		clonedProperties[key] = properties[key];
    	}
    	return clonedProperties;
    };
    // Returns a new set of properties with one property reassigned
    this.__setProperty = function(property, value) {
        var newProperties = this.__getProperties();
        newProperties[property] = value;
        return newProperties;
    };
};

// Getters - we mimic the behaviour of the document.location object here
// Note that some methods are aliased (such as getScheme and getProtocol)
Url.prototype.getProtocol = function() {
    return this.__getProperty('scheme');
};
Url.prototype.getScheme = Url.prototype.getProtocol;
Url.prototype.getUser = function() {
    return this.__getProperty('user');
};
Url.prototype.getAuth = function() {
    var auth = this.__getProperty('user');
    var pw = this.__getProperty('password');
    return pw ? auth+':'+pw : auth;
};
Url.prototype.getPassword = function() {
    return this.__getProperty('password');
};
Url.prototype.getHostname = function() {
    return this.__getProperty('hostname');
};
Url.prototype.getPort = function() {
    var port = this.__getProperty('port');
    if (null === port) {
        port = getDefaultPort(this.__getProperty('scheme'));
    }
    return port;
};
Url.prototype.getPathname = function() {
    return this.__getProperty('pathname') ? this.__getProperty('pathname') : "/";
};
Url.prototype.getSearch = function() {
    var search = this.__getProperty('search');
	return search ? '?'+search : null;
};
Url.prototype.hasQueryParam = function(param) {
    return this.getQueryParams()[param] !== undefined;
};
Url.prototype.getQueryParam = function(param, defaultValue) {
    if (!this.hasQueryParam(param)) {
        return defaultValue || null;
    }
    return this.getQueryParams()[param];
};
Url.prototype.getQueryParams = function() {
    var search = this.__getProperty('search');
    return qs.parse(search ? search : '');
};
Url.prototype.getPathSegment = function(index) {
    var segments = this.getPathSegments();
    return segments.length > index ? segments[index] : null;
};
Url.prototype.getPathSegments = function() {
    return this.__getProperty('pathname').substring(1).split("/");
};
Url.prototype.getSubdomain = function(index) {
    var subdomains = this.getSubdomains();
    return subdomains.length > index ? subdomains[index] : null; 
};
Url.prototype.getSubdomains = function() {
    return this.__getProperty('hostname').split(".");
};
Url.prototype.getHash = function() {
	var hash = this.__getProperty('hash');
    return hash ? '#'+hash : null;
};
Url.prototype.getFragment = Url.prototype.getHash;
Url.prototype.getHref = function() {
    var str = '';
    var scheme = this.__getProperty('scheme');
    if (scheme) {
        str += scheme+':'+getSchemeSeparator(scheme);
    }
    if (this.__getProperty('user') && this.__getProperty('password')) {
        str += this.__getProperty('user')+':'+this.__getProperty('password')+'@';
    } else if (this.__getProperty('user')) {
    	str += this.__getProperty('user')+'@';
    }
    if (this.__getProperty('hostname')) {
    	str += this.__getProperty('hostname');
    }
    if (this.__getProperty('port')) {
        str += ':'+this.__getProperty('port');
    }
    if (this.__getProperty('pathname')) {
        str += this.__getProperty('pathname');
    }
    if (this.__getProperty('search')) {
        str += '?'+this.__getProperty('search');
    }
    if (this.__getProperty('hash')) {
    	str += '#'+this.__getProperty('hash');
    }
    return str;
};
Url.prototype.toString = Url.prototype.getHref;
Url.prototype.isAbsolute = function() {
    return !!this.__getProperty('scheme');
}
Url.prototype.isRelative = function() {
    return !this.isAbsolute();
}

// Getters - these export the URL properties as public properties on the object,
// but do not allow them to be editable as we don't define a mutator.  A TypeError
// is thrown when a property is reassigned.
Url.prototype.__defineGetter__('protocol', Url.prototype.getProtocol);
Url.prototype.__defineGetter__('scheme', Url.prototype.getScheme);
Url.prototype.__defineGetter__('auth', Url.prototype.getAuth);
Url.prototype.__defineGetter__('hostname', Url.prototype.getHostname);
Url.prototype.__defineGetter__('port', Url.prototype.getPort);
Url.prototype.__defineGetter__('pathname', Url.prototype.getPathname);
Url.prototype.__defineGetter__('search', Url.prototype.getSearch);
Url.prototype.__defineGetter__('hash', Url.prototype.getHash);
Url.prototype.__defineGetter__('fragment', Url.prototype.getFragment);
Url.prototype.__defineGetter__('href', Url.prototype.getHref);

// Modification methods - these all return a new instance so as to ensure all Url objects
// are immutable
Url.prototype.setScheme = function(scheme) {
    return createFromProperties(this.__setProperty('scheme', scheme));
};
Url.prototype.setProtocol = Url.prototype.setScheme;
Url.prototype.setAuth = function(user, password) {
	var copyOfProperties = this.__setProperty('user', user);
	copyOfProperties['password'] = password;
	return createFromProperties(copyOfProperties);
};
Url.prototype.setHostname = function(hostname) {
	return createFromProperties(this.__setProperty('hostname', hostname));
};
Url.prototype.setSubdomain = function(index, newDomain) {
	var subdomains = this.getSubdomains();
	if (subdomains.length > index) {
		subdomains[index] = newDomain; 
	}
	return this.setHostname(subdomains.join('.'));
};
Url.prototype.setPathname = function(pathname) {
	return createFromProperties(this.__setProperty('pathname', pathname));
};
Url.prototype.setPathSegment = function(index, newSegment) {
	var pathSegments = this.getPathSegments();
	if (index < pathSegments.length) {
		pathSegments[index] = escape(newSegment);
	} else if (index == pathSegments.length) {
		pathSegments.push(newSegment);
	} else {
		throw new Error("Invalid path index: "+index);
	}
	return createFromProperties(this.__setProperty('pathname', '/'+pathSegments.join('/')));
};
Url.prototype.setQueryParam = function(param, value) {
	var params = this.getQueryParams();
	params[param] = value;
	return createFromProperties(this.__setProperty('search', qs.stringify(params)));
};

Url.prototype.mergeWith = function(url) {
	if (typeof url.__getProperties != 'function') {
		throw Error("Url.mergeWith must be passed a Url object");
	}
	var currentProperties = this.__getProperties();
	var mergeProperties = url.__getProperties();
    var newProperties = {};
    // If a property already exists, do not replace it
	for (key in currentProperties) {
		if (!currentProperties[key]) {
			newProperties[key] = mergeProperties[key];
		} else {
			newProperties[key] = currentProperties[key];
		}
	}
	return createFromProperties(newProperties);
};


// Factories
// =========

// Private factory used for returning modified instances
var createFromProperties = function(properties) {
	return new Url(properties['scheme'],
			 	   properties['user'],
			 	   properties['password'],
				   properties['hostname'],
				   properties['port'],
				   properties['pathname'],
				   properties['search'],
				   properties['hash']);	
};

exports.createFromString = function(urlString) {
    // Use standard url library to parse string
    var libUrl = urllib.parse(urlString, true);
    var user = libUrl.auth ? libUrl.auth.split(":")[0].toLowerCase() : null;
    // Password are not always present
    var password = null;
    if (libUrl.auth) {
    	var authParts = libUrl.auth.split(":");
    	if (authParts.length > 1) password = authParts[1].toLowerCase();
    }
    // Remove some unwanted chars from the standard properties
    var protocol = libUrl.protocol ? libUrl.protocol.replace(/:/, '').toLowerCase() : null;
    var hostname = libUrl.hostname ? libUrl.hostname.toLowerCase() : null;
    
    var pathname = libUrl.pathname ? libUrl.pathname.toLowerCase() : null;
    // Handle incorrect pathname for file URLs
    if (protocol == 'file' && pathname.substr(0, 3) == '///') {
    	pathname = pathname.substr(2);
    }
    
    var search = libUrl.search ? libUrl.search.substring(1).toLowerCase() : null;
    var hash = libUrl.hash ? libUrl.hash.substring(1).toLowerCase() : null;
    return new Url(protocol, user, password, hostname, libUrl.port, pathname, search, hash);
};
exports.parse = exports.createFromString;

// Utility
// =======

// These need expanding to cover other schemes
var getSchemeSeparator = function(scheme) {
	if (scheme == 'mailto') {
		return '';
	} else {
		return '//';
	}
};
var getDefaultPort = function(scheme) {
    var defaultPorts = {
        'http': 80,
        'https': 443,
    };
    return defaultPorts.hasOwnProperty(scheme) ? defaultPorts[scheme] : null;
}
