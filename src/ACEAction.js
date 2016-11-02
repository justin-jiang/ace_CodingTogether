/**
 * 
 */
define(['underscore', 'utils/L'], function(_, L) {
    var protoProps = {
            _aceChangeObj: null,
            /**
            initialize
            */
            initialize: function(aceChangeObj) {
                var that = this;

                if (!aceChangeObj) {
                    L.throw('please specified the aceChangeObj');
                }
                that._aceChangeObj = aceChangeObj;
            },

            toCollabJSON: function() {
                var that = this;
                return that._aceChangeObj;
            },

        },
        // define the constructor
        ACEAction = function(aceChangeObj) {
            var that = this;
            L.log('creating ACEAction...');
            that.initialize(aceChangeObj);
        };

    // extend the prototype
    _.extend(ACEAction.prototype, protoProps);

    return ACEAction;
});
