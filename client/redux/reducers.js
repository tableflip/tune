import { combineReducers } from 'redux'
import * as Actions from './actions'

function spinnerVisible (state = false, action) {
  switch (action.type) {
    case Actions.SET_SPINNER_VISIBLE:
      return action.state
    default:
      return state
  }
}

function footerVisible (state = true, action) {
  switch (action.type) {
    case Actions.SET_FOOTER_VISIBLE:
      return action.state
    default:
      return state
  }
}

function routeParams (params = {}, action) {
  switch (action.type) {
    case Actions.SET_ROUTE_PARAMS:
      return action.params || {}
    default:
      return params
  }
}

function routeQueryParams (queryParams = {}, action) {
  switch (action.type) {
    case Actions.SET_ROUTE_QUERY_PARAMS:
      return action.queryParams || {}
    default:
      return queryParams
  }
}

function pageIndices (indices = { current: 0, previous: -1 }, action) {
  switch (action.type) {
    case Actions.SET_PAGE_INDICES:
      return Object.assign({}, indices, action.indices)
    default:
      return indices
  }
}

function slideDirection (direction = 'left', action) {
  switch (action.type) {
    case Actions.SET_SLIDE_DIRECTION:
      return action.direction
    default:
      return direction
  }
}

function pageCount (count = 0, action) {
  switch (action.type) {
    case Actions.INCREMENT_PAGE_COUNT:
      return count + action.count
    default:
      return count
  }
}

const app = combineReducers({
  spinnerVisible,
  footerVisible,
  routeParams,
  routeQueryParams,
  pageIndices,
  slideDirection,
  pageCount
})

export default app
