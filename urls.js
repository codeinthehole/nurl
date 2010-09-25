var urllib = require('url'),
    qs = require('querystring');

// Url object
var Url = exports.Url = function(protocol, user, password, hostname, port, pathname, search) {
    this.protocol = protocol || null;
    this.user = user || null;
    this.password = password || null;
    this.hostname = hostname || null;
    this.port = port || null;
    this.pathname = pathname || "";
    this.search = search || "";
};

// Getters
Url.prototype.getProtocol = function() {
    return this.protocol;
};
Url.prototype.getUser = function() {
    return this.user;
};
Url.prototype.getPassword = function() {
    return this.password;
};
Url.prototype.getHostname = function() {
    return this.hostname;
};
Url.prototype.getPathname = function() {
    return this.pathname ? this.pathname : "/";
};
Url.prototype.getPort = function() {
    var port = this.port;
    if (null === this.port && this.protocol == 'http') {
        port = 80;
    } else if (null === this.port && this.protocol = 'https') {
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
    return qs.parse(this.search);
};
Url.prototype.getPathSegment = function(index) {
    var segments = this.getPathSegments();
    return segments.length > index ? segments[index] : null;
};
Url.prototype.getPathSegments = function() {
    return this.pathname.substring(1).split("/");
};
Url.prototype.getSubdomain = function(index) {
    var subdomains = this.getSubdomains();
    return subdomains.length > index ? subdomains[index] : null; 
};
Url.prototype.getSubdomains = function() {
    return this.hostname.split(".");
};
Url.prototype.toString = function() {
    var str = '';
    if (this.protocol) {
        str += this.protocol+'://';
    }
    if (this.user && this.password) {
        str += this.user+':'+this.password;
    }
    str += this.hostname;
    if (this.port) {
        str += ':'+this.port;
    }
    str += this.pathname;
    if (this.search) {
        str += '?'+this.search;
    }
    return str;
};

// Setters
Url.prototype.setProtocol = function(protocol) {
    this.protocol = protocol;
}

// Factory methods
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
