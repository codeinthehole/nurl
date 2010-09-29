var urllib = require('url'), 
    qs = require('querystring');

// Url object
var Url = exports.Url = function(protocol, user, password, hostname, port, pathname, search, hash) {
	// Store properties in a private variable and provide "privileged" getter method to allow access.
    var properties = {
        "protocol": protocol || null,
        "user": user || null,
        "password": password || null,
        "hostname": hostname || null,
        "port": port || null,
        "pathname": pathname || "",
        "search": search || "",
        "hash": hash || null
    };
    this.__getProperty = function(property) {
        return properties[property];
    };
    // Return a clone of the properties to keep this object immutable
    this.__setProperty = function(property, value) {
    	var clonedProperties = {};
    	for (key in properties) {
    		clonedProperties[key] = key == property ? value : properties[key];
    	}
    	return clonedProperties;
    }
};

// Getters
Url.prototype.getProtocol = function() {
    return this.__getProperty('protocol');
};
Url.prototype.getUser = function() {
    return this.__getProperty('user');
};
Url.prototype.getPassword = function() {
    return this.__getProperty('password');
};
Url.prototype.getHostname = function() {
    return this.__getProperty('hostname');
};
Url.prototype.getPathname = function() {
    return this.__getProperty('pathname') ? this.__getProperty('pathname') : "/";
};
Url.prototype.getPort = function() {
    var port = this.__getProperty('port');
    if (null === this.__getProperty('port') && this.__getProperty('protocol') == 'http') {
        port = 80;
    } else if (null === this.__getProperty('port') && this.__getProperty('protocol') == 'https') {
        port = 443;
    }
    return port;
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
    return qs.parse(this.__getProperty('search'));
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
Url.prototype.toString = function() {
    var str = '';
    if (this.__getProperty('protocol')) {
        str += this.__getProperty('protocol')+'://';
    }
    if (this.__getProperty('user') && this.__getProperty('password')) {
        str += this.__getProperty('user')+':'+this.__getProperty('password');
    }
    str += this.__getProperty('hostname');
    if (this.__getProperty('port')) {
        str += ':'+this.__getProperty('port');
    }
    str += this.__getProperty('pathname');
    if (this.__getProperty('search')) {
        str += '?'+this.__getProperty('search');
    }
    return str;
};

// Modification methods - these all return a new instance
Url.prototype.setProtocol = function(protocol) {
    return createFromProperties(this.__setProperty('protocol', protocol));
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
Url.prototype.setQueryParam = function(param, value) {
	var params = this.getQueryParams();
	params[param] = value;
	return createFromProperties(this.__setProperty('search', qs.stringify(params)));
};

// Factories
// =========

// Private factory used for returning modified instances
var createFromProperties = function(properties) {
	return new Url(properties['protocol'],
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
    var user = libUrl.auth ? libUrl.auth.split(":")[0] : null;
    var password = libUrl.auth ? libUrl.auth.split(":")[1] : null;
    // Remove some unwanted chars from the standard properties
    var protocol = libUrl.protocol ? libUrl.protocol.replace(/:/, '') : null;
    var search = libUrl.search ? libUrl.search.substring(1) : null;
    return new Url(protocol, user, password, libUrl.hostname, libUrl.port, libUrl.pathname, search);
};
