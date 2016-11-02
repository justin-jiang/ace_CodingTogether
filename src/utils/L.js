/**
 * Log模块
 */

define(function() {
    var global = this,
        // compatible with window.logLevel which is deprecated
        debug = global.DEBUG || global.logLevel != null,
        nativeConsole = global.console,
        retConsole = {},
        noop = function() {},
        logMethods =
        'log warn error time timeEnd profile profileEnd'.split(' '),
        idx = logMethods.length,
        method;


    //TODO 适配移动端
    while (--idx >= 0) {
        method = logMethods[idx];

        if (debug && nativeConsole[method]) {
            retConsole[method] = nativeConsole[method].bind(nativeConsole);
        } else {
            retConsole[method] = noop;
        }
    }

    retConsole.DEBUG = debug;
    retConsole.throw = function(message) {
        if (retConsole.DEBUG) {
            window.alert(message);
        } else {
            retConsole.error(message);
        }
    }
    return retConsole;
});
