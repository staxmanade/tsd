var xm;
(function (xm) {
    function callAsync(callback) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        process.nextTick(function () {
            callback.apply(null, args);
        });
    }
    xm.callAsync = callAsync;
})(xm || (xm = {}));
var xm;
(function (xm) {
    var fs = require('fs');
    var path = require('path');
    var util = require('util');
    var FileUtil = (function () {
        function FileUtil() { }
        FileUtil.readJSONSync = function readJSONSync(src) {
            return JSON.parse(fs.readFileSync(src, 'utf8'));
        };
        FileUtil.readJSON = function readJSON(src, callback) {
            fs.readFile(path.resolve(src), 'utf8', function (err, file) {
                if(err || !file) {
                    return callback(err, null);
                }
                var json = null;
                try  {
                    json = JSON.parse(file);
                } catch (err) {
                    return callback(err, null);
                }
                return callback(null, json);
            });
        };
        FileUtil.writeJSONSync = function writeJSONSync(src, data, callback) {
            fs.writeFileSync(path.resolve(src), JSON.stringify(data, null, 2), 'utf8');
        };
        FileUtil.writeJSON = function writeJSON(src, data, callback) {
            fs.writeFile(path.resolve(src), JSON.stringify(data, null, 2), 'utf8', callback);
        };
        return FileUtil;
    })();
    xm.FileUtil = FileUtil;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    function eachElem(collection, callback, thisArg) {
        if (typeof thisArg === "undefined") { thisArg = null; }
        for(var i = 0, ii = collection.length; i < ii; i++) {
            if(callback.call(thisArg, collection[i], i, collection) === false) {
                return;
            }
        }
    }
    xm.eachElem = eachElem;
    function eachProp(collection, callback, thisArg) {
        if (typeof thisArg === "undefined") { thisArg = null; }
        for(var key in collection) {
            if(collection.hasOwnProperty(key)) {
                if(callback.call(thisArg, collection[key], key, collection) === false) {
                    return;
                }
            }
        }
    }
    xm.eachProp = eachProp;
    function reduceArray(collection, memo, callback, thisArg) {
        if (typeof thisArg === "undefined") { thisArg = null; }
        for(var i = 0, ii = collection.length; i < ii; i++) {
            memo = callback.call(thisArg, memo, collection[i], i, collection);
        }
        return memo;
    }
    xm.reduceArray = reduceArray;
    function reduceHash(collection, memo, callback, thisArg) {
        if (typeof thisArg === "undefined") { thisArg = null; }
        for(var key in collection) {
            if(collection.hasOwnProperty(key)) {
                memo = callback.call(thisArg, memo, collection[key], key, collection);
            }
        }
        return memo;
    }
    xm.reduceHash = reduceHash;
    function mapArray(collection, callback, thisArg) {
        if (typeof thisArg === "undefined") { thisArg = null; }
        var map = [];
        for(var i = 0, ii = collection.length; i < ii; i++) {
            map[i] = callback.call(thisArg, map[i], i, collection);
        }
        return map;
    }
    xm.mapArray = mapArray;
    function mapHash(collection, callback, thisArg) {
        if (typeof thisArg === "undefined") { thisArg = null; }
        var map = {
        };
        for(var key in collection) {
            if(collection.hasOwnProperty(key)) {
                map[key] = callback.call(thisArg, collection[key], key, collection);
            }
        }
        return map;
    }
    xm.mapHash = mapHash;
})(xm || (xm = {}));
var xm;
(function (xm) {
    var util = require('util');
    require('colors');
    var ConsoleLineWriter = (function () {
        function ConsoleLineWriter() { }
        ConsoleLineWriter.prototype.writeln = function (str) {
            console.log(str);
        };
        return ConsoleLineWriter;
    })();
    xm.ConsoleLineWriter = ConsoleLineWriter;    
    function getLogger(label, writer) {
        writer = writer || new xm.ConsoleLineWriter();
        label = arguments.length > 0 ? (String(label) + ': ').cyan : '';
        var writeMulti = function (prefix, postfix, args) {
            if(logger.mute) {
                return;
            }
            var ret = [];
            for(var i = 0, ii = args.length; i < ii; i++) {
                var value = args[i];
                if(value && typeof value === 'object') {
                    ret.push(util.inspect(value, {
                        showHidden: false,
                        depth: 8
                    }));
                } else {
                    ret.push(value);
                }
            }
            writer.writeln(label + prefix + ret.join('; ') + postfix);
        };
        var plain = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            writeMulti('', '', args);
        };
        var logger = (function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            plain.apply(null, args);
        });
        logger.log = plain;
        logger.mute = false;
        logger.ok = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            writeMulti('ok: '.green, '', args);
        };
        logger.warn = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            writeMulti('warn: '.yellow, '', args);
        };
        logger.error = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            writeMulti('error: '.red, '', args);
        };
        logger.debug = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            writeMulti('debug: '.cyan, '', args);
        };
        logger.inspect = function (value, label, depth) {
            if (typeof depth === "undefined") { depth = 8; }
            label = label ? label + ':\n' : '';
            writer.writeln(label + util.inspect(value, {
                showHidden: false,
                depth: depth
            }));
        };
        return logger;
    }
    xm.getLogger = getLogger;
    xm.log = getLogger();
})(xm || (xm = {}));
var xm;
(function (xm) {
    var Q = require('q');
    var FS = require('q-io/fs');
    var mkdirp = require('mkdirp');
    var path = require('path');
    var fs = require('fs');
    function mkdirCheckSync(dir, writable) {
        if (typeof writable === "undefined") { writable = false; }
        dir = path.resolve(dir);
        if(fs.existsSync(dir)) {
            if(!fs.statSync(dir).isDirectory()) {
                throw (new Error('path exists but is not a directory: ' + dir));
            }
            if(writable) {
                fs.chmodSync(dir, '0664');
            }
        } else {
            if(writable) {
                mkdirp.sync(dir, '0664');
            } else {
                mkdirp.sync(dir);
            }
        }
        if(writable) {
            var testFile = path.join(dir, 'mkdirCheck_' + Math.round(Math.random() * Math.pow(10, 10)).toString(16) + '.tmp');
            try  {
                fs.writeFileSync(testFile, 'test');
                fs.unlinkSync(testFile);
            } catch (e) {
                throw new Error('no write access to: ' + dir + ' -> ' + e);
            }
        }
        return dir;
    }
    xm.mkdirCheckSync = mkdirCheckSync;
    function mkdirCheckQ(dir, writable) {
        if (typeof writable === "undefined") { writable = false; }
        dir = path.resolve(dir);
        return FS.exists(dir).then(function (exists) {
            if(exists) {
                return FS.isDirectory(dir).then(function (isDir) {
                    if(!isDir) {
                        throw (new Error('path exists but is not a directory: ' + dir));
                    }
                    if(writable) {
                        return FS.chmod(dir, '0664');
                    }
                    return null;
                });
            }
            if(writable) {
                return Q.nfcall(mkdirp, dir, '0664');
            }
            return Q.nfcall(mkdirp, dir);
        }).then(function () {
            if(writable) {
                var testFile = path.join(dir, 'mkdirCheck_' + Math.round(Math.random() * Math.pow(10, 10)).toString(16) + '.tmp');
                return FS.write(testFile, 'test').then(function () {
                    return FS.remove(testFile);
                }).catch(function (err) {
                    throw new Error('no write access to: ' + dir + ' -> ' + err);
                });
            }
            return null;
        }).thenResolve(dir);
    }
    xm.mkdirCheckQ = mkdirCheckQ;
})(xm || (xm = {}));
var xm;
(function (xm) {
    var fs = require('fs');
    var path = require('path');
    var pkginfo = require('pkginfo');
    var PackageJSON = (function () {
        function PackageJSON(pkg, path) {
            if (typeof path === "undefined") { path = null; }
            this.pkg = pkg;
            this.path = path;
            if(!this.pkg) {
                throw new Error('no pkg');
            }
        }
        Object.defineProperty(PackageJSON.prototype, "name", {
            get: function () {
                return this.pkg.name || null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PackageJSON.prototype, "description", {
            get: function () {
                return this.pkg.description || '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PackageJSON.prototype, "version", {
            get: function () {
                return this.pkg.version || '0.0.0';
            },
            enumerable: true,
            configurable: true
        });
        PackageJSON.prototype.getNameVersion = function () {
            return this.name + ' ' + this.version;
        };
        PackageJSON.prototype.getKey = function () {
            return this.name + '-' + this.version;
        };
        PackageJSON.find = function find() {
            return pkginfo.find((module));
        };
        PackageJSON.getLocal = function getLocal() {
            if(!PackageJSON._local) {
                var src = PackageJSON.find();
                if(!src) {
                    throw (new Error('cannot find local package.json'));
                }
                PackageJSON._local = new PackageJSON(xm.FileUtil.readJSONSync(src), src);
            }
            return PackageJSON._local;
        };
        return PackageJSON;
    })();
    xm.PackageJSON = PackageJSON;    
})(xm || (xm = {}));
var tsd;
(function (tsd) {
    var fs = require('fs');
    var path = require('path');
    var util = require('util');
    var assert = require('assert');
    var tv4 = require('tv4').tv4;
    var Config = (function () {
        function Config(schema) {
            this.schema = schema;
            this.typingsPath = 'typings';
            this.version = 'v4';
            this.repo = 'borisyankov/DefinitelyTyped';
            this.ref = 'master';
            xm.assertVar('schema', schema, 'object');
        }
        Object.defineProperty(Config.prototype, "repoOwner", {
            get: function () {
                return this.repo.split('/')[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "repoProject", {
            get: function () {
                return this.repo.split('/')[1];
            },
            enumerable: true,
            configurable: true
        });
        Config.prototype.toJSON = function () {
            var json = {
                typingsPath: this.typingsPath,
                version: this.version,
                repo: this.repo,
                ref: this.ref,
                installed: {
                }
            };
            return json;
        };
        Config.getLocal = function getLocal(schema, file) {
            xm.assertVar('schema', schema, 'object');
            xm.assertVar('file', file, 'string');
            var cfg = new Config(schema);
            var json;
            if(fs.existsSync(file)) {
                var stats = fs.statSync(file);
                if(stats.isDirectory()) {
                    throw (new Error('config path exists but is a directory: ' + file));
                }
                json = xm.FileUtil.readJSONSync(file);
                var res = tv4.validateResult(json, schema);
                if(!res.valid || res.missing.length > 0) {
                    console.log(res.error.message);
                    if(res.error.dataPath) {
                        console.log(res.error.dataPath);
                    }
                    if(res.error.schemaPath) {
                        console.log(res.error.schemaPath);
                    }
                    throw (new Error('malformed config: doesn\'t comply with schema'));
                }
                cfg.typingsPath = json.typingsPath;
                cfg.version = json.version;
                cfg.repo = json.repo;
                cfg.ref = json.ref;
            }
            return cfg;
        };
        return Config;
    })();
    tsd.Config = Config;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var fs = require('fs');
    var os = require('os');
    var path = require('path');
    var Paths = (function () {
        function Paths(info) {
            this.info = info;
            xm.assertVar('info', info, xm.PackageJSON);
            this.setTmp(Paths.findTmpDir(info));
            this.setCache(path.join(this.tmp, 'cache'));
            this.typings = xm.mkdirCheckSync(path.resolve(process.cwd(), 'typings'), true);
            this.config = path.join(process.cwd(), 'tsd-config.json');
        }
        Paths.prototype.setTmp = function (dir) {
            dir = xm.mkdirCheckSync(dir, true);
            this.tmp = dir;
            return this.tmp;
        };
        Paths.prototype.setCache = function (dir) {
            dir = xm.mkdirCheckSync(dir, true);
            this.cache = dir;
            return dir;
        };
        Paths.findTmpDir = function findTmpDir(info) {
            xm.assertVar('info', info, xm.PackageJSON);
            var now = Date.now();
            var candidateTmpDirs = [
                process.env['TMPDIR'], 
                info.pkg.tmp, 
                os.tmpdir(), 
                path.resolve(process.cwd(), 'tmp')
            ];
            var key = info.getKey();
            for(var i = 0; i < candidateTmpDirs.length; i++) {
                if(!candidateTmpDirs[i]) {
                    continue;
                }
                var candidatePath = path.resolve(candidateTmpDirs[i], key);
                try  {
                    xm.mkdirCheckSync(candidatePath);
                    return candidatePath;
                } catch (e) {
                    console.log(candidatePath, 'is not writable:', e.message);
                }
            }
            throw (new Error('can not find a writable tmp directory.'));
        };
        return Paths;
    })();
    tsd.Paths = Paths;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var fs = require('fs');
    var path = require('path');
    var util = require('util');
    var assert = require('assert');
    var Q = require('Q');
    var tv4 = require('tv4').tv4;
    require('source-map-support').install();
    process.setMaxListeners(20);
    var Context = (function () {
        function Context(configPath, verbose) {
            if (typeof configPath === "undefined") { configPath = null; }
            if (typeof verbose === "undefined") { verbose = false; }
            this.verbose = verbose;
            this.log = xm.log;
            xm.assertVar('configPath', configPath, 'string', true);
            this.packageInfo = xm.PackageJSON.getLocal();
            this.paths = new tsd.Paths(this.packageInfo);
            var schema = xm.FileUtil.readJSONSync(path.resolve(path.dirname(this.packageInfo.path), 'schema', 'tsd-config_v4.json'));
            this.config = tsd.Config.getLocal(schema, configPath || this.paths.config);
            this.paths.typings = xm.mkdirCheckSync(this.config.typingsPath, true);
            Q.longStackSupport = true;
            if(this.verbose) {
                this.logInfo(true);
            }
        }
        Context.prototype.logInfo = function (details) {
            if (typeof details === "undefined") { details = false; }
            this.log(this.packageInfo.getNameVersion());
            this.log('repo: ' + this.config.repo + ' - #' + this.config.ref);
            if(details) {
                this.log.inspect(this.config, 'config');
                this.log.inspect(this.paths, 'paths');
            }
        };
        return Context;
    })();
    tsd.Context = Context;    
})(tsd || (tsd = {}));
var xm;
(function (xm) {
    var hasOwnProp = Object.prototype.hasOwnProperty;
    var KeyValueMap = (function () {
        function KeyValueMap(data) {
            this._prefix = '#';
            this._store = {
            };
            if(data) {
                this.import(data);
            }
        }
        KeyValueMap.prototype.has = function (key) {
            if(typeof key === 'undefined') {
                return false;
            }
            key = this._prefix + key;
            return hasOwnProp.call(this._store, key);
        };
        KeyValueMap.prototype.get = function (key, alt) {
            if (typeof alt === "undefined") { alt = undefined; }
            if(typeof key === 'undefined') {
                return alt;
            }
            key = this._prefix + key;
            if(hasOwnProp.call(this._store, key)) {
                return this._store[key];
            }
            return alt;
        };
        KeyValueMap.prototype.set = function (key, value) {
            if(typeof key === 'undefined') {
                return;
            }
            key = this._prefix + key;
            this._store[key] = value;
        };
        KeyValueMap.prototype.remove = function (key) {
            if(typeof key === 'undefined') {
                return;
            }
            key = this._prefix + key;
            if(hasOwnProp.call(this._store, key)) {
                delete this._store[key];
            }
        };
        KeyValueMap.prototype.keys = function () {
            var len = this._prefix.length;
            var ret = [];
            for(var key in this._store) {
                if(hasOwnProp.call(this._store, key)) {
                    ret.push(key.substr(len));
                }
            }
            return ret;
        };
        KeyValueMap.prototype.values = function (allow) {
            var keys = this.keys();
            var ret = [];
            for(var i = 0, ii = keys.length; i < ii; i++) {
                var key = keys[i];
                if(!allow || allow.indexOf(key) > -1) {
                    ret.push(this.get(key));
                }
            }
            return ret;
        };
        KeyValueMap.prototype.clear = function (keep) {
            var keys = this.keys();
            for(var i = 0, ii = keys.length; i < ii; i++) {
                var key = keys[i];
                if(!keep || keep.indexOf(key) > -1) {
                    this.remove(key);
                }
            }
        };
        KeyValueMap.prototype.import = function (data, allow) {
            if(typeof data !== 'object') {
                return;
            }
            for(var key in data) {
                if(hasOwnProp.call(data, key) && (!allow || allow.indexOf(key) > -1)) {
                    this.set(key, data[key]);
                }
            }
        };
        KeyValueMap.prototype.export = function (allow) {
            var ret = {
            };
            var keys = this.keys();
            for(var i = 0, ii = keys.length; i < ii; i++) {
                var key = keys[i];
                if(!allow || allow.indexOf(key) > -1) {
                    ret[key] = this.get(key);
                }
            }
            return ret;
        };
        return KeyValueMap;
    })();
    xm.KeyValueMap = KeyValueMap;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    var StatCounter = (function () {
        function StatCounter(log) {
            if (typeof log === "undefined") { log = false; }
            this.log = log;
            this.stats = new xm.KeyValueMap();
            this.logger = xm.log;
        }
        StatCounter.prototype.count = function (id, amount) {
            if (typeof amount === "undefined") { amount = 1; }
            var value = this.stats.get(id, 0) + amount;
            this.stats.set(id, value);
            if(this.log && this.logger) {
                this.logger('-> ' + id + ': ' + this.stats.get(id));
            }
            return value;
        };
        StatCounter.prototype.get = function (id) {
            return this.stats.get(id, 0);
        };
        StatCounter.prototype.zero = function () {
            var _this = this;
            this.stats.keys().forEach(function (id) {
                _this.stats.set(id, 0);
            });
        };
        StatCounter.prototype.hasAllZero = function () {
            return !this.stats.values().some(function (value) {
                return value !== 0;
            });
        };
        StatCounter.prototype.clear = function () {
            this.stats.clear();
        };
        StatCounter.prototype.getReport = function (label) {
            var _this = this;
            var ret = [];
            var keys = this.stats.keys();
            keys.sort();
            keys.forEach(function (id) {
                ret.push(id + ': ' + _this.stats.get(id));
            });
            return (label ? label + ':\n' : '') + ret.join('\n');
        };
        return StatCounter;
    })();
    xm.StatCounter = StatCounter;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    function assertVar(label, value, type, opt) {
        if (typeof opt === "undefined") { opt = false; }
        var valueType = typeof value;
        var typeKind = typeof type;
        if(!value && (valueType === 'undefined' || valueType === 'object')) {
            if(!opt) {
                throw (new Error('expected "' + label + '" to be defined but got "' + value + '"'));
            }
        } else if(typeKind === 'function') {
            if(value.constructor instanceof type) {
                throw (new Error('expected "' + label + '" to be instanceof "' + type + '" but got "' + value.constructor + '": ' + value));
            }
        } else if(typeKind === 'string') {
            if(valueType !== type) {
                throw (new Error('expected "' + label + '" to be typeof "' + type + '" but got "' + valueType + '": ' + value));
            }
        } else {
            throw (new Error('bad type assertion parameter "' + type + '" for "' + label + '"'));
        }
    }
    xm.assertVar = assertVar;
})(xm || (xm = {}));
var xm;
(function (xm) {
    var _ = require('underscore');
    function md5(data) {
        var crypto = require('crypto');
        return crypto.createHash('md5').update(data).digest('hex');
    }
    xm.md5 = md5;
    function sha1(data) {
        var crypto = require('crypto');
        return crypto.createHash('sha1').update(data).digest('hex');
    }
    xm.sha1 = sha1;
    function jsonToIdent(obj) {
        var ret = '';
        var sep = ';';
        var type = typeof obj;
        if(type === 'string') {
            ret += JSON.stringify(obj) + sep;
        } else if(type === 'number') {
            ret += JSON.stringify(obj) + sep;
        } else if(type === 'boolean') {
            ret += String(obj) + sep;
        } else if(_.isDate(obj)) {
            ret += '<Date>' + obj.getTime() + sep;
        } else if(_.isArray(obj)) {
            ret += '[';
            _.forEach(obj, function (value) {
                ret += jsonToIdent(value);
            });
            ret += ']' + sep;
        } else if(type === 'function') {
            throw (new Error('jsonToIdent: cannot serialise Function'));
        } else if(_.isRegExp(obj)) {
            throw (new Error('jsonToIdent: cannot serialise RegExp'));
        } else if(_.isObject(obj)) {
            var keys = _.keys(obj);
            keys.sort();
            ret += '{';
            _.forEach(keys, function (key) {
                ret += JSON.stringify(key) + ':' + jsonToIdent(obj[key]);
            });
            ret += '}' + sep;
        } else {
            throw (new Error('jsonToIdent: cannot serialise value: ' + obj));
        }
        return ret;
    }
    xm.jsonToIdent = jsonToIdent;
})(xm || (xm = {}));
var git;
(function (git) {
    var GithubAPICachedResult = (function () {
        function GithubAPICachedResult(label, key, data) {
            xm.assertVar('label', label, 'string');
            xm.assertVar('key', key, 'string');
            xm.assertVar('data', data, 'object');
            this._label = label;
            this._key = key;
            this.setData(data);
        }
        GithubAPICachedResult.prototype.setData = function (data) {
            xm.assertVar('data', data, 'object');
            this._data = data;
            this._lastSet = new Date();
        };
        GithubAPICachedResult.prototype.toJSON = function () {
            return {
                key: this.key,
                hash: this.getHash(),
                data: this.data,
                label: this.label,
                lastSet: this.lastSet.getTime()
            };
        };
        GithubAPICachedResult.fromJSON = function fromJSON(json) {
            xm.assertVar('label', json.label, 'string');
            xm.assertVar('key', json.key, 'string');
            xm.assertVar('data', json.data, 'object');
            xm.assertVar('lastSet', json.lastSet, 'number');
            var call = new git.GithubAPICachedResult(json.label, json.key, json.data);
            call._lastSet = new Date(json.lastSet);
            return call;
        };
        GithubAPICachedResult.getHash = function getHash(key) {
            return xm.sha1(key);
        };
        GithubAPICachedResult.prototype.getHash = function () {
            return GithubAPICachedResult.getHash(this._key);
        };
        Object.defineProperty(GithubAPICachedResult.prototype, "label", {
            get: function () {
                return this._label;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GithubAPICachedResult.prototype, "key", {
            get: function () {
                return this._key;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GithubAPICachedResult.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GithubAPICachedResult.prototype, "lastSet", {
            get: function () {
                return this._lastSet;
            },
            enumerable: true,
            configurable: true
        });
        return GithubAPICachedResult;
    })();
    git.GithubAPICachedResult = GithubAPICachedResult;    
})(git || (git = {}));
var git;
(function (git) {
    var Q = require('q');
    var assert = require('assert');
    var fs = require('fs');
    var path = require('path');
    var FS = require('q-io/fs');
    var GithubAPICachedJSONStore = (function () {
        function GithubAPICachedJSONStore(api, dir) {
            this.api = api;
            this._formatVersion = '0.0.2';
            xm.assertVar('api', api, git.GithubAPICached);
            xm.assertVar('dir', dir, 'string');
            this.dir = path.join(dir, api.getCacheKey() + '-fmt' + this._formatVersion);
        }
        GithubAPICachedJSONStore.prototype.init = function () {
            var _this = this;
            return FS.exists(this.dir).then(function (exists) {
                if(!exists) {
                    return xm.mkdirCheckQ(_this.dir);
                } else {
                    return FS.isDirectory(_this.dir).then(function (isDir) {
                        if(isDir) {
                            return null;
                        } else {
                            throw new Error('is not a directory: ' + _this.dir);
                        }
                    });
                }
            });
        };
        GithubAPICachedJSONStore.prototype.getResult = function (key) {
            var src = path.join(this.dir, git.GithubAPICachedResult.getHash(key) + '.json');
            return this.init().then(function () {
                return FS.exists(src);
            }).then(function (exists) {
                if(exists) {
                    return Q.nfcall(xm.FileUtil.readJSON, src).then(function (json) {
                        var cached;
                        try  {
                            cached = git.GithubAPICachedResult.fromJSON(json);
                        } catch (e) {
                            throw (new Error(src + ':' + e));
                        }
                        return cached;
                    });
                } else {
                    return null;
                }
            });
        };
        GithubAPICachedJSONStore.prototype.storeResult = function (res) {
            var src = path.join(this.dir, res.getHash() + '.json');
            return this.init().then(function () {
                var data = JSON.stringify(res.toJSON(), null, 2);
                return FS.write(src, data);
            }).then(function () {
                return {
                    src: src
                };
            });
        };
        return GithubAPICachedJSONStore;
    })();
    git.GithubAPICachedJSONStore = GithubAPICachedJSONStore;    
})(git || (git = {}));
var xm;
(function (xm) {
    var uriTemplates = require('uri-templates');
    var URLManager = (function () {
        function URLManager(common) {
            this._templates = new xm.KeyValueMap();
            this._vars = {
            };
            if(common) {
                this.setVars(common);
            }
        }
        URLManager.prototype.addTemplate = function (id, url) {
            if(this._templates.has(id)) {
                throw (new Error('cannot redefine template: ' + id));
            }
            this._templates.set(id, uriTemplates(url));
        };
        URLManager.prototype.setVar = function (id, value) {
            this._vars[id] = '' + value;
        };
        URLManager.prototype.getVar = function (id) {
            if(this._vars.hasOwnProperty(id)) {
                return this._vars[id];
            }
            return null;
        };
        URLManager.prototype.setVars = function (map) {
            for(var id in map) {
                if(map.hasOwnProperty(id)) {
                    this.setVar(id, map[id]);
                }
            }
        };
        URLManager.prototype.getTemplate = function (id) {
            if(!this._templates.has(id)) {
                throw (new Error('undefined url template: ' + id));
            }
            return this._templates.get(id);
        };
        URLManager.prototype.getURL = function (id, vars) {
            if(vars) {
                return this.getTemplate(id).fillFromObject(_.defaults(vars, this._vars));
            }
            return this.getTemplate(id).fillFromObject(this._vars);
        };
        return URLManager;
    })();
    xm.URLManager = URLManager;    
})(xm || (xm = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var git;
(function (git) {
    var assert = require('assert');
    var _ = require('underscore');
    var GithubURLManager = (function (_super) {
        __extends(GithubURLManager, _super);
        function GithubURLManager(repo) {
                _super.call(this);
            this._base = 'https://github.com/{owner}/{project}';
            this._api = 'https://api.github.com/repos/{owner}/{project}';
            this._raw = 'https://raw.github.com/{owner}/{project}';
            xm.assertVar('repo', repo, git.GithubRepo);
            this.setVars({
                owner: repo.ownerName,
                project: repo.projectName
            });
            this.addTemplate('api', this._api);
            this.addTemplate('base', this._base);
            this.addTemplate('raw', this._raw);
            this.addTemplate('rawFile', this._raw + '/{commit}/{+path}');
        }
        GithubURLManager.prototype.api = function () {
            return this.getURL('api');
        };
        GithubURLManager.prototype.base = function () {
            return this.getURL('base');
        };
        GithubURLManager.prototype.raw = function () {
            return this.getURL('raw');
        };
        GithubURLManager.prototype.rawFile = function (commit, path) {
            return this.getURL('rawFile', {
                commit: commit,
                path: path
            });
        };
        return GithubURLManager;
    })(xm.URLManager);
    git.GithubURLManager = GithubURLManager;    
})(git || (git = {}));
var git;
(function (git) {
    var GithubRepo = (function () {
        function GithubRepo(ownerName, projectName) {
            this.ownerName = ownerName;
            this.projectName = projectName;
            xm.assertVar('ownerName', ownerName, 'string');
            xm.assertVar('projectName', projectName, 'string');
            this.urls = new git.GithubURLManager(this);
        }
        GithubRepo.prototype.getCacheKey = function () {
            return this.ownerName + '-' + this.projectName;
        };
        GithubRepo.prototype.toString = function () {
            return this.ownerName + '/' + this.projectName;
        };
        return GithubRepo;
    })();
    git.GithubRepo = GithubRepo;    
})(git || (git = {}));
var git;
(function (git) {
    var async = require('async');
    var _ = require('underscore');
    var Q = require('q');
    var assert = require('assert');
    var fs = require('fs');
    var path = require('path');
    var Github = require('github');
    var GithubAPICached = (function () {
        function GithubAPICached(repo, storeFolder) {
            this._apiVersion = '3.0.0';
            this._defaultOpts = {
            };
            this._debug = false;
            this.stats = new xm.StatCounter(false);
            xm.assertVar('repo', repo, git.GithubRepo);
            xm.assertVar('storeFolder', storeFolder, 'string');
            this._repo = repo;
            this._api = new Github({
                version: this._apiVersion
            });
            this._store = new git.GithubAPICachedJSONStore(this, storeFolder);
            this.rate = new GitRateLimitInfo();
        }
        GithubAPICached.prototype.getRepoParams = function (vars) {
            return _.defaults(vars, {
                user: this._repo.ownerName,
                repo: this._repo.projectName
            });
        };
        GithubAPICached.prototype.getCachedRaw = function (key) {
            return this._store.getResult(key);
        };
        GithubAPICached.prototype.getKey = function (label, keyTerms) {
            return xm.jsonToIdent([
                label, 
                keyTerms ? keyTerms : {
                }
            ]);
        };
        GithubAPICached.prototype.getBranches = function () {
            var _this = this;
            var params = this.getRepoParams({
            });
            return this.doCachedCall('getBranches', params, {
            }, function (cb) {
                _this._api.repos.getBranches(params, cb);
            });
        };
        GithubAPICached.prototype.getBranch = function (branch) {
            var _this = this;
            var params = this.getRepoParams({
                branch: branch
            });
            return this.doCachedCall('getBranch', params, {
            }, function (cb) {
                _this._api.repos.getBranch(params, cb);
            });
        };
        GithubAPICached.prototype.getTree = function (sha, recursive) {
            var _this = this;
            var params = this.getRepoParams({
                sha: sha,
                recursive: recursive
            });
            return this.doCachedCall('getTree', params, {
            }, function (cb) {
                _this._api.data.getTree(params, cb);
            });
        };
        GithubAPICached.prototype.getCommit = function (sha) {
            var _this = this;
            var params = this.getRepoParams({
                sha: sha
            });
            return this.doCachedCall('getCommit', params, {
            }, function (cb) {
                _this._api.data.getCommit(params, cb);
            });
        };
        GithubAPICached.prototype.getBlob = function (sha) {
            var _this = this;
            var params = this.getRepoParams({
                sha: sha,
                per_page: 100
            });
            return this.doCachedCall('getBlob', params, {
            }, function (cb) {
                _this._api.data.getBlob(params, cb);
            });
        };
        GithubAPICached.prototype.getCommits = function (sha) {
            var _this = this;
            var params = this.getRepoParams({
                per_page: 100,
                sha: sha
            });
            return this.doCachedCall('getCommits', params, {
            }, function (cb) {
                _this._api.repos.getCommits(params, cb);
            });
        };
        GithubAPICached.prototype.getPathCommits = function (sha, path) {
            var _this = this;
            var params = this.getRepoParams({
                per_page: 100,
                sha: sha,
                path: path
            });
            return this.doCachedCall('getCommits', params, {
            }, function (cb) {
                _this._api.repos.getCommits(params, cb);
            });
        };
        GithubAPICached.prototype.doCachedCall = function (label, keyTerms, opts, call) {
            var _this = this;
            var key = this.getKey(label, keyTerms);
            opts = _.defaults(opts || {
            }, this._defaultOpts);
            this.stats.count('invoked');
            var defer = Q.defer();
            var execCall = function () {
                _this.stats.count('call-api');
                call.call(null, function (err, res) {
                    _this.rate.readFromRes(res);
                    if(_this._debug) {
                        xm.log(_this.rate.toStatus());
                    }
                    if(err) {
                        _this.stats.count('call-error');
                        defer.reject(err);
                        return;
                    }
                    _this.stats.count('call-success');
                    var cached = new git.GithubAPICachedResult(label, key, res);
                    _this._store.storeResult(cached).then(function (info) {
                        if(err) {
                            _this.stats.count('store-set-error');
                            defer.reject(err);
                        } else {
                            _this.stats.count('store-set');
                            defer.resolve(res);
                        }
                    });
                });
            };
            this._store.getResult(key).then(function (res) {
                if(res) {
                    _this.stats.count('store-hit');
                    defer.resolve(res.data);
                } else {
                    _this.stats.count('store-miss');
                    execCall();
                }
            }, function (err) {
                _this.stats.count('store-get-error');
                defer.reject(err);
            });
            return defer.promise;
        };
        Object.defineProperty(GithubAPICached.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (value) {
                this._debug = value;
                this.stats.log = value;
            },
            enumerable: true,
            configurable: true
        });
        GithubAPICached.prototype.getCacheKey = function () {
            return this._repo.getCacheKey() + '-api' + this._apiVersion;
        };
        return GithubAPICached;
    })();
    git.GithubAPICached = GithubAPICached;    
    var GitRateLimitInfo = (function () {
        function GitRateLimitInfo() {
            this.limit = 0;
            this.remaining = 0;
            this.lastUpdate = new Date();
        }
        GitRateLimitInfo.prototype.readFromRes = function (response) {
            if(response && _.isObject(response.meta)) {
                if(response.meta.hasOwnProperty('x-ratelimit-limit')) {
                    this.limit = parseInt(response.meta['x-ratelimit-limit'], 10);
                }
                if(response.meta.hasOwnProperty('x-ratelimit-remaining')) {
                    this.remaining = parseInt(response.meta['x-ratelimit-remaining'], 10);
                }
                this.lastUpdate = new Date();
            }
        };
        GitRateLimitInfo.prototype.toStatus = function () {
            return 'rate limit: ' + this.remaining + ' of ' + this.limit + ' @ ' + this.lastUpdate.toLocaleString();
        };
        GitRateLimitInfo.prototype.hasRemaining = function () {
            return this.remaining > 0;
        };
        return GitRateLimitInfo;
    })();
    git.GitRateLimitInfo = GitRateLimitInfo;    
})(git || (git = {}));
var git;
(function (git) {
    var request = require('request');
    var path = require('path');
    var Q = require('q');
    var FS = require('q-io/fs');
    var GithubRawCached = (function () {
        function GithubRawCached(repo, storeFolder) {
            this._debug = false;
            this._formatVersion = '0.0.1';
            this._active = new xm.KeyValueMap();
            this.stats = new xm.StatCounter(false);
            xm.assertVar('repo', repo, git.GithubRepo);
            xm.assertVar('storeFolder', storeFolder, 'string');
            this._repo = repo;
            this._dir = path.join(storeFolder, this._repo.getCacheKey() + '-fmt' + this._formatVersion);
        }
        GithubRawCached.prototype.getFile = function (commitSha, filePath) {
            var _this = this;
            this.stats.count('invoked');
            var tmp = filePath.split(/\/|\\\//g);
            tmp.unshift(commitSha);
            tmp.unshift(this._dir);
            var key = commitSha + '/' + filePath;
            var storeFile = path.join.apply(null, tmp);
            if(this._debug) {
                xm.log(storeFile);
            }
            if(this._active.has(key)) {
                this.stats.count('active-hit');
                return this._active.get(key).then(function (content) {
                    _this.stats.count('active-resolve');
                    return content;
                }, function (err) {
                    _this.stats.count('active-error');
                    throw err;
                });
            }
            var promise = FS.exists(storeFile).then(function (exists) {
                if(exists) {
                    return FS.isFile(storeFile).then(function (isFile) {
                        if(!isFile) {
                            throw (new Error('path exists but is not a file: ' + storeFile));
                        }
                        _this.stats.count('store-hit');
                        return FS.read(storeFile);
                    });
                } else {
                    _this.stats.count('store-miss');
                    var opts = {
                        url: _this._repo.urls.rawFile(commitSha, filePath)
                    };
                    if(_this._debug) {
                        xm.log(opts.url);
                    }
                    return Q.nfcall(request.get, opts).spread(function (res) {
                        if(!res.statusCode || res.statusCode < 200 || res.statusCode >= 400) {
                            throw new Error('unexpected status code: ' + res.statusCode);
                        }
                        var content = String(res.body);
                        return xm.mkdirCheckQ(path.dirname(storeFile)).then(function () {
                            return FS.write(storeFile, content);
                        }).then(function () {
                            _this.stats.count('store-set');
                            return content;
                        }, function (err) {
                            _this.stats.count('store-error');
                            return content;
                        }).then(function () {
                            _this._active.remove(key);
                        });
                    });
                }
            });
            this._active.set(key, promise);
            return promise;
        };
        Object.defineProperty(GithubRawCached.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (value) {
                this._debug = value;
                this.stats.log = value;
            },
            enumerable: true,
            configurable: true
        });
        return GithubRawCached;
    })();
    git.GithubRawCached = GithubRawCached;    
})(git || (git = {}));
var tsd;
(function (tsd) {
    var referenceTag = /<reference[ \t]*path=["']?([\w\.\/_-]*)["']?[ \t]*\/>/g;
    var leadingExp = /^\.\.\//;
    var DefUtil = (function () {
        function DefUtil() { }
        DefUtil.getDefs = function getDefs(list) {
            return list.map(function (def) {
                return def.def;
            });
        };
        DefUtil.getHeads = function getHeads(list) {
            return list.map(function (def) {
                return def.head;
            });
        };
        DefUtil.getHistoryTop = function getHistoryTop(list) {
            return list.map(function (def) {
                if(def.history.length > 0) {
                    return def.history[0];
                }
                return def.head;
            });
        };
        DefUtil.uniqueDefVersion = function uniqueDefVersion(list) {
            var ret = [];
            outer:
for(var i = 0, ii = list.length; i < ii; i++) {
                var check = list[i];
                for(var j = 0, jj = ret.length; j < jj; j++) {
                    if(check.def.path === ret[j].def.path) {
                        continue outer;
                    }
                }
                ret.push(check);
            }
            return ret;
        };
        DefUtil.uniqueDefs = function uniqueDefs(list) {
            var ret = [];
            outer:
for(var i = 0, ii = list.length; i < ii; i++) {
                var check = list[i];
                for(var j = 0, jj = ret.length; j < jj; j++) {
                    if(check.path === ret[j].path) {
                        continue outer;
                    }
                }
                ret.push(check);
            }
            return ret;
        };
        DefUtil.extractReferenceTags = function extractReferenceTags(source) {
            var ret = [];
            var match;
            if(!referenceTag.global) {
                throw new Error('referenceTag RegExp must have global flag');
            }
            referenceTag.lastIndex = 0;
            while((match = referenceTag.exec(source))) {
                if(match.length > 0 && match[1].length > 0) {
                    ret.push(match[1]);
                }
            }
            return ret;
        };
        DefUtil.contains = function contains(list, file) {
            for(var i = 0, ii = list.length; i < ii; i++) {
                if(list[i].def.path === file.def.path) {
                    return true;
                }
            }
            return false;
        };
        DefUtil.mergeDependencies = function mergeDependencies(list) {
            var ret = [];
            for(var i = 0, ii = list.length; i < ii; i++) {
                var file = list[i];
                if(!DefUtil.contains(ret, file)) {
                    ret.push(file);
                }
                for(var j = 0, jj = file.dependencies.length; j < jj; j++) {
                    var tmp = file.dependencies[j];
                    if(!DefUtil.contains(ret, tmp)) {
                        ret.push(tmp);
                    }
                }
            }
            return ret;
        };
        DefUtil.extractDependencies = function extractDependencies(list) {
            var ret = [];
            for(var i = 0, ii = list.length; i < ii; i++) {
                var file = list[i];
                for(var j = 0, jj = file.dependencies.length; j < jj; j++) {
                    var tmp = file.dependencies[j];
                    if(!DefUtil.contains(ret, tmp) && !DefUtil.contains(list, tmp)) {
                        ret.push(tmp);
                    }
                }
            }
            return ret;
        };
        return DefUtil;
    })();
    tsd.DefUtil = DefUtil;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var nameExp = /^(\w[\w_\.-]+?\w)\/(\w[\w_\.-]+?\w)\.d\.ts$/;
    var Def = (function () {
        function Def(path) {
            this.history = [];
            xm.assertVar('path', path, 'string');
            this.path = path;
        }
        Def.prototype.toString = function () {
            return this.project + '/' + this.name + (this.semver ? '-v' + this.semver : '');
        };
        Def.isDefPath = function isDefPath(path) {
            return nameExp.test(path);
        };
        Def.getPath = function getPath(path) {
            return nameExp.test(path);
        };
        Def.getFrom = function getFrom(path) {
            var match = nameExp.exec(path);
            if(!match) {
                return null;
            }
            if(match.length < 1) {
                return null;
            }
            if(match[1].length < 1 || match[2].length < 1) {
                return null;
            }
            var file = new tsd.Def(path);
            file.project = match[1];
            file.name = match[2];
            return file;
        };
        return Def;
    })();
    tsd.Def = Def;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var endSlashTrim = /\/?$/;
    var DefInfo = (function () {
        function DefInfo() {
            this.references = [];
            this.resetAll();
        }
        DefInfo.prototype.resetFields = function () {
            this.name = '';
            this.version = '';
            this.submodule = '';
            this.description = '';
            this.projectUrl = '';
            this.authors = [];
            this.reposUrl = '';
        };
        DefInfo.prototype.resetAll = function () {
            this.resetFields();
            this.references = [];
        };
        DefInfo.prototype.toString = function () {
            var ret = this.name;
            if(this.submodule) {
                ret += ' ' + this.submodule;
            }
            if(this.version) {
                ret += ' ' + this.version;
            }
            if(this.description) {
                ret += ' ' + JSON.stringify(this.description);
            }
            return ret;
        };
        DefInfo.prototype.isValid = function () {
            if(!this.name) {
                return false;
            }
            if(this.authors.length === 0) {
                return false;
            }
            if(!this.reposUrl) {
                return false;
            }
            return true;
        };
        return DefInfo;
    })();
    tsd.DefInfo = DefInfo;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var DefVersion = (function () {
        function DefVersion(def, commit) {
            this.dependencies = [];
            this.solved = false;
            xm.assertVar('def', def, tsd.Def);
            xm.assertVar('commit', commit, tsd.DefCommit);
            this._def = def;
            this._commit = commit;
        }
        Object.defineProperty(DefVersion.prototype, "key", {
            get: function () {
                if(!this._def || !this._commit) {
                    return null;
                }
                return this._def.path + '-' + this._commit.commitSha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefVersion.prototype, "def", {
            get: function () {
                return this._def;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefVersion.prototype, "commit", {
            get: function () {
                return this._commit;
            },
            enumerable: true,
            configurable: true
        });
        DefVersion.prototype.toString = function () {
            var str = (this._def ? this._def.path : '<no def>');
            str += ' : ' + (this._commit ? this._commit.commitShort : '<no blob-sha>');
            return str;
        };
        return DefVersion;
    })();
    tsd.DefVersion = DefVersion;    
})(tsd || (tsd = {}));
var git;
(function (git) {
    var GitUserCommit = (function () {
        function GitUserCommit() { }
        GitUserCommit.prototype.toString = function () {
            return (this.name ? this.name : '<no name>') + ' ' + (this.email ? '<' + this.email + '>' : '<no email>');
        };
        GitUserCommit.fromJSON = function fromJSON(json) {
            if(!json) {
                return null;
            }
            var ret = new git.GitUserCommit();
            ret.name = json.name;
            ret.email = json.email;
            ret.date = new Date(Date.parse(json.date));
            return ret;
        };
        return GitUserCommit;
    })();
    git.GitUserCommit = GitUserCommit;    
})(git || (git = {}));
var git;
(function (git) {
    var GithubUser = (function () {
        function GithubUser() { }
        GithubUser.prototype.toString = function () {
            return (this.login ? this.login : '<no login>') + (this.id ? '[' + this.id + ']' : '<no id>');
        };
        GithubUser.fromJSON = function fromJSON(json) {
            if(!json) {
                return null;
            }
            var ret = new GithubUser();
            ret.id = parseInt(json.id, 10);
            ret.login = json.login;
            ret.avatar_url = json.avatar_url;
            return ret;
        };
        return GithubUser;
    })();
    git.GithubUser = GithubUser;    
})(git || (git = {}));
var git;
(function (git) {
    var subjectExp = /^(.*?)[ \t]*(?:[\r\n]+|$)/;
    var GitCommitMessage = (function () {
        function GitCommitMessage(text) {
            this.parse(this.text);
        }
        GitCommitMessage.prototype.parse = function (text) {
            this.text = String(text);
            subjectExp.lastIndex = 0;
            var match = subjectExp.exec(this.text);
            this.subject = (match && match.length > 1 ? match[1] : '');
        };
        GitCommitMessage.prototype.toString = function () {
            return (typeof this.subject === 'string' ? this.subject : '<no subject>');
        };
        return GitCommitMessage;
    })();
    git.GitCommitMessage = GitCommitMessage;    
})(git || (git = {}));
var tsd;
(function (tsd) {
    var pointer = require('jsonpointer.js');
    var branch_tree_sha = '/commit/commit/tree/sha';
    var DefCommit = (function () {
        function DefCommit(commitSha) {
            this.message = new git.GitCommitMessage();
            xm.assertVar('commitSha', commitSha, 'string');
            this._commitSha = commitSha;
        }
        DefCommit.prototype.parseJSON = function (commit) {
            xm.assertVar('commit', commit, 'object');
            if(commit.sha !== this._commitSha) {
                throw new Error('not my tree: ' + this._commitSha + ' -> ' + commit.sha);
            }
            this._treeSha = pointer.get(commit, branch_tree_sha);
            this.hubAuthor = git.GithubUser.fromJSON(commit.author);
            this.hubCommitter = git.GithubUser.fromJSON(commit.committer);
            this.gitAuthor = git.GitUserCommit.fromJSON(commit.commit.author);
            this.gitCommitter = git.GitUserCommit.fromJSON(commit.commit.committer);
            this.message.parse(commit.commit.message);
        };
        DefCommit.prototype.toString = function () {
            return this.commitShort;
        };
        Object.defineProperty(DefCommit.prototype, "commitShort", {
            get: function () {
                return this._commitSha.substr(0, 8);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefCommit.prototype, "commitSha", {
            get: function () {
                return this._commitSha;
            },
            enumerable: true,
            configurable: true
        });
        return DefCommit;
    })();
    tsd.DefCommit = DefCommit;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var pointer = require('jsonpointer.js');
    var commit_sha = '/commit/sha';
    var branch_tree_sha = '/commit/commit/tree/sha';
    var DefIndex = (function () {
        function DefIndex() {
            this._hasIndex = false;
            this._definitions = new xm.KeyValueMap();
            this._commits = new xm.KeyValueMap();
            this._versions = new xm.KeyValueMap();
        }
        DefIndex.prototype.hasIndex = function () {
            return this._hasIndex;
        };
        DefIndex.prototype.init = function (branch, tree) {
            var _this = this;
            if(this._hasIndex) {
                return;
            }
            this._commits.clear();
            this._versions.clear();
            this._definitions.clear();
            xm.assertVar('branch', branch, 'object');
            xm.assertVar('tree', tree, 'object');
            var commitSha = pointer.get(branch, commit_sha);
            var treeSha = tree.sha;
            var sha = pointer.get(branch, branch_tree_sha);
            xm.assertVar('sha', sha, 'string');
            xm.assertVar('treeSha', treeSha, 'string');
            xm.assertVar('commitSha', commitSha, 'string');
            if(sha !== treeSha) {
                throw new Error('missing branch and tree sha mismatch');
            }
            this._branchName = branch.name;
            this._indexCommit = this.procureCommit(commitSha);
            this._indexCommit.parseJSON(branch.commit);
            var def;
            var file;
            tree.tree.forEach(function (elem) {
                var char = elem.path.charAt(0);
                if(elem.type === 'blob' && char !== '.' && char !== '_' && tsd.Def.isDefPath(elem.path)) {
                    def = _this.procureDef(elem.path);
                    if(!def) {
                        return;
                    }
                    file = _this.procureVersion(def, _this._indexCommit);
                    if(!file) {
                        return;
                    }
                    def.head = file;
                }
            });
            this._hasIndex = true;
        };
        DefIndex.prototype.setHistory = function (def, commits) {
            var _this = this;
            def.history = [];
            commits.map(function (json) {
                if(!json || !json.sha) {
                    xm.log.inspect(json, 'weird: json no sha');
                }
                var commit = _this.procureCommit(json.sha);
                if(!commit) {
                    xm.log.inspect('weird: no commit for sha ' + json.sha);
                    throw new Error('huh?');
                }
                commit.parseJSON(json);
                def.history.push(_this.procureVersion(def, commit));
            });
        };
        DefIndex.prototype.procureCommit = function (commitSha) {
            var commit;
            if(this._commits.has(commitSha)) {
                commit = this._commits.get(commitSha);
            } else {
                commit = new tsd.DefCommit(commitSha);
                this._commits.set(commitSha, commit);
            }
            return commit;
        };
        DefIndex.prototype.procureDef = function (path) {
            var def = null;
            if(this._definitions.has(path)) {
                def = this._definitions.get(path);
            } else {
                def = tsd.Def.getFrom(path);
                if(def) {
                    this._definitions.set(path, def);
                }
            }
            return def;
        };
        DefIndex.prototype.procureVersion = function (def, commit) {
            var file;
            var key = def.path + '|' + commit.commitSha;
            if(this._versions.has(key)) {
                file = this._versions.get(key);
                if(file.def !== def) {
                    throw new Error('weird: internal data mismatch: version does not belong to file: ' + file.def + ' -> ' + commit);
                }
            } else {
                file = new tsd.DefVersion(def, commit);
                this._versions.set(key, file);
            }
            return file;
        };
        DefIndex.prototype.getFile = function (def) {
            this._definitions.get(def.path, null);
        };
        DefIndex.prototype.hasPath = function (path) {
            return this._definitions.has(path);
        };
        DefIndex.prototype.getDefByPath = function (path) {
            return this._definitions.get(path, null);
        };
        DefIndex.prototype.getPaths = function () {
            return this._definitions.values().map(function (file) {
                return file.path;
            });
        };
        DefIndex.prototype.toDump = function () {
            var ret = [];
            ret.push(this.toString());
            this._definitions.values().forEach(function (def) {
                ret.push('  ' + def.toString());
                ret.push('  ' + def.head.toString());
            });
            return ret.join('\n');
        };
        Object.defineProperty(DefIndex.prototype, "branchName", {
            get: function () {
                return this._branchName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefIndex.prototype, "list", {
            get: function () {
                return this._definitions.values();
            },
            enumerable: true,
            configurable: true
        });
        DefIndex.prototype.toString = function () {
            return '[' + this._branchName + ']';
        };
        return DefIndex;
    })();
    tsd.DefIndex = DefIndex;    
})(tsd || (tsd = {}));
var xm;
(function (xm) {
    var expTrim = /^\/(.*)\/([a-z]+)*$/gm;
    var flagFilter = /[gim]/;
    var RegExpGlue = (function () {
        function RegExpGlue() {
            var exp = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                exp[_i] = arguments[_i + 0];
            }
            this.parts = [];
            if(exp.length > 0) {
                this.append.apply(this, exp);
            }
        }
        RegExpGlue.get = function get() {
            var exp = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                exp[_i] = arguments[_i + 0];
            }
            var e = new RegExpGlue();
            return e.append.apply(e, exp);
        };
        RegExpGlue.prototype.append = function () {
            var _this = this;
            var exp = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                exp[_i] = arguments[_i + 0];
            }
            exp.forEach(function (value) {
                _this.parts.push(value);
            }, this);
            return this;
        };
        RegExpGlue.prototype.getBody = function (exp) {
            expTrim.lastIndex = 0;
            var trim = expTrim.exec('' + exp);
            if(!trim) {
                return '';
            }
            return typeof trim[1] !== 'undefined' ? trim[1] : '';
        };
        RegExpGlue.prototype.getFlags = function (exp) {
            expTrim.lastIndex = 0;
            var trim = expTrim.exec('' + exp);
            if(!trim) {
                return '';
            }
            return typeof trim[2] !== 'undefined' ? this.getCleanFlags(trim[2]) : '';
        };
        RegExpGlue.prototype.getCleanFlags = function (flags) {
            var ret = '';
            for(var i = 0; i < flags.length; i++) {
                var char = flags.charAt(i);
                if(flagFilter.test(char) && ret.indexOf(char) < 0) {
                    ret += char;
                }
            }
            return ret;
        };
        RegExpGlue.prototype.join = function (flags, seperator) {
            var glueBody = seperator ? this.getBody(seperator) : '';
            var chunks = [];
            flags = typeof flags !== 'undefined' ? this.getCleanFlags(flags) : '';
            this.parts.forEach(function (exp, index, arr) {
                if(typeof exp === 'string') {
                    chunks.push(exp);
                    return;
                }
                expTrim.lastIndex = 0;
                var trim = expTrim.exec('' + exp);
                if(!trim) {
                    return exp;
                }
                if(trim.length < 2) {
                    console.log(trim);
                    return;
                }
                chunks.push(trim[1]);
            }, this);
            return new RegExp(chunks.join(glueBody), flags);
        };
        return RegExpGlue;
    })();
    xm.RegExpGlue = RegExpGlue;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    var util = require('util');
    var trimmedLine = /([ \t]*)(.*?)([ \t]*)(\r\n|\n|\r|$)/g;
    var LineParserCore = (function () {
        function LineParserCore(verbose) {
            if (typeof verbose === "undefined") { verbose = false; }
            this.verbose = verbose;
            this.parsers = new xm.KeyValueMap();
        }
        LineParserCore.prototype.addParser = function (parser) {
            this.parsers.set(parser.id, parser);
        };
        LineParserCore.prototype.getInfo = function () {
            var ret = {
            };
            ret.parsers = this.parsers.keys().sort();
            return ret;
        };
        LineParserCore.prototype.getParser = function (id) {
            return this.parsers.get(id, null);
        };
        LineParserCore.prototype.link = function () {
            var _this = this;
            xm.eachElem(this.parsers.values(), function (parser) {
                xm.eachElem(parser.nextIds, function (id) {
                    var p = _this.parsers.get(id);
                    if(p) {
                        parser.next.push(p);
                    } else {
                        console.log('cannot find parser: ' + id);
                    }
                });
            });
        };
        LineParserCore.prototype.get = function (ids) {
            var _this = this;
            return xm.reduceArray(ids, [], function (memo, id) {
                if(!_this.parsers.has(id)) {
                    console.log('missing parser ' + id);
                    return memo;
                }
                memo.push(_this.parsers.get(id));
                return memo;
            });
        };
        LineParserCore.prototype.all = function () {
            return this.parsers.values();
        };
        LineParserCore.prototype.listIds = function (parsers) {
            return xm.reduceArray(parsers, [], function (memo, parser) {
                memo.push(parser.id);
                return memo;
            });
        };
        LineParserCore.prototype.parse = function (source, asType) {
            var log = this.verbose ? function () {
                var rest = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    rest[_i] = arguments[_i + 0];
                }
                console.log.apply(console, rest);
            } : function () {
                var rest = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    rest[_i] = arguments[_i + 0];
                }
            };
            log('source.length: ' + source.length);
            log('asType: ' + asType);
            this.link();
            var res = [];
            var possibles = asType ? this.get(asType) : this.all();
            var length = source.length;
            var line;
            var i, ii;
            var offset = 0;
            var cursor = 0;
            var lineCount = 0;
            var procLineCount = 0;
            var safetyBreak = 20;
            trimmedLine.lastIndex = 0;
            while(line = trimmedLine.exec(source)) {
                log('-----------------------------------------------------------------------------------------');
                if(line[0].length === 0) {
                    console.log('zero length line match?');
                    break;
                }
                if(line.index + line[0].lengt === cursor) {
                    console.log('cursor not advancing?');
                    break;
                }
                cursor = line.index + line[0].length;
                trimmedLine.lastIndex = cursor;
                lineCount++;
                log('line: ' + lineCount);
                if(lineCount > safetyBreak) {
                    console.log('\n\n\n\nsafetyBreak bail at ' + lineCount + '> ' + safetyBreak + '!\n\n\n\n\n');
                    throw ('parser safetyBreak bail!');
                }
                if(line.length < 5) {
                    log('skip bad line match');
                } else if(typeof line[2] === 'undefined' || line[2] === '') {
                    log('skip empty line');
                } else {
                    procLineCount++;
                    var text = line[2];
                    log('[[' + text + ']]');
                    log('---');
                    var choice = [];
                    for(i = 0 , ii = possibles.length; i < ii; i++) {
                        var parser = possibles[i];
                        var match = parser.match(text, offset, cursor);
                        if(match) {
                            log(parser.getName() + ' -> match!');
                            log(match.match);
                            choice.push(match);
                            break;
                        } else {
                            log(parser.getName());
                        }
                    }
                    log('---');
                    log('choices ' + choice.length);
                    if(choice.length === 0) {
                        log('cannot match line');
                        break;
                    } else if(choice.length === 1) {
                        log('single match line');
                        log('using ' + choice[0].parser.id);
                        res.push(choice[0]);
                        possibles = choice[0].parser.next;
                        log('switching possibles: [' + this.listIds(possibles) + ']');
                    } else {
                        log('multi match line');
                        log('using ' + choice[0].parser.id);
                        res.push(choice[0]);
                        possibles = choice[0].parser.next;
                        log('switching possibles: [' + this.listIds(possibles) + ']');
                    }
                }
                if(possibles.length === 0) {
                    log('no more possibles, break');
                    break;
                }
                if(cursor >= length) {
                    log('done ' + cursor + ' >= ' + length + ' lineCount: ' + lineCount);
                    break;
                }
            }
            log('--------------');
            log('total lineCount: ' + lineCount);
            log('procLineCount: ' + procLineCount);
            log('res.length: ' + res.length);
            log(' ');
            if(res.length > 0) {
                xm.eachElem(res, function (match) {
                    match.extract();
                });
            }
        };
        return LineParserCore;
    })();
    xm.LineParserCore = LineParserCore;    
    var LineParser = (function () {
        function LineParser(id, exp, groupsMin, callback, nextIds) {
            if (typeof nextIds === "undefined") { nextIds = []; }
            this.id = id;
            this.exp = exp;
            this.groupsMin = groupsMin;
            this.callback = callback;
            this.nextIds = nextIds;
            this.next = [];
        }
        LineParser.prototype.match = function (str, offset, limit) {
            this.exp.lastIndex = offset;
            var match = this.exp.exec(str);
            if(!match || match.length < 1) {
                return null;
            }
            if(this.groupsMin >= 0 && match.length < this.groupsMin) {
                throw (new Error(this.getName() + 'bad match expected ' + this.groupsMin + ' groups, got ' + (this.match.length - 1)));
            }
            return new LineParserMatch(this, match);
        };
        LineParser.prototype.getName = function () {
            return this.id;
        };
        return LineParser;
    })();
    xm.LineParser = LineParser;    
    var LineParserMatch = (function () {
        function LineParserMatch(parser, match) {
            this.parser = parser;
            this.match = match;
        }
        LineParserMatch.prototype.extract = function () {
            if(this.parser.callback) {
                this.parser.callback(this);
            }
        };
        LineParserMatch.prototype.getGroup = function (num, alt) {
            if (typeof alt === "undefined") { alt = ''; }
            if(num >= this.match.length - 1) {
                throw (new Error(this.parser.getName() + ' group index ' + num + ' > ' + (this.match.length - 2)));
            }
            num += 1;
            if(num < 1 || num > this.match.length) {
                return alt;
            }
            if(typeof this.match[num] === 'undefined') {
                return alt;
            }
            return this.match[num];
        };
        LineParserMatch.prototype.getGroupFloat = function (num, alt) {
            if (typeof alt === "undefined") { alt = 0; }
            var value = parseFloat(this.getGroup(num));
            if(isNaN(value)) {
                return alt;
            }
            return value;
        };
        LineParserMatch.prototype.getName = function () {
            return this.parser.getName();
        };
        return LineParserMatch;
    })();
    xm.LineParserMatch = LineParserMatch;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    var endSlashTrim = /\/?$/;
    var AuthorInfo = (function () {
        function AuthorInfo(name, url, email) {
            if (typeof name === "undefined") { name = ''; }
            if (typeof url === "undefined") { url = undefined; }
            if (typeof email === "undefined") { email = undefined; }
            this.name = name;
            this.url = url;
            this.email = email;
            if(this.url) {
                this.url = this.url.replace(endSlashTrim, '');
            }
        }
        AuthorInfo.prototype.toString = function () {
            return this.name + (this.email ? ' @ ' + this.email : '') + (this.url ? ' <' + this.url + '>' : '');
        };
        AuthorInfo.prototype.toJSON = function () {
            var obj = {
                name: this.name
            };
            if(this.url) {
                obj.url = this.url;
            }
            if(this.email) {
                obj.email = this.email;
            }
            return obj;
        };
        return AuthorInfo;
    })();
    xm.AuthorInfo = AuthorInfo;    
})(xm || (xm = {}));
var tsd;
(function (tsd) {
    var endSlashTrim = /\/?$/;
    var glue = xm.RegExpGlue.get;
    var expStart = /^/;
    var expEnd = /$/;
    var spaceReq = /[ \t]+/;
    var spaceOpt = /[ \t]*/;
    var anyGreedy = /.*/;
    var anyLazy = /.*?/;
    var anyGreedyCap = /(.*)/;
    var anyLazyCap = /(.*?)/;
    var identifierCap = /([\w\._-]*(?:[ \t]*[\w\._-]+)*?)/;
    var versionCap = /-?v?(\d+\.\d+\.?\d*\.?\d*)?/;
    var wordsCap = /([\w \t_-]+[\w]+)/;
    var labelCap = /([\w_-]+[\w]+)/;
    var delimStart = /[<\[\{\(]/;
    var delimStartOpt = /[<\[\{\(]?/;
    var delimEnd = /[\)\}\]>]/;
    var delimEndOpt = /[\)\}\]>]?/;
    var seperatorOpt = /[,;]?/;
    var urlGroupsCap = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
    var urlFullCap = /((?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)(?:(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
    var referenceTag = /<reference[ \t]*path=["']?([\w\.\/_-]*)["']?[ \t]*\/>/;
    var commentStart = glue(expStart, spaceOpt, /\/\/+/, spaceOpt).join();
    var optUrl = glue('(?:', spaceOpt, delimStartOpt, urlFullCap, delimEndOpt, ')?').join();
    var commentLine = glue(commentStart).append(anyLazyCap).append(spaceOpt, expEnd).join();
    var referencePath = glue(expStart, spaceOpt, /\/\/+/, spaceOpt).append(referenceTag).append(spaceOpt, expEnd).join();
    var typeHead = glue(commentStart).append(/Type definitions?/, spaceOpt, /(?:for)?:?/, spaceOpt, identifierCap).append(/[ \t:-]+/, versionCap, spaceOpt).append(anyGreedy, expEnd).join('i');
    var projectUrl = glue(commentStart).append(/Project/, spaceOpt, /:?/, spaceOpt).append(delimStartOpt, urlFullCap, delimEndOpt).append(spaceOpt, expEnd).join('i');
    var defAuthorUrl = glue(commentStart).append(/Definitions[ \t]+by[ \t]*:?/, spaceOpt).append(wordsCap, optUrl).append(spaceOpt, seperatorOpt, spaceOpt, expEnd).join('i');
    var defAuthorUrlAlt = glue(commentStart).append(/Author[ \t]*:?/, spaceOpt).append(wordsCap, optUrl).append(spaceOpt, seperatorOpt, spaceOpt, expEnd).join('i');
    var reposUrl = glue(commentStart).append(/Definitions/, spaceOpt, /:?/, spaceOpt).append(delimStartOpt, urlFullCap, delimEndOpt).append(spaceOpt, expEnd).join('i');
    var reposUrlAlt = glue(commentStart).append(/DefinitelyTyped/, spaceOpt, /:?/, spaceOpt).append(delimStartOpt, urlFullCap, delimEndOpt).append(spaceOpt, expEnd).join('i');
    var labelUrl = glue(commentStart).append(labelCap, spaceOpt, /:?/, spaceOpt).append(delimStartOpt, urlFullCap, delimEndOpt).append(spaceOpt, expEnd).join('i');
    var labelWordsUrl = glue(commentStart).append(labelCap, spaceOpt, /:?/, spaceOpt).append(wordsCap, spaceOpt).append(delimStartOpt, urlFullCap, delimEndOpt).append(spaceOpt, expEnd).join('i');
    var wordsUrl = glue(commentStart).append(wordsCap, spaceOpt).append(delimStartOpt, urlFullCap, delimEndOpt).append(spaceOpt, expEnd).join('i');
    function mutate(base, add, remove) {
        var res = base ? base.slice(0) : [];
        var i, ii, index;
        if(add) {
            for(i = 0 , ii = add.length; i < ii; i++) {
                res.push(add[i]);
            }
        }
        if(remove) {
            for(i = 0 , ii = remove.length; i < ii; i++) {
                while((index = res.indexOf(remove[i])) > -1) {
                    res.splice(index, 1);
                }
            }
        }
        return res;
    }
    var DefInfoParser = (function () {
        function DefInfoParser(verbose) {
            if (typeof verbose === "undefined") { verbose = false; }
            this.verbose = verbose;
        }
        DefInfoParser.prototype.parse = function (data, source) {
            data.resetFields();
            this.parser = new xm.LineParserCore(this.verbose);
            var fields = [
                'projectUrl', 
                'defAuthorUrl', 
                'defAuthorUrlAlt', 
                'reposUrl', 
                'reposUrlAlt', 
                'referencePath'
            ];
            this.parser.addParser(new xm.LineParser('any', anyGreedyCap, 0, null, [
                'head', 
                'any'
            ]));
            this.parser.addParser(new xm.LineParser('head', typeHead, 2, function (match) {
                data.name = match.getGroup(0, data.name);
                data.version = match.getGroup(1, data.version);
            }, fields));
            fields = mutate(fields, null, [
                'projectUrl'
            ]);
            this.parser.addParser(new xm.LineParser('projectUrl', projectUrl, 1, function (match) {
                data.projectUrl = match.getGroup(0, data.projectUrl).replace(endSlashTrim, '');
            }, fields));
            fields = mutate(fields, [
                'defAuthorAppend'
            ], [
                'defAuthorUrl', 
                'defAuthorUrlAlt'
            ]);
            this.parser.addParser(new xm.LineParser('defAuthorUrl', defAuthorUrl, 2, function (match) {
                data.authors.push(new xm.AuthorInfo(match.getGroup(0), match.getGroup(1)));
            }, fields));
            this.parser.addParser(new xm.LineParser('defAuthorUrlAlt', defAuthorUrlAlt, 2, function (match) {
                data.authors.push(new xm.AuthorInfo(match.getGroup(0), match.getGroup(1)));
            }, fields));
            this.parser.addParser(new xm.LineParser('defAuthorAppend', wordsUrl, 2, function (match) {
                data.authors.push(new xm.AuthorInfo(match.getGroup(0), match.getGroup(1)));
            }, fields));
            fields = mutate(fields, null, [
                'defAuthorAppend'
            ]);
            fields = mutate(fields, null, [
                'reposUrl', 
                'reposUrlAlt'
            ]);
            this.parser.addParser(new xm.LineParser('reposUrl', reposUrl, 1, function (match) {
                data.reposUrl = match.getGroup(0, data.reposUrl).replace(endSlashTrim, '');
            }, fields));
            this.parser.addParser(new xm.LineParser('reposUrlAlt', reposUrlAlt, 1, function (match) {
                data.reposUrl = match.getGroup(0, data.reposUrl).replace(endSlashTrim, '');
            }, fields));
            this.parser.addParser(new xm.LineParser('referencePath', referencePath, 1, function (match) {
                data.references.push(match.getGroup(0));
            }, [
                'referencePath'
            ]));
            this.parser.addParser(new xm.LineParser('comment', commentLine, 0, null, [
                'comment'
            ]));
            if(this.verbose) {
                xm.log(this.parser.getInfo());
            }
            this.parser.parse(source, [
                'head'
            ]);
        };
        return DefInfoParser;
    })();
    tsd.DefInfoParser = DefInfoParser;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var Q = require('q');
    var leadingExp = /^\.\.\//;
    var Resolver = (function () {
        function Resolver(core) {
            this._active = new xm.KeyValueMap();
            this.stats = new xm.StatCounter();
            xm.assertVar('core', core, tsd.Core);
            this._core = core;
            this.stats.log = this._core.context.verbose;
        }
        Resolver.prototype.resolve = function (list) {
            var _this = this;
            list = tsd.DefUtil.uniqueDefVersion(list);
            return Q.all(list.map(function (file) {
                return _this.solveOne(file);
            })).thenResolve(list);
        };
        Resolver.prototype.solveOne = function (file) {
            var _this = this;
            if(file.solved) {
                this.stats.count('solved-early');
                return Q(file);
            }
            xm.log('check ' + file.toString());
            if(this._active.has(file.key)) {
                this.stats.count('active-has');
                return this._active.get(file.key);
            } else {
                this.stats.count('active-miss');
            }
            var promise = this._core.loadContent(file).then(function (file) {
                _this.stats.count('file-parse');
                file.dependencies = [];
                var refs = tsd.DefUtil.extractReferenceTags(file.content);
                refs = refs.reduce(function (memo, refPath) {
                    refPath = refPath.replace(leadingExp, '');
                    if(refPath.indexOf('/') < 0) {
                        refPath = file.def.project + '/' + refPath;
                    }
                    if(tsd.Def.isDefPath(refPath)) {
                        xm.log(refPath);
                        memo.push(refPath);
                    } else {
                        xm.log.warn('not a reference: ' + refPath);
                    }
                    return memo;
                }, []);
                var queued = refs.reduce(function (memo, refPath) {
                    if(_this._core.index.hasPath(refPath)) {
                        var dep = _this._core.index.getDefByPath(refPath).head;
                        file.dependencies.push(dep);
                        _this.stats.count('dep-added');
                        if(!dep.solved && !_this._active.has(dep.key)) {
                            _this.stats.count('dep-recurse');
                            memo.push(_this.solveOne(dep));
                        }
                    } else {
                        xm.log.warn('path reference not in index: ' + refPath);
                    }
                    return memo;
                }, []);
                file.solved = true;
                _this._active.remove(file.key);
                _this.stats.count('active-remove');
                xm.log('done ' + file.toString());
                if(queued.length > 0) {
                    _this.stats.count('subload-start');
                    return Q.all(queued);
                }
                return Q(file);
            }).thenResolve(file);
            this.stats.count('active-set');
            this._active.set(file.key, promise);
            return promise;
        };
        return Resolver;
    })();
    tsd.Resolver = Resolver;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var Q = require('q');
    var FS = require('q-io/fs');
    var path = require('path');
    var pointer = require('jsonpointer.js');
    var branch_tree = '/commit/commit/tree/sha';
    var leadingExp = /^\.\.\//;
    var APIResult = (function () {
        function APIResult(index, selector) {
            this.index = index;
            this.selector = selector;
            xm.assertVar('index', index, tsd.DefIndex);
            xm.assertVar('selector', selector, tsd.Selector);
        }
        return APIResult;
    })();
    tsd.APIResult = APIResult;    
    var Core = (function () {
        function Core(context) {
            this.context = context;
            xm.assertVar('context', context, tsd.Context);
            this.resolver = new tsd.Resolver(this);
            this.index = new tsd.DefIndex();
            this.gitRepo = new git.GithubRepo(context.config.repoOwner, context.config.repoProject);
            this.gitAPI = new git.GithubAPICached(this.gitRepo, path.join(context.paths.cache, 'git_api'));
            this.gitRaw = new git.GithubRawCached(this.gitRepo, path.join(context.paths.cache, 'git_raw'));
            this.gitAPI.debug = this.context.verbose;
            this.gitRaw.debug = this.context.verbose;
        }
        Core.prototype.getIndex = function () {
            var _this = this;
            if(this.index.hasIndex()) {
                return Q(this.index);
            }
            var branchData;
            return this.gitAPI.getBranch(this.context.config.ref).then(function (data) {
                var sha = pointer.get(data, branch_tree);
                if(!sha) {
                    throw new Error('missing sha hash');
                }
                branchData = data;
                return _this.gitAPI.getTree(sha, true);
            }).then(function (data) {
                _this.index.init(branchData, data);
                return _this.index;
            });
        };
        Core.prototype.select = function (selector) {
            var _this = this;
            var result = new APIResult(this.index, selector);
            return this.getIndex().then(function (index) {
                result.nameMatches = selector.pattern.filter(_this.index.list);
                result.selection = tsd.DefUtil.getHeads(result.nameMatches);
                if(selector.resolveDependencies) {
                    return _this.resolveDepencendiesBulk(result.selection);
                }
                return null;
            }).thenResolve(result);
        };
        Core.prototype.loadContent = function (file) {
            if(file.content) {
                return Q(file.content);
            }
            return this.gitRaw.getFile(file.commit.commitSha, file.def.path).then(function (content) {
                file.content = String(content);
                return file;
            });
        };
        Core.prototype.loadContentBulk = function (list) {
            var _this = this;
            return Q.all(list.map(function (file) {
                return _this.loadContent(file);
            })).thenResolve(list);
        };
        Core.prototype.loadHistory = function (file) {
            var _this = this;
            if(file.history.length > 0) {
                return Q(file);
            }
            return this.gitAPI.getPathCommits(this.context.config.ref, file.path).then(function (content) {
                _this.index.setHistory(file, content);
                return file;
            });
        };
        Core.prototype.loadHistoryBulk = function (list) {
            var _this = this;
            list = tsd.DefUtil.uniqueDefs(list);
            return Q.all(list.map(function (file) {
                return _this.loadHistory(file);
            })).thenResolve(list);
        };
        Core.prototype.resolveDepencendiesBulk = function (list) {
            return this.resolver.resolve(list);
        };
        Core.prototype.parseDefInfo = function (file) {
            var _this = this;
            return this.loadContent(file).then(function (file) {
                var parser = new tsd.DefInfoParser(_this.context.verbose);
                if(file.info) {
                    file.info.resetFields();
                } else {
                    file.info = new tsd.DefInfo();
                }
                parser.parse(file.info, file.content);
                if(!file.info.isValid()) {
                    xm.log.warn('bad parse in: ' + file);
                }
                return file;
            });
        };
        Core.prototype.parseDefInfoBulk = function (list) {
            var _this = this;
            list = tsd.DefUtil.uniqueDefVersion(list);
            return Q.all(list.map(function (file) {
                return _this.parseDefInfo(file);
            })).thenResolve(list);
        };
        Core.prototype.writeFile = function (file) {
            var _this = this;
            var target = path.resolve(this.context.paths.typings, file.def.path);
            var dir = path.dirname(target);
            return xm.mkdirCheckQ(dir).then(function () {
                if(file.content) {
                    return file.content;
                }
                return _this.loadContent(file);
            }).then(function () {
                return FS.exists(target);
            }).then(function (exists) {
                if(exists) {
                    return FS.remove(target);
                }
                return null;
            }).then(function () {
                return FS.write(target, file.content);
            }).then(function () {
                return target;
            });
        };
        Core.prototype.writeFileBulk = function (list) {
            var _this = this;
            list = tsd.DefUtil.uniqueDefVersion(list);
            return Q.all(list.map(function (file) {
                return _this.writeFile(file);
            }));
        };
        Core.prototype.saveToConfigBulk = function (list) {
            return Q.reject(new Error('not yet implemented'));
        };
        return Core;
    })();
    tsd.Core = Core;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var wordParts = /[\w_\.-]/;
    var wordGreedy = /[\w_\.-]+/;
    var wordLazy = /[\w_\.-]*?/;
    var wordGlob = /(\**)([\w_\.-]*?)(\**)/;
    var patternSplit = xm.RegExpGlue.get('^', wordGlob, '/', wordGlob, '$').join();
    var patternSingle = xm.RegExpGlue.get('^', wordGlob, '$').join();
    function escapeExp(str) {
        return str.replace('.', '\\.');
    }
    var NameMatcher = (function () {
        function NameMatcher(pattern) {
            xm.assertVar('pattern', pattern, 'string');
            this.pattern = pattern;
        }
        NameMatcher.prototype.filter = function (list) {
            return list.filter(this.getFilterFunc(), this);
        };
        NameMatcher.prototype.compile = function () {
            if(!this.pattern) {
                throw (new Error('SelectorFilePattern undefined pattern'));
            }
            this.projectExp = null;
            this.nameExp = null;
            if(this.pattern.indexOf('/') > -1) {
                this.compileSplit();
            } else {
                this.compileSingle();
            }
        };
        NameMatcher.prototype.compileSingle = function () {
            patternSingle.lastIndex = 0;
            var match = patternSingle.exec(this.pattern);
            if(match.length < 4) {
                throw (new Error('SelectorFilePattern bad match: "' + match + '"'));
            }
            var glue;
            var gotMatch = false;
            glue = xm.RegExpGlue.get('^');
            if(match[1].length > 0) {
                glue.append(wordLazy);
                gotMatch = true;
            }
            if(match[2].length > 0) {
                glue.append(escapeExp(match[2]));
                gotMatch = true;
            }
            if(match[3].length > 0) {
                glue.append(wordLazy);
                gotMatch = true;
            }
            if(gotMatch) {
                glue.append('$');
                this.nameExp = glue.join('i');
            }
        };
        NameMatcher.prototype.compileSplit = function () {
            patternSplit.lastIndex = 0;
            var match = patternSplit.exec(this.pattern);
            if(match.length < 7) {
                throw (new Error('SelectorFilePattern bad match: "' + match + '"'));
            }
            var glue;
            var gotProject = false;
            glue = xm.RegExpGlue.get('^');
            if(match[1].length > 0) {
                glue.append(wordLazy);
            }
            if(match[2].length > 0) {
                glue.append(escapeExp(match[2]));
                gotProject = true;
            }
            if(match[3].length > 0) {
                glue.append(wordLazy);
            }
            if(gotProject) {
                glue.append('$');
                this.projectExp = glue.join('i');
            }
            var gotFile = false;
            glue = xm.RegExpGlue.get('^');
            if(match[4].length > 0) {
                glue.append(wordLazy);
            }
            if(match[5].length > 0) {
                glue.append(escapeExp(match[5]));
                gotFile = true;
            }
            if(match[6].length > 0) {
                glue.append(wordLazy);
            }
            if(gotFile) {
                glue.append('$');
                this.nameExp = glue.join('i');
            }
        };
        NameMatcher.prototype.getFilterFunc = function () {
            var _this = this;
            this.compile();
            if(this.nameExp) {
                if(this.projectExp) {
                    return function (file) {
                        return _this.projectExp.test(file.project) && _this.nameExp.test(file.name);
                    };
                } else {
                    return function (file) {
                        return _this.nameExp.test(file.name);
                    };
                }
            } else if(this.projectExp) {
                return function (file) {
                    return _this.projectExp.test(file.name);
                };
            } else {
                throw (new Error('SelectorFilePattern cannot compile pattern: ' + JSON.stringify(this.pattern) + ''));
            }
        };
        return NameMatcher;
    })();
    tsd.NameMatcher = NameMatcher;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var InfoMatcher = (function () {
        function InfoMatcher() { }
        InfoMatcher.prototype.test = function (info) {
            return true;
        };
        return InfoMatcher;
    })();
    tsd.InfoMatcher = InfoMatcher;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var Selector = (function () {
        function Selector(pattern) {
            if (typeof pattern === "undefined") { pattern = '*'; }
            this.limit = 10;
            xm.assertVar('pattern', pattern, 'string');
            this.pattern = new tsd.NameMatcher(pattern);
        }
        Object.defineProperty(Selector.prototype, "requiresHistory", {
            get: function () {
                return !!(this.beforeDate || this.afterDate);
            },
            enumerable: true,
            configurable: true
        });
        return Selector;
    })();
    tsd.Selector = Selector;    
})(tsd || (tsd = {}));
var tsd;
(function (tsd) {
    var path = require('path');
    var util = require('util');
    var Q = require('Q');
    var FS = require('Q-io/fs');
    var API = (function () {
        function API(context) {
            this.context = context;
            if(!context) {
                throw new Error('no context');
            }
            this._core = new tsd.Core(this.context);
        }
        API.prototype.search = function (selector) {
            return this._core.select(selector);
        };
        API.prototype.install = function (selector) {
            var _this = this;
            selector.resolveDependencies = true;
            return this._core.select(selector).then(function (res) {
                var files = res.selection;
                return _this._core.writeFileBulk(files).then(function (paths) {
                    res.written = paths;
                    if(selector.resolveDependencies) {
                        var deps = tsd.DefUtil.extractDependencies(files);
                        if(deps.length > 0) {
                            xm.log('deps:' + deps.join('\n'));
                            return _this._core.writeFileBulk(deps);
                        }
                    }
                    return null;
                }).thenResolve(res);
            });
        };
        API.prototype.info = function (selector) {
            var _this = this;
            return this._core.select(selector).then(function (res) {
                return _this._core.parseDefInfoBulk(res.selection).thenResolve(res);
            });
        };
        API.prototype.history = function (selector) {
            var _this = this;
            return this._core.select(selector).then(function (res) {
                res.definitions = tsd.DefUtil.uniqueDefs(tsd.DefUtil.getDefs(res.selection));
                return _this._core.loadHistoryBulk(res.definitions).thenResolve(res);
            });
        };
        API.prototype.deps = function (selector) {
            var _this = this;
            return this._core.select(selector).then(function (res) {
                return _this._core.resolveDepencendiesBulk(res.selection).thenResolve(res);
            });
        };
        API.prototype.compare = function (selector) {
            return Q.reject(new Error('not implemented yet'));
        };
        API.prototype.update = function (selector) {
            return Q.reject(new Error('not implemented yet'));
        };
        API.prototype.purge = function () {
            return Q.reject(new Error('not implemented yet'));
        };
        return API;
    })();
    tsd.API = API;    
})(tsd || (tsd = {}));
var xm;
(function (xm) {
    var Set = (function () {
        function Set() {
            this._content = [];
        }
        Set.prototype.has = function (value) {
            return this._content.indexOf(value) > -1;
        };
        Set.prototype.add = function (value) {
            if(this._content.indexOf(value) < 0) {
                this._content.push(value);
            }
        };
        Set.prototype.remove = function (value) {
            var i = this._content.indexOf(value);
            if(i > -1) {
                this._content.splice(i, 1);
            }
        };
        Set.prototype.values = function () {
            return this._content.slice(0);
        };
        Set.prototype.import = function (values) {
            for(var i = 0, ii = values.length; i < ii; i++) {
                this.add(values[i]);
            }
        };
        Set.prototype.clear = function () {
            this._content = [];
        };
        Set.prototype.count = function () {
            return this._content.length;
        };
        return Set;
    })();
    xm.Set = Set;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    function padLeft(str, len, char) {
        str = String(str);
        char = String(char).charAt(0);
        while(str.length < len) {
            str = char + str;
        }
        return str;
    }
    function padRight(str, len, char) {
        str = String(str);
        char = String(char).charAt(0);
        while(str.length < len) {
            str = str + char;
        }
        return str;
    }
    function repeat(str, len) {
        return new Array(len).join(str);
    }
    var optimist = require('optimist');
    var ExposeCommand = (function () {
        function ExposeCommand(id, execute, label, options, variadic) {
            if (typeof options === "undefined") { options = []; }
            if (typeof variadic === "undefined") { variadic = []; }
            this.id = id;
            this.execute = execute;
            this.label = label;
            this.options = options;
            this.variadic = variadic;
        }
        ExposeCommand.prototype.init = function () {
        };
        return ExposeCommand;
    })();
    xm.ExposeCommand = ExposeCommand;    
    var Expose = (function () {
        function Expose(title) {
            if (typeof title === "undefined") { title = ''; }
            this.title = title;
            var _this = this;
            this._commands = new xm.KeyValueMap();
            this._options = new xm.KeyValueMap();
            this._commandOpts = [];
            this._isInit = false;
            this._nodeBin = false;
            this.command('help', function () {
                _this.printCommands();
            }, 'usage help');
            this.defineOption({
                name: 'help',
                short: 'h',
                description: 'display usage help',
                type: 'flag',
                default: null,
                placeholder: null,
                command: 'help'
            });
        }
        Expose.prototype.defineOption = function (data) {
            if(this._options.has(data.name)) {
                throw new Error('option id collision on ' + data.name);
            }
            this._options.set(data.name, data);
        };
        Expose.prototype.command = function (id, def, label, options, variadic) {
            if(this._commands.has(id)) {
                throw new Error('id collision on ' + id);
            }
            this._commands.set(id, new ExposeCommand(id, def, label, options, variadic));
        };
        Expose.prototype.init = function () {
            var _this = this;
            if(this._isInit) {
                return;
            }
            this._isInit = true;
            xm.eachProp(this._options.keys(), function (id) {
                var option = _this._options.get(id);
                if(option.short) {
                    optimist.alias(option.name, option.short);
                }
                if(option.type === 'flag') {
                    optimist.boolean(option.name);
                } else if(option.type === 'string') {
                    optimist.string(option.name);
                }
                if(option.hasOwnProperty('default')) {
                    optimist.default(option.name, option.default);
                }
                if(option.command) {
                    _this._commandOpts.push(option.name);
                }
            });
            xm.eachProp(this._commands.keys(), function (id) {
                _this._commands.get(id).init();
            });
        };
        Expose.prototype.executeArgv = function (argvRaw, alt) {
            this.init();
            this._nodeBin = argvRaw[0] === 'node';
            console.log(this._nodeBin);
            var argv = optimist.parse(argvRaw);
            if(!argv || argv._.length === 0) {
                if(alt && this._commands.has(alt)) {
                    this.execute(alt, argv);
                } else {
                    this.execute('help', argv);
                }
                return;
            }
            for(var i = 0, ii = this._commandOpts.length; i < ii; i++) {
                var name = this._commandOpts[i];
                if(argv[name]) {
                    console.log('command opt ' + name);
                    this.execute(this._options.get(name).command, argv);
                    return;
                }
            }
            var use = argv._.shift();
            if(use === 'node') {
                argv._.shift();
            }
            use = argv._.shift();
            if(typeof use === 'undefined') {
                if(alt && this._commands.has(alt)) {
                    console.log('undefined command, use default');
                    this.execute(alt, argv);
                } else {
                    console.log('undefined command');
                    this.execute('help', argv);
                }
            } else if(this._commands.has(use)) {
                this.execute(use, argv);
            } else {
                console.log('command not found: ' + use);
                this.execute('help', argv, false);
            }
        };
        Expose.prototype.execute = function (id, args, head) {
            if (typeof args === "undefined") { args = null; }
            if (typeof head === "undefined") { head = false; }
            this.init();
            if(!this._commands.has(id)) {
                console.log('\nunknown command ' + id + '\n');
                return;
            }
            if(head) {
                console.log('\n-> ' + id + '\n');
            }
            var f = this._commands.get(id);
            f.execute.call(f, args);
        };
        Expose.prototype.printCommands = function () {
            var _this = this;
            if(this.title) {
                console.log(this.title + '\n');
            }
            if(this._commandOpts.length > 0) {
                console.log('global options:\n');
                var opts = [];
                var maxTopOptionLen = 0;
                xm.eachProp(this._commandOpts.sort(), function (name) {
                    var option = _this._options.get(name);
                    var placeholder = option.placeholder ? ' <' + option.placeholder + '>' : '';
                    var tmp = (option.short ? '-' + option.short + ', ' : '') + '--' + option.name + placeholder;
                    opts.push({
                        name: name,
                        usage: tmp,
                        option: option
                    });
                    maxTopOptionLen = Math.max(tmp.length, maxTopOptionLen);
                });
                xm.eachProp(opts, function (opt) {
                    console.log('  ' + padRight(opt.usage, maxTopOptionLen, ' ') + ' : ' + opt.option.description);
                });
                console.log('');
            }
            console.log('commands:\n');
            var maxCommandLen = 0;
            var maxOptionLen = 0;
            var commands = [];
            xm.eachProp(this._commands.keys().sort(), function (id) {
                var data = {
                    id: id,
                    label: id,
                    cmd: _this._commands.get(id),
                    options: []
                };
                if(data.cmd.variadic.length > 0) {
                    data.label += ' <' + data.cmd.variadic.join(', ') + '>';
                }
                maxCommandLen = Math.max(data.label.length, maxCommandLen);
                xm.eachProp(data.cmd.options, function (name) {
                    var option = _this._options.get(name);
                    var placeholder = option.placeholder ? ' <' + option.placeholder + '>' : '';
                    var tmp = (option.short ? '-' + option.short + ', ' : '') + '--' + option.name + placeholder;
                    maxOptionLen = Math.max(tmp.length, maxOptionLen);
                    data.options.push({
                        usage: tmp,
                        option: option
                    });
                });
                commands.push(data);
            });
            var padOpts = '    ';
            xm.eachProp(commands, function (data) {
                console.log('  ' + padRight(data.label, maxCommandLen, ' ') + ' : ' + data.cmd.label);
                xm.eachProp(data.options, function (opt) {
                    console.log(padOpts + padRight(opt.usage, maxOptionLen, ' ') + ' : ' + opt.option.description);
                });
            });
        };
        Expose.prototype.hasCommand = function (id) {
            return this._commands.has(id);
        };
        Expose.prototype.getCommand = function (id) {
            return this._commands.get(id);
        };
        Object.defineProperty(Expose.prototype, "nodeBin", {
            get: function () {
                return this._nodeBin;
            },
            enumerable: true,
            configurable: true
        });
        return Expose;
    })();
    xm.Expose = Expose;    
})(xm || (xm = {}));
var xm;
(function (xm) {
    function pad(number) {
        var r = String(number);
        if(r.length === 1) {
            r = '0' + r;
        }
        return r;
    }
    (function (DateUtil) {
        function toNiceUTC(date) {
            return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + ' ' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes());
        }
        DateUtil.toNiceUTC = toNiceUTC;
    })(xm.DateUtil || (xm.DateUtil = {}));
    var DateUtil = xm.DateUtil;
})(xm || (xm = {}));
var tsd;
(function (tsd) {
    var path = require('path');
    var Q = require('q');
    function getContext(args) {
        xm.assertVar('args', args, 'object');
        var context = new tsd.Context(args.config, args.verbose);
        if(args.dev) {
            context.paths.setTmp(path.join(path.dirname(xm.PackageJSON.find()), 'tmp', 'cli'));
            context.paths.setCache(path.join(path.dirname(xm.PackageJSON.find()), 'cache'));
        }
        return context;
    }
    var defaultJobOptions = [
        'config', 
        'verbose'
    ];
    function jobOptions(merge) {
        if (typeof merge === "undefined") { merge = []; }
        return defaultJobOptions.concat(merge);
    }
    var Job = (function () {
        function Job() { }
        return Job;
    })();    
    function getSelectorJob(args) {
        return Q.fcall(function () {
            var job = new Job();
            if(args._.length === 0) {
                throw new Error('pass one selector pattern');
            }
            job.context = getContext(args);
            job.api = new tsd.API(job.context);
            job.selector = new tsd.Selector(args._[0]);
            return job;
        });
    }
    function runARGV(argvRaw, configPath) {
        var expose = new xm.Expose(xm.PackageJSON.getLocal().getNameVersion());
        expose.defineOption({
            name: 'version',
            short: 'V',
            description: 'display version information',
            type: 'flag',
            default: null,
            placeholder: null,
            command: 'version'
        });
        expose.defineOption({
            name: 'config',
            description: 'path to config file',
            short: 'c',
            type: 'string',
            default: null,
            placeholder: 'path',
            command: null
        });
        expose.defineOption({
            name: 'verbose',
            short: null,
            description: 'verbose output',
            type: 'flag',
            default: null,
            placeholder: null,
            command: null
        });
        expose.defineOption({
            name: 'dev',
            short: null,
            description: 'development mode',
            type: 'flag',
            default: null,
            placeholder: null,
            command: null
        });
        function reportError(err) {
            xm.log('-> ' + 'an error occured!'.red);
            xm.log('');
            xm.log(err);
        }
        function reportSucces(result) {
            xm.log('-> ' + 'success!'.green);
            if(result) {
                xm.log('');
                result.selection.forEach(function (def) {
                    xm.log(def.toString());
                    if(def.info) {
                        xm.log(def.info.toString());
                        xm.log(def.info);
                    }
                });
            }
        }
        function prinDefHead(def) {
            xm.log('');
            xm.log(def.toString());
            xm.log('----');
        }
        function prinFileHead(file) {
            xm.log('');
            xm.log(file.toString());
            xm.log('----');
        }
        function printFileCommit(file) {
            if(file.commit) {
                var line = '   ' + file.commit.commitShort;
                line += ' | ' + xm.DateUtil.toNiceUTC(file.commit.gitAuthor.date);
                line += ' | ' + file.commit.gitAuthor.name;
                if(file.commit.hubAuthor) {
                    line += ' @' + file.commit.hubAuthor.login;
                }
                xm.log(line);
                xm.log('   ' + file.commit.message.subject);
                xm.log('----');
            } else {
                xm.log('   ' + '<no commmit>');
                xm.log('----');
            }
        }
        function printFileInfo(file) {
            if(file.info && file.info.isValid()) {
                xm.log('   ' + file.info.toString());
                xm.log('      ' + file.info.projectUrl);
                file.info.authors.forEach(function (author) {
                    xm.log('      ' + author.toString());
                });
                xm.log('----');
            }
        }
        expose.command('version', function (args) {
            xm.log(xm.PackageJSON.getLocal().version);
        }, 'Display version');
        expose.command('settings', function (args) {
            getContext(args).logInfo(true);
        }, 'Display config settings');
        expose.command('search', function (args) {
            getSelectorJob(args).then(function (job) {
                return job.api.search(job.selector);
            }).done(function (result) {
                reportSucces(null);
                result.selection.forEach(function (file) {
                    prinFileHead(file);
                    printFileInfo(file);
                    printFileCommit(file);
                });
            }, reportError);
        }, 'Search definitions', jobOptions(), [
            'selector'
        ]);
        expose.command('install', function (args) {
            getSelectorJob(args).then(function (job) {
                return job.api.install(job.selector);
            }).done(function (result) {
                reportSucces(null);
                result.selection.forEach(function (file) {
                    prinFileHead(file);
                    printFileInfo(file);
                    printFileCommit(file);
                });
            }, reportError);
        }, 'Install definitions', jobOptions(), [
            'selector'
        ]);
        expose.command('info', function (args) {
            getSelectorJob(args).then(function (job) {
                return job.api.info(job.selector);
            }).done(function (result) {
                reportSucces(null);
                result.selection.forEach(function (file) {
                    prinFileHead(file);
                    printFileInfo(file);
                    printFileCommit(file);
                });
            }, reportError);
        }, 'Show definition details', jobOptions(), [
            'selector'
        ]);
        expose.command('history', function (args) {
            getSelectorJob(args).then(function (job) {
                return job.api.history(job.selector);
            }).done(function (result) {
                reportSucces(null);
                result.definitions.forEach(function (def) {
                    prinDefHead(def);
                    printFileInfo(def.head);
                    def.history.slice(0).reverse().forEach(function (file) {
                        printFileInfo(file);
                        printFileCommit(file);
                    });
                });
            }, reportError);
        }, 'Show definition history', jobOptions(), [
            'selector'
        ]);
        expose.command('deps', function (args) {
            getSelectorJob(args).then(function (job) {
                return job.api.deps(job.selector);
            }).done(function (result) {
                reportSucces(null);
                result.selection.forEach(function (def) {
                    prinFileHead(def);
                    printFileInfo(def);
                    if(def.dependencies.length > 0) {
                        def.dependencies.forEach(function (def) {
                            xm.log(' - ' + def.toString());
                            if(def.dependencies.length > 0) {
                                def.dependencies.forEach(function (def) {
                                    xm.log('    - ' + def.toString());
                                });
                            }
                        });
                        xm.log('----');
                    }
                });
            }, reportError);
        }, 'List dependencies', jobOptions(), [
            'selector'
        ]);
        expose.executeArgv(argvRaw, 'help');
    }
    tsd.runARGV = runARGV;
})(tsd || (tsd = {}));
(module).exports = {
    tsd: tsd,
    xm: xm,
    git: git,
    runARGV: tsd.runARGV,
    getAPI: function (configPath, verbose) {
        if (typeof verbose === "undefined") { verbose = false; }
        xm.assertVar('configPath', configPath, 'string');
        return new tsd.API(new tsd.Context(configPath, verbose));
    }
};