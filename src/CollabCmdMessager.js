/**
 * Collab Command Messager which will monitor the ACE event and WS Client Event,
 e.g.
 the ACE event: change, changeCursor and so on
 the WS Client event: OnMessage and so on 
 */
define(['src/ACEAction', 'src/CollabCmdExecutor', 'src/CollabCmdBuilder', 'underscore', 'utils/L'],
    function(ACEAction, CollabCmdExecutor, CollabCmdBuilder, _, L) {
        var protoProps = {

                // ACE editor instances
                _aceEditor: null,
                _aceCurrentSession: null,
                _aceCurrentSelection: null,

                // WS client instance
                _wsClient: null,

                // collab modules
                _cmdExecutor: null,

                /**
                initialize
                */
                initialize: function(options) {
                    var that = this;
                    options = options || {};

                    if (!options.wsClient) {
                        L.throw('please specified the options.wsClient');
                    }

                    if (!options.aceEditor) {
                        L.throw('please specified the options.aceEditor');
                    }

                    that._cmdExecutor = new CollabCmdExecutor(options);

                    that._wsClient = options.wsClient;
                    that._aceEditor = options.aceEditor;
                    ////////////////////////////////////////////////
                    // bind WS Client Event
                    //                    
                    that._wsClient.Event_OnMessage.add(that._event_WS_OnMessage, that);

                    ////////////////////////////////////////////////
                    // bind ACE Event
                    //
                    that._aceCurrentSession = that._aceEditor.getSession();
                    that._aceCurrentSelection = that._aceEditor.getSelection();

                    // handle the ACE events
                    that._aceCurrentSession.on(
                        'change',
                        that._event_ACE_Doc_Changed.bind(that));

                    that._aceCurrentSelection.on(
                        'changeCursor',
                        that._event_ACE_Cursor_Changed.bind(that));
                },

                sendACEActions: function(aceActions) {

                },

                sendCmdJSON: function(cmdJSON) {
                    var that = this,
                        success = false,
                        message;

                    if (cmdJSON && that._wsClient) {
                        message = JSON.stringify(cmdJSON);
                        L.log('send message: ', message);
                        that._wsClient.send(message);
                        success = true;
                    }
                    return success;
                },

                /**
                    ACE events handler
                */
                // ACE doc content change. need send cmd to Collab Server
                // and collabServer will broadcast the cmd to other sessions
                _event_ACE_Doc_Changed: function(changed) {
                    var that = this,
                        aceAction = new ACEAction(changed),
                        cmdJSON = CollabCmdBuilder.buildCollabCmdJSONByACEActions(aceAction);
                    that.sendCmdJSON(cmdJSON);
                    that._cmdExecutor.pushLocalACEActions(aceAction);

                },

                // ACE editor cursor change. Need send cursor pos to Collab Server
                _event_ACE_Cursor_Changed: function(eventType, selection) {
                    L.log(selection);
                },

                /**
                    WS Client events handler
                */
                // WS Client OnMessage Event handler
                _event_WS_OnMessage: function(receivedMsg) {
                    var collabJSON,
                        aceActions;
                    L.log('receive message:', receivedMsg);
                    if (receivedMsg) {
                        collabJSON = JSON.parse(receivedMsg);
                        aceActions = CollabCmdBuilder.buildACEActionsByCollabCmdJSON(collabJSON);

                    }
                },

            },
            // define the constructor
            CollabCmdMessager = function(options) {
                var that = this;
                L.log('creating CollabCmdMessager...');
                that.initialize(options);
            };

        // extend the prototype
        _.extend(CollabCmdMessager.prototype, protoProps);

        return CollabCmdMessager;
    });
