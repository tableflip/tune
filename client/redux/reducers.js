import { combineReducers } from 'redux'
import * as Actions from './actions'

const initialState = {
  spinnerVisible: false
}

function spinnerVisible (state = false, action) {
  switch (action.type) {
    case Actions.SET_SPINNER_VISIBLE:
      return action.state
    default:
      return state
  }
}

const app = combineReducers({
  spinnerVisible
})

export default app
