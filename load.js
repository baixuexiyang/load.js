/**
 * load.js load js and css
 * you just do like that load.sync("*.js") or load.sync("*.css")
 * if you want to async load file, you can use load.async("*.js")
 * if you have callback, load.sync("*.js", function() {})
 * url: https://github.com/baixuexiyang/load.js
 */
;(function (name, fun) {
    if(typeof module !== 'undefined' && module.exports) {
        module.exports = fun();
    } else if(typeof define === 'function' && define.amd) {
        define(fun);
    }else {
        this[name] = fun();
    }
})('load', function () {
    var load = {
        version: "1.0.0",
        cache: true,
        cacheData: [],
        sync: function(param, fun) {
            // cache
            var _this = this;
            if(typeof(param) != "object") var param = [param];
            var s = new Array(), last = param.length - 1,
            recursiveLoad = function(i) {
                if(_this.cacheData[param[i]]) {
                    param[i] = _this.cacheData[param[i]];
                }
                if(param[i].indexOf('http') > -1 && param[i].indexOf(location.host) > -1){
                // 域名是否相同，相同域名用ajax加载
                    _this.ajax(param[i], function(txt) {
                        if(param[i].indexOf('.css') > -1) {
                            _this.writeCss(txt);
                        } else {
                            _this.writeJs(txt);
                        }
                        if(i != last) {
                            recursiveLoad(i + 1);
                        } else {
                            if(typeof(fun) == "function") fun();
                        }
                    })
                } else if(param[i].indexOf('.css') > -1) {
                    // 加载css
                    _this.linkCss(param[i], function() {
                        if(i != last) {
                            recursiveLoad(i + 1);
                        } else {
                            if(typeof(fun) == "function") fun();
                        }
                    });
                } else if(param[i].indexOf('.js') > -1) {
                    // 加载js
                    _this.linkJs(param[i], function() {
                        if(i != last) {
                            recursiveLoad(i + 1);
                        } else {
                            if(typeof(fun) == "function") fun();
                        }
                    });
                }
            };
            recursiveLoad(0);
        },
        register: function(name, url) {
            this.cacheData[name] = url;
        },
        async: function(param, fun) {
            var _this = this;
            if(typeof(param) != "object") var param = [param];
            var s = new Array(), last = param.length - 1,
            recursiveLoad = function(i) {
                if(_this.cacheData[param[i]]) {
                    param[i] = _this.cacheData[param[i]];
                }
                if(param[i].indexOf('http') > -1 && param[i].indexOf(location.host) > -1){
                // 域名是否相同，相同域名用ajax加载
                    _this.ajax(param[i], function(txt) {
                        if(param[i].indexOf('.css') > -1) {
                            _this.writeCss(txt);
                        } else {
                            _this.writeJs(txt);
                        }
                    });
                    
                } else if(param[i].indexOf('.css') > -1) {
                    // 加载css
                    _this.linkCss(param[i]);
                } else if(param[i].indexOf('.js') > -1) {
                    // 加载js
                    _this.linkJs(param[i]);
                }
                if(i != last) {
                    recursiveLoad(i + 1);
                } else {
                    if(typeof(fun) == "function") fun();
                }
            };
            recursiveLoad(0);
        },
        ajax: function(url, callback) {
            if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            if (xhr != null) {
                xhr.open("GET", url);
                xhr.send(null);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        if (callback != null) {
                            callback(xhr.responseText);
                        }
                    }
                };
            }
        },
        writeJs: function(txt) {
            var head = document.getElementsByTagName("body").item(0) || document.documentElement;
            var link = document.createElement("script");
            link.type = "text/javascript";
            link.innerHTML = txt;
            head.appendChild(link);
        },
        writeCss: function(txt) {
            var head = document.getElementsByTagName("body").item(0) || document.documentElement;
            var link = document.createElement("style");
            link.type = "text/css";
            link.innerHTML = txt;
            head.appendChild(link);
        },
        linkJs: function(url, callback) {
            var head = document.getElementsByTagName("body").item(0) || document.documentElement;
            var link = document.createElement("script");
            link.type = "text/javascript";
            link.onload = link.onreadystatechange = function() {
                // if(this.readyState == "loaded" || this.readyState == "complete") {
                    this.onload = this.onreadystatechange = null;
                    // this.parentNode.removeChild(this);
                    if(typeof(callback) == "function") callback();
                // }
            }
            link.src = url;
            head.appendChild(link);
        },
        linkCss: function(url, callback) {
            var head = document.getElementsByTagName("body").item(0) || document.documentElement;
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.rev = "stylesheet";
            link.media = "screen";
            link.onload = link.onreadystatechange = function() {
                // if(this.readyState == "loaded" || this.readyState == "complete") {
                    this.onload = this.onreadystatechange = null;
                    // this.parentNode.removeChild(this);
                    if(typeof(callback) == "function") callback();
                // }
            }
            link.href = url;
            head.appendChild(link);
        }
    };
    return load;
    // load.prototype.storeData = [];
    // // store file to localstorage
    // load.prototype.store = function(name, txt, force) {
    //     this.storeData[name] = true;
    //     localStorage.setItem(name, js);
    //     localStorage.setItem("version", whir.res.pageVersion);
    // }
});
