const fs = require('fs');
const path = require('path');
const urljoin = require('url-join');
const Url = require('url');
const conf = require('../config/app.json');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function escapeRegExp(string) {
    return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var joinURL = async (options)=>{
    var url = "/";
    if (options.prefix && !options.postfix){
        url = urljoin("/:" + options.prefix, options.main);
    } else if (!options.prefix && options.postfix){
        url = urljoin("/", options.main, "/:" + options.postfix);
    } else if (options.prefix && options.postfix){
        url = urljoin("/:" + options.prefix, options.main, "/:" + options.postfix);
    } else {
        url = urljoin("/", options.main);
    }
    console.log(url);
    return url;
}

var collectURLs = async (options) => {
    var urls = [];
    for (obj of options.array) {
        for (lang of conf.langs) {
            let main = obj[lang].url;
            let prefix = options.prefix;
            let postfix = options.postfix;
            let _url = await joinURL({prefix, main, postfix});
            if (urls.indexOf(_url)===-1){
                urls.push(_url);
            }
        }
    }
    return urls;
}

var collectURLsWithPrefix = async (arr, prefix) => {
    var urls = [];
    for (obj of arr) {
        for (lang of conf.langs) {
            var _url = path.join("/:" + prefix, obj[lang].url);
            if (urls.indexOf(_url) == -1) {
                await urls.push(_url);
            }
        }
    }
    return urls;
}

var collectURLsWithParameter = (objArr, param) => {
    var urls = [];

    for (obj of objArr) {
        for (lang of conf.langs) {
            urls.push("/" + obj[lang].url + "/:" + param);
        }
    }

    return urls;
}

var extractPages = (pages) => {
    var _pages = [
        {
            url: "/",
            name: "index",
            data: ["services", "products", "projects"],
            models: ["Service", "Product", "Project"]
        }];

    for (page of pages) {
        var _page = {
            url: page["url"] ? page["url"] : "/" + page,
            name: page["name"] ? page["name"] : page
        }

        if (page.data && page.data.length > 0) {
            for (d of data) {
                _page.models = [];
                _page.models.push(capitalize(d).slice(0, -1));
            }
        }

        _pages.push(_page);

        var _view = path.join(appRoot, "views", (page["name"] ? page["name"] : page) + ".ejs");
        if (!fs.existsSync(_view)) {
            var demoHTML = "<h1>" + capitalize((page["name"] ? page["name"] : page)) + " Page</h1>"
            fs.writeFileSync(_view, demoHTML);
        }
    }

    return _pages;
}

var extractIndexes = (indexes, indexTarget) => {
    var _indexes = [];

    for (index of indexes) {
        var _index = {
            url: index["url"] ? index["url"] : "/" + index,
            cmsUrl: index["url"] ? index["url"] : "/cms/" + index,
            name: index["name"] ? index["name"] : index,
            model: index["model"] ? index["model"] : capitalize(index.slice(0, -1)),
            target: "/" + index + "/:" + (index["target"] ? index["target"] : indexTarget)
        }
        _indexes.push(_index);
    }

    return _indexes;
}

module.exports = {
    extractPages: extractPages,
    extractIndexes: extractIndexes,
    collectURLs: collectURLs,
    collectURLsWithParameter: collectURLsWithParameter,
    collectURLsWithPrefix: collectURLsWithPrefix
}