define(['src/Class'], function(BaseClass) {
    var SubClass = BaseClass.extend({
        testProp: null,
        constructor: function(options) {
            if(options){
                this.testProp = options.testProp;
            }
            
        },
        testSubMethod: function() {
            window.console.log(this.testProp);
        }
    });

    return SubClass;
});
