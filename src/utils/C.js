/**
 * Const String
 */
define(function() {
    

    return { 

        // Options in ws connection request
        // NOTE: ***PLEASE KEEP THE FOLLOWING CONST CONSISTENT WITH SERVER***
        OPTIONS_COLLABID: 'collabId',
        OPTIONS_NICKNAME: 'nickname',
        OPTIONS_NOTEVERSION: 'noteVersion',
        OPTIONS_PORTRAIT: 'portraitUrl',
        OPTIONS_SESSIONTYPE: 'sessionType',
        OPTIONS_SESSIONID: 'sessionId',
        OPTIONS_USERID: 'userId', 
        OPTIONS_BUILDVERSION: 'buildVersion',  


        // Collab Command Key and Value
        // NOTE: ***PLEASE KEEP THE FOLLOWING CONST CONSISTENT WITH SERVER***
        CJSON_ACTION: 'action',
        CJSON_COMMANDID: 'cmdId',
        CJSON_DATACOMMANDS:'dataCmd',
        CJSON_NONDATACOMMANDS: 'nondataCmds',
        CJSON_NOTEVERSIONUPDATE: 'versionUpdate',
        NONDATACMD_CLINTPONG: 'nb_clientPong',  

    };

});
