var urllib = require('url'), 
    qs = require('querystring');

// Url object
var Url = exports.Url = function(protocol, user, password, hostname, port, pathname, search) {
	// Store properties in a private variable and provide "privileged" getter and
	// setter methods to allow access.
    var properties = {
        "protocol": protocol || null,
        "user": user || null,
        "password": password || null,
        "hostname": hostname || null,
        "port": port || null,
        "pathname": pathname || "",
        "search": search || ""
    };
    this.getProperty = function(property) {
        return properties[property];
    };
    this.setProperty = function(property, value) {
        properties[property] = value;
    };
};

// Getters
Url.prototype.getProtocol = function() {
    return this.getProperty('protocol');
};
Url.prototype.getUser = function() {
    return this.getProperty('user');
};
Url.prototype.getPassword = function() {
    return this.getProperty('password');
};
Url.prototype.getHostname = function() {
    return this.getProperty('hostname');
};
Url.prototype.getPathname = function() {
    return this.getProperty('pathname') ? this.getProperty('pathname') : "/";
};
Url.prototype.getPort = function() {
    var port = this.getProperty('port');
    if (null === this.getProperty('port') && this.getProperty('protocol') == 'http') {
        port = 80;
    } else if (null === this.getProperty('port') && this.getProperty('protocol') = 'https') {
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
    return qs.parse(this.getProperty('search'));
};
Url.prototype.getPathSegment = function(index) {
    var segments = this.getPathSegments();
    return segments.length > index ? segments[index] : null;
};
Url.prototype.getPathSegments = function() {
    return this.getProperty('pathname').substring(1).split("/");
};
Url.prototype.getSubdomain = function(index) {
    var subdomains = this.getSubdomains();
    return subdomains.length > index ? subdomains[index] : null; 
};
Url.prototype.getSubdomains = function() {
    return this.getProperty('hostname').split(".");
};
Url.prototype.toString = function() {
    var str = '';
    if (this.getProperty('protocol')) {
        str += this.getProperty('protocol')+'://';
    }
    if (this.getProperty('user') && this.getProperty('password')) {
        str += this.getProperty('user')+':'+this.getProperty('password');
    }
    str += this.getProperty('hostname');
    if (this.getProperty('port')) {
        str += ':'+this.getProperty('port');
    }
    str += this.getProperty('pathname');
    if (this.getProperty('search')) {
        str += '?'+this.getProperty('search');
    }
    return str;
};

// Setters
Url.prototype.setProtocol = function(protocol) {
    this.setProperty("protocol", protocol);
}
Url.prototype.setHostname = function(hostname) {
    this.setProperty('hostname', hostname);
}

// Factories
exports.createFromString = function(urlString) {
    // Use standard url library to parse string
    var libUrl = urllib.parse(urlString, true);
    var user = libUrl.auth ? libUrl.auth.split(":")[0] : null;
    var password = libUrl.auth ? libUrl.auth.split(":")[1] : null;
    // Remove some unwanted chars from the standard properties
    var protocol = libUrl.protocol ? libUrl.protocol.replace(/:/, '') : null;
    var search = libUrl.search ? libUrl.search.substring(1) : null
    return new Url(protocol, user, password, libUrl.hostname, libUrl.port, libUrl.pathname, search);
}
