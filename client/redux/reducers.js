import { combineReducers } from 'redux'
import * as Actions from './actions'
import { collectionKeyRegex } from '/lib/imports/validator'
import store from './store'

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

let defaultPageDetails = {
  current: {
    name: '',
    index: 0,
    params: {},
    queryParams: {}
  },
  previous: {
    name: '',
    index: -1,
    params: {},
    queryParams: {}
  },
  parent: {
    name: '',
    params: {},
    queryParams: {}
  },
  child: {
    name: '',
    params: {},
    queryParams: {}
  }
}

function pageDetails (details = defaultPageDetails, action) {
  let offset = {
    left: -0.1,
    right: 0.1
  }
  switch (action.type) {
    case Actions.UPDATE_PAGE_DETAILS:
      return Object.assign({}, details, getPageDetails(action.ctx, details))
    case Actions.SET_PREFERRED_SLIDE_DIRECTION:
      let newDetails = Object.assign({}, details)
      newDetails.current.index += offset[action.direction]
      return newDetails
    default:
      return details
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
  pageDetails,
  slideDirection,
  pageCount
})

export default app

function getPageDetails (ctx, details) {
  let index = ctx.route.options.index
  let newDetails = {}
  newDetails.previous = Object.assign({}, details.current)
  newDetails.current = {
    name: ctx.route.name,
    index: index,
    params: Object.assign({}, ctx.params),
    queryParams: Object.assign({}, ctx.queryParams)
  }
  if (newDetails.previous.index > newDetails.current.index) newDetails.child = Object.assign({}, newDetails.previous)
  newDetails.parent = {
    name: ctx.route.options.parent,
    params: Object.assign({}, ctx.params),
    queryParams: Object.assign({}, ctx.queryParams)
  }

  // Special cases from here
  var collectionDetails = collectionKeyRegex.exec(ctx.queryParams.field)
  if (ctx.route.name === 'page-edit' && collectionDetails) newDetails.current.index = 5
  return newDetails
}
