//https://cdn.wilddog.com/sdk/js/2.1.2/wilddog-sync.js
define(['signal', 'underscore', 'utils/C', 'utils/GUID', 'utils/L', 'Wilddog'],
    function(Signal, _, C, G, L, wilddog) {
        var protoProps = {
                _collabId: null,
                _sessionId: null,
                _nickName: null,
                _websocket: null,
                _hasBeenOpened: null,
                _collabServerAddr: null,
                _portraitUrl: null,
                // the logon userId, e.g. test1@163.com
                // the value will be uploaded to collab server when creating session
                // then when the client ask modifiers between specified version,
                // the collab server will return the userIds
                _userId: null,
                // sessionType:
                // 0 -- normal session
                // 1 -- readonly session which won't be counted into the session limitation
                // 2 -- owner session which is the note owner
                _sessionType: null,
                // use 0 to indicate the unknown custom error
                // TODO: we should have different custom error codes to control the webapp's behavior
                // the possible webapp behaviors:
                // 1, don't re-connect   -- customCode >= 9500
                // 2, ask customer to decide whether re-connect   --- 9000<= customCode <= 9499
                // 3, auto-re-connect -- other customCode
                // we should have a good plan for the customCode and WebApp behavior
                _unkownCustomErrorCode: 0,
                _connProtocol: 'ws',
                _buildVersion: null,



                ////////////////////////////////////////////////////////
                /////// WS event handling methods /////////
                ///////////////////////////////////////////////////////
                Event_OnMessage: new Signal(),

                /**
                Event triggered when ws connection opened
                */
                onOpen: function() {
                    L.log('WSConnection has been opened.');
                    this._hasBeenOpened = true;

                },
                /**
                Event triggered when ws connection closed
                */
                onClose: function(event) {
                    var that = this,
                        customCode = event.reason || that._unkownCustomErrorCode,
                        errorMessage,
                        errorInfo;
                    // notify the bulbeditor about the session close
                    that.trigger('ws-on-close', that._sessionId);

                    if (isNaN(customCode)) {
                        errorMessage = customCode;
                        customCode = that._unkownCustomErrorCode;
                    } else {
                        customCode = parseInt(customCode, 10);
                        switch (customCode) {
                            case 2000:
                                errorMessage = '连接总数超过上限';
                                break;
                            case 2001:
                                errorMessage = '单个文件连接总数超过上限';
                                break;
                            case 3000:
                                errorMessage = '转发命令失败';
                                break;
                            case 3001:
                                errorMessage = '更新版本号失败';
                                break;
                            case 3002:
                                errorMessage = '发送命令失败';
                                break;
                            case 3003:
                                errorMessage = '命令转发进程无响应';
                                break;
                            case 3004:
                                errorMessage = '创建链接失败';
                                break;
                            case 3005:
                                errorMessage = '创建命令转发进程失败';
                                break;
                            case 3006:
                                errorMessage = '广播命令失败';
                                break;
                            case 3007:
                                errorMessage = '初始化链接失败';
                                break;
                            case 4000:
                                errorMessage = '执行命令失败';
                                break;
                            default:
                                errorMessage = '未知错误';
                                break;
                        }
                    }

                    if (event.code === 1000 && customCode === that._unkownCustomErrorCode) {
                        errorMessage = '协同服务器已关闭';
                    }
                    errorInfo = {
                        'code': event.code,
                        'customCode': customCode,
                        'reason': errorMessage
                    };
                    that.trigger(
                        'yne-session-closed', errorInfo);
                },
                /**
                Event triggered when receive message from collab server
                */
                onMessage: function(event) {
                    var that = this,
                        receivedMsg = event.data;

                    that.Event_OnMessage.dispatch(receivedMsg);
                },
                ////////////////////////////////////////////////////////
                /////// customized methods /////////
                ///////////////////////////////////////////////////////
                /**
                get ws connection state
                */
                getState: function() {
                    var that = this;
                    return that._websocket.readyState;
                },
                /**
                get current sessionId
                */
                getSessionId: function() {
                    return this._sessionId;
                },
                /**
                get current collabId
                collabId means the file which is in collab by multi-sessions
                */
                getCollabId: function() {
                    return this._collabId;
                },
                getNickname: function() {
                    return this._nickName;
                },
                getUserId: function() {
                    return this._userId;
                },
                /**
                method to close the websocket
                */
                close: function(customCode, reason) {
                    var that = this,
                        errorInfo;
                    if (that._websocket) {
                        that._websocket.onopen = null;
                        that._websocket.onclose = null;
                        that._websocket.onmessage = null;
                        that._websocket.onerror = null;
                        that._websocket.close();
                        if (customCode) {
                            // only tirgger close event when customCode specified
                            // this is used for non-web-app triggered close
                            errorInfo = {
                                'code': 0,
                                'customCode': customCode,
                                'reason': reason
                            };
                            that.trigger(
                                'session-closed', errorInfo);
                        }
                    }
                },

                /**
                 * send message to collab server by websocket
                 * @param {String} message
                 *
                 */
                send: function(message) {
                    var that = this;
                    var success = false;
                    if (that._websocket.readyState === that._websocket.OPEN) {                        
                        that._websocket.send(message);
                        success = true;
                    }
                    return success;
                },
                setNickname: function(nickname) {
                    this._nickName = nickname;
                },
                /**
                build the websocket connection
                */
                _buildConnection: function(options) {
                    var that = this,
                        websocketURL;

                    if (!window.WebSocket) {
                        throw 'host does not support WebSocket';
                    }

                    // parse out the ws options
                    that._collabId = options.shareKey;
                    that._nickName = options.userInfo.nickname;
                    that._collabServerAddr = options.collabServer.address;
                    
                    if (options.testSessionId) {
                        that._sessionId = options.testSessionId;
                    } else {
                        that._sessionId = G.newGUID();
                    }
                    if (options.collabServer.useWSS) {
                        that._connProtocol = 'wss';
                    }

                    // build the connection URL with params
                    websocketURL = that._connProtocol + '://' + that._collabServerAddr +
                        '?' + C.OPTIONS_COLLABID + '=' + window.encodeURI(that._collabId) +
                        '&' +
                        C.OPTIONS_NICKNAME + '=' + window.encodeURI(that._nickName) +
                        '&' +
                        C.OPTIONS_SESSIONID + '=' + window.encodeURI(that._sessionId);

                    L.log('Connecting to ' + websocketURL);
                    that._websocket = new WebSocket(websocketURL);
                    that._websocket.onopen = that.onOpen.bind(that);
                    that._websocket.onclose = that.onClose.bind(that);
                    that._websocket.onmessage = that.onMessage.bind(that);
                },
            },

            // define the constructor
            WildDogClient = function(options) {
                var that = this;
                that._buildConnection(options);
            };

        _.extend(WildDogClient.prototype, protoProps);
        return WildDogClient;
    });
