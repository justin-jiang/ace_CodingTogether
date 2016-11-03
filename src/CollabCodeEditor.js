define(['src/CollabCmdBuilder', 'src/CollabCmdMessager', 'src/WebSocketClient', 'underscore', 'utils/L'],
    function(CmdBuilder, Messager, WSClient, _, L) {
        var protoProps = {
                // ACE instance
                _ace: null,
                // ACE editor instance
                _aceEditor: null,
                _aceCurrentSession: null,
                _aceCurrentSelection: null,
                // the ACE Div containder ID
                _aceDivContainerId: 'editor',

                _collabClient: null,

                _collabMessager: null,

                /**
                initialize the ACE
                */
                initializeACE: function(options) {
                    var that = this,
                        aceOptions;
                    options = options || {};

                    if (!options.aceOptions) {
                        throw 'please specified the options.aceOptions';
                    }

                    aceOptions = options.aceOptions;
                    that._ace = aceOptions.ace;
                    that._aceEditor = that._ace.edit(that._aceDivContainerId);

                    aceOptions.wrap = true;
                    aceOptions.highlightActiveLine = true;
                    aceOptions.showPrintMargin = false;

                    if (aceOptions.theme) {
                        that._ace.config.setModuleUrl(
                            aceOptions.theme, that._parseModuleUrl(aceOptions.theme));
                    }
                    if (aceOptions.mode) {
                        that._ace.config.setModuleUrl(
                            aceOptions.mode, that._parseModuleUrl(aceOptions.mode));
                        that._ace.config.setModuleUrl(
                            aceOptions.mode + '_worker',
                            that._parseModuleUrl(aceOptions.mode + '_worker'));
                    }

                    that._aceEditor.setOptions({
                        wrap: aceOptions.wrap,
                        highlightActiveLine: aceOptions.highlightActiveLine,
                        showPrintMargin: aceOptions.showPrintMargin,
                        theme: aceOptions.theme,
                        mode: aceOptions.mode
                    });

                    that._aceEditor.resize();
                },

                /**
                initialize content
                @param {String} sharedKey -- the key for the collab file
                */
                initializeCollabContent: function(sharedKey) {
                    var that = this,
                        pingJSON = CmdBuilder.buildPingJSON(0);
                    that._collabMessager.sendCmdJSON(pingJSON);
                },

                /**
                initialize the ACE and Websocket Event binding
                */
                initializeEventBinding: function() {
                    var that = this;
                    that._collabMessager = new Messager({
                        collabClient: that._collabClient,
                        aceEditor: that._aceEditor
                    });
                },
                /**
                initialize the Websocket client
                */
                initializeWSClient: function(options) {
                    var that = this,
                        wsOptions;
                    options = options || {};

                    if (!options.wsOptions) {
                        throw 'please specified the options.wsOptions';
                    }

                    if (!that._ace || !that._aceEditor) {
                        throw 'please initialize ACE before initializing Websocket';
                    }

                    wsOptions = options.wsOptions;
                    that._collabClient = new WSClient(wsOptions);
                },

                /**
                parse out the mode or theme URL
                */
                _parseModuleUrl: function(modeOrTheme) {
                    var modeThemeRegex = /^ace\/(theme|mode)\/\w+$/i,
                        workerRegex = /^ace\/mode\/\w+_worker$/i,
                        values,
                        result;
                    if (workerRegex.test(modeOrTheme)) {
                        values = modeOrTheme.split('/');
                        values[2] = values[2].replace('_worker', '');
                        result = 'ace_lib/worker-' + values[2] + '.js';
                    } else if (modeThemeRegex.test(modeOrTheme)) {
                        values = modeOrTheme.split('/');
                        result = 'ace_lib/' + values[1] + '-' + values[2] + '.js';
                    } else {
                        throw 'invalid mode or theme format';
                    }

                    return result;
                }
            },
            // define the constructor
            CodeEditor = function(options) {
                var that = this;
                L.log('creating CollabCodeEditor...');
                that.initializeACE(options);
                that.initializeWSClient(options);
                that.initializeEventBinding();
                that.initializeCollabContent(options.wsOptions.sharedKey);
            };

        // extend the prototype
        _.extend(CodeEditor.prototype, protoProps);

        return CodeEditor;
    });
