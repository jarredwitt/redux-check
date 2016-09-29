"use strict";

var _validations = void 0;
module.exports = function (validations) {
  _validations = validations;
  return function (store) {
    return function (next) {
      return function (action) {
        var validation = _validations[action.type];

        if (!validation) return next(action);

        var state = store.getState()[validation.state];

        var result = validation.validator(state, action);

        if (!result) {
          return next(action);
        }

        if (validation.error) {
          return store.dispatch(validation.error(result));
        }
      };
    };
  };
};
