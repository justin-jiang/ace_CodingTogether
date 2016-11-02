/**
 *  为面向对象提供基类
 */
define(['underscore'], function(_) {

    /**
    @Param {Object} protoProps -- the props will be inserted into prototype
        which will be inherited by the new instance
    @Param {Object} staticProps -- the props will be inserted into Class
        which will NOT be contained by new instance
    */
    var ParentClass,
        extend = function(protoProps, staticProps) {
        var ParentClass = this,
            SubClass;

        // The constructor function for the new subclass is either defined
        // by you (the "constructor" property in your `extend` definition),
        // or defaulted by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            SubClass = protoProps.constructor;
        } else {
            SubClass = function() {
                return ParentClass.apply(this, arguments);
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(SubClass, parent, staticProps);

        // use the parent instance as the SubClass prototype which implements
        // the inheritance logic
        SubClass.prototype = new ParentClass();

        // Add prototype properties (instance properties) to the subclass        
        if (protoProps) {
            _.extend(SubClass.prototype, protoProps);
        }

        SubClass.extend = ParentClass.extend;

        return SubClass;
    };


    /**
    constructor
    */
    function Class(options) {
        var that = this;
        that.options = _.extend({}, options);
        that.testMethod = function() {};
    }

    // static method of extend, used to declare subclass
    // for example, SubClass = Class.extend({}/*protoProps*/, {}/*staticProps*/);
    Class.extend = extend;
    Class.staticMethod = function() {};


    return Class;

});
