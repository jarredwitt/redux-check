let _validations;
export default validations => {
  _validations = validations;
  return store => next => action => {
    const validation = _validations[action.type];

    if (!validation) return next(action);

    const state = store.getState()[validation.state];

    const result = validation.validator(state, action);

    if (!result) {
      return next(action);
    }

    if (validation.error) {
      return store.dispatch(validation.error(result));
    }
  };
}
