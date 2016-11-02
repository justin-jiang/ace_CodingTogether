/**
 * 
 */
define(['underscore', 'utils/C', 'utils/GUID', 'utils/L'], function(_, C, G, L) {
    var CollabCmdBuilder = {

        buildPingJSON: function(collabVersion) {
            var that = this,
                cmdArgs = {};
            cmdArgs.collabVersion = collabVersion;
            return that.buildCollabCmdJSON(C.NONDATACMD_CLINTPONG, cmdArgs);
        },
        buildACEActionsByCollabCmdJSON: function(collabCmdJSON){
            var that = this,
                aceActions = [];
            if (!collabCmdJSON) {
                L.throw('collabCmdJSON should not be null');
            }

            // JSON.
            // if (!_.isArray(collabCmdJSON)) {
            //     collabCmdJSON = [collabCmdJSON];
            // }

            // _.each(co)
        },
        buildCollabCmdJSONByACEActions: function(aceActions) {
            var that = this,
                cmdJSON = {},
                cmdArray = [],
                collabJSON = {};
            if (!aceActions) {
                L.throw('aceActions should not be null');
            }
            if (!_.isArray(aceActions)) {
                aceActions = [aceActions];
            }


            collabJSON[C.CJSON_DATACOMMANDS] = cmdArray;
            _.each(aceActions, function(action, index) {
                cmdJSON = action.toCollabJSON();
                cmdJSON[C.CJSON_COMMANDID] = G.newGUID();
                cmdArray[index] = cmdJSON;
            });

            return collabJSON;
        },
        /*
        buld non-data collab command, e.g. CollabClose, CollabInfo and so on
        */
        buildCollabCmdJSON: function(cmdName, cmdArgs) {
            var that = this,
                cmdJSON = {},
                cmdArray = [],
                collabJSON = {};

            cmdArray[0] = cmdJSON;
            cmdJSON[C.CJSON_ACTION] = cmdName;
            cmdJSON[C.CJSON_COMMANDID] = G.newGUID();
            collabJSON[C.CJSON_NONDATACOMMANDS] = cmdArray;
            switch (cmdName) {

                case C.NONDATACMD_CLINTPONG:
                    // notify the current note version to collabServer
                    cmdJSON[C.CJSON_NOTEVERSIONUPDATE] = cmdArgs.collabVersion;
                    break;

                default:
                    collabJSON = null;
                    L.error('Failed to build Cmd JSON', cmdName, cmdArgs);
            }

            return collabJSON;
        },

    };

    return CollabCmdBuilder;
});
