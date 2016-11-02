/**
the App enties which will load the ACE module
*/
window.DEBUG = true;
require.config({
    baseUrl: '..',
    paths: {
        ace: 'ace_lib',
        signal:'libs/signals.min',
        underscore: 'libs/underscore-min-1.8.3',
        utils: 'src/utils'
    },
    name: "src/main",
    out: "../dist/coding.mini.js",
});
require(['ace/ace', 'src/CollabCodeEditor'], function(ACE, CodeEditor) {
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
