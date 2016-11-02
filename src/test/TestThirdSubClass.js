define(['TestSubClass'], function(BaseClass) {
    var ThirdSubClass = BaseClass.extend({
        testProp: null,
        constructor: function(options) {
            this.testProp = options.testProp;
        },
        testThirdSubMethod: function() {
            window.console.log(this.testProp);
        }
    });

    return ThirdSubClass;
});
