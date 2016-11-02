/**
 * 
 */
define(['src/ACEAction', 'src/CollabCmdBuilder', 'underscore', 'utils/L'],
    function(ACEAction, CollabCmdBuilder, _, L) {
        var protoProps = {

                // the pending sent
                _toBeSentLocalACEChangeQueue: null,

                /**
                initialize
                */
                initialize: function(options) {
                    var that = this;
                    that._toBeSentLocalACEChangeQueue = [];
                },
                /**
                execute the ACEActions built from CollabCmds
                will be invoked from when WS Client OnMessage happens
                */
                executeACEActions: function(aceActions) {

                },

                /**
                push local ACE Document Change
                */
                pushLocalACEActions: function(aceActions) {
                    var that = this;
                    if (aceActions) {
                        if (!_.isArray(aceActions)) {
                            that._toBeSentLocalACEChangeQueue.push(aceActions);
                        } else {
                            _.each(aceActions, function(action) {
                                that._toBeSentLocalACEChangeQueue(action);
                            });
                        }
                    }
                },

            },
            // define the constructor
            CollabCmdExecutor = function(options) {
                var that = this;
                L.log('creating CollabCmdExecutor...');
                that.initialize(options);
            };

        // extend the prototype
        _.extend(CollabCmdExecutor.prototype, protoProps);

        return CollabCmdExecutor;
    });
