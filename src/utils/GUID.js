/**
generate a GUID
*/
define(function () {
    var GUID;
    GUID = {
        _possible: 'abcdefghijklmnopqrstuvwxyz',
        lastGUID: '',
        /* generate GUID which matches NCName */
        newGUID: function () {
            var uniqueStr = '';
            this.date = new Date();

            // start with 2 random number
            uniqueStr += Math.floor(Math.random() * 100);

            // here we use a random string
            for (var i = 0; i < 4; i++) {
                uniqueStr += this._possible[Math.floor(Math.random() * 26)];
            }

            // get current time
            uniqueStr += this.date.getTime();
            if (uniqueStr !== this.lastGUID) {
                this.lastGUID = uniqueStr;
                return uniqueStr;
            } else {
                return this.newGUID();
            }
        }
    };

    return {

        newGUID: function () {
            return GUID.newGUID();
        },

        isValid: function (guid) {
            var unvalidValues = ['null', 'undefined'];
            if (!guid || unvalidValues.indexOf(guid + '') > -1) {
                return false;
            }
            return true;
        }
    };
});



