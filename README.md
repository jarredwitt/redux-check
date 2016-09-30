# redux-check
Redux middleware for validating state objects.

Pretty simple redux middleware that lets you run validations against parts of your state or against the action that was dispatched. I was in need of a way to run some validations against parts of my state before they hit redux-saga. My first try was to just write the validation logic in the saga itself, but that didn't seem right so I came up with this piece of middleware. It's pretty basic, the idea is that you use your redux action types as keys to create your validator objects: 
```
export const {
  'user/SAVE': {
    ...
  },
  'setting/SAVE': {
    ...
  }
}
```

A validator object looks like the following:
```
{
  state: 'user',
  validator: (user, action) => {
    if (!user.email) {
      return {
        error: true,
        message: 'User must have an email'
      }
    }
  },
  error: (error) =>. ({
    type: 'user/ERROR',
    message: error.message,
  })
}
```

* state - The part of your state that you want to select. The middleware uses store.getState()['your-state-key'].
* validator - function that receives the state you selected and the action that was dispatched. If the validation did not pass then you must return an object with error set to true. You can include whatever other properties you would like, just make sure that error is set to true. If nothing is returned then the middleware assumes that the validation passed. The action is only passed through to the rest of your middleware if the validation does not result in an error.
* error - The action object that will be dispatched if the validation resulted in an error. Uses store.dispatch() to dispatch an action.

###Setup
```
npm install redux-check --save
```
The order of the middleware does matter. In my case I needed it to run before redux-saga did so I placed it before the redux-saga middleware.
```
import { applyMiddleware, createStore } from 'redux';
import check from 'redux-check';

const validations = {
  'user/SAVE': {
    state: 'user',
    validator: (user, action) => {
      if (!user.email) {
        return {
          error: true,
          message: 'User must have an email'
        }
      }
    },
    error: (error) =>. ({
      type: 'user/ERROR',
      message: error.message,
    })
  },
}

const store = createStore(rootReducer, initialState, applyMiddleware(check(validations)));
```

Pretty simple library. 

License: MIT
