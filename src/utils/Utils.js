/**
Utils help methods
*/
define(function () {
    

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



