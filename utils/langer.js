const path = require('path');

function getLangFromSubdirectory(req, siteLangs, defaultLang) {
    var _lang = '';
    var _url = req.originalUrl.split("/")[1];
    
    if (siteLangs.includes(_url)) {
        _lang = _url;
    } else {
        _lang = defaultLang;
    }

    return _lang;
}

function getLangFromSubdomain(req) {
    var _lang = '';

    if (req.subdomains && req.subdomains.length > 1) {
        if (req.subdomains[0] !== "www") {
            _lang = req.subdomains[0];
        } else {
            _lang = req.subdomains[1];
        }
    }

    return _lang;
}

function getLangFromCookie(req, cookieName) {
    var _lang = '';

    if (cookieName && req.session && req.session[cookieName]) {
        _lang = req.session[cookieName];
    } else {
        if (req.cookies && cookieName in req.cookies) {
            _lang = req.cookies[cookieName].toString();
        }
    }

    return _lang;
}

function getLangFromHeaders(req, siteLangs) {
    var languagesRaw = req.headers['accept-language'] || 'NONE';
    var lparts = languagesRaw.split(',');
    var languages = [];
    var _lang = '';

    for (var x = 0; x < lparts.length; x++) {
        var unLangParts = lparts[x].split(';');
        languages.push(unLangParts[0]);
    }

    if (languages.length > 0 && siteLangs.length > 0) {
        languages.some(function (l) {
            if (siteLangs.indexOf(l) >= 0) {
                _lang = l;
                return _lang;
            }
        });
    }

    return _lang;
}

function loadLangJSONFile(langPath) {
    if (path.parse(langPath).ext !== ".json") {
        console.log('Incorrect lang-file path: missing json extension.');
    } else {
        try {
            var obj = require(langPath);
        } catch (err) {
            var obj = {};
            console.log('Langer error: missing lang JSON-file for ' + langPath);
        }

        return obj;
    }
}

exports = module.exports = function (opts) {

    var translationsPath = opts.translationsPath || 'langer';
    var cookieLangName = opts.cookieLangName || 'lang';
    var defaultLang = opts.defaultLang || 'en';
    var siteLangs = opts.siteLangs || ['en'];

    if (siteLangs.constructor !== Array) {
        throw new Error('Langer error: siteLangs must be an Array with supported langs.');
    }
    
    return function langer(req, res, next) {
        var _lang = '';

        _lang = getLangFromSubdirectory(req, siteLangs, defaultLang);

        if (_lang == '') {
            _lang = getLangFromSubdomain(req);
        }

        if (_lang == '') {
            _lang = getLangFromCookie(req, cookieLangName);
        }

        if (_lang == '') {
            _lang = getLangFromHeaders(req, siteLangs);
        }

        if (_lang.indexOf('-') > -1) {
            _lang = computedLang.split('-')[0];
        }
        
        if (!siteLangs.includes(_lang) || _lang == '') {
            _lang = defaultLang;
        }

        _lang = _lang.toLowerCase();

        var path404 = path.join(translationsPath, "404", _lang + ".json");
        res.locals.page404 = loadLangJSONFile(path404);
        res.locals.lang = _lang;
        next();
    }
};
