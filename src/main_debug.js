/**
the App enties which will load the ACE module
*/
window.DEBUG = true;
require.config({
    baseUrl: '.',
    enforceDefine: true,
    paths: {
        ace: 'ace_lib',
        //backbone: 'libs/backbone-min-1.3.3',
        //jquery: 'libs/jquery-3.1.0.slim.min',
        signal:'libs/signals.min',
        underscore: 'libs/underscore.min',
        utils: 'src/utils',

    },
    name: "src/main_debug",
    out: "dist/coding.mini.debug.js",
});
define(['ace/ace', 'src/CollabCodeEditor'], function(ACE, CodeEditor) {
    window.Editor = new CodeEditor({
        aceOptions: {
            ace: ACE,
            theme: 'ace/theme/tomorrow_night',
            mode: 'ace/mode/javascript'
        },
        wsOptions: {
            shareKey: 'javascript0',

            collabServer: {
                address: 'localhost:8088'
            },

            userInfo: {
                nickname: 'testUser',
            },
        }
    });
});