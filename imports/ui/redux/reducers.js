import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import * as Actions from './actions'
import { collectionKeyRegex } from '/imports/lib/validation/validator'

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

function subscriptions (subs = { individual: {}, ready: true }, action) {
  var newIndividual
  switch (action.type) {
    case Actions.ADD_SUB:
      newIndividual = Object.assign({}, subs.individual, { [action.id]: true })
      return {
        individual: newIndividual,
        ready: false
      }
    case Actions.REMOVE_SUB:
      newIndividual = Object.assign({}, subs.individual)
      delete newIndividual[action.id]
      return {
        individual: newIndividual,
        ready: !newIndividual.length
      }
    default:
      return subs
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
  parent: null,
  child: null
}

function pageDetails (details = defaultPageDetails, action) {
  let offset = {
    left: -0.1,
    right: 0.1
  }
  let newDetails = Object.assign({}, details)
  switch (action.type) {
    case Actions.UPDATE_PAGE_DETAILS:
      return Object.assign(newDetails, getPageDetails(action.ctx, details))
    case Actions.SET_PREFERRED_SLIDE_DIRECTION:
      newDetails.current.index += offset[action.direction]
      return newDetails
    case Actions.PREVENT_CHILD_SWIPE:
      newDetails.child = null
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
  pageCount,
  subscriptions,
  routing: routerReducer
})

export default app

function getPageDetails (ctx, details) {
  console.log(ctx)
  let newDetails = {
    previous: Object.assign({}, details.current),
    current: Object.assign({}, ctx),
    parent: ctx.parentFn && ctx.parentFn(ctx.params, ctx.queryParams),
    child: null
  }
  if (ctx.childFn) {
    newDetails.child = ctx.childFn(ctx.params, ctx.queryParams)
  } else if (ctx.index > details.current.index) {
    newDetails.child = Object.assign({}, details.current)
  }

  // If we're looking at a field within an object within a collection
  var collectionDetails = collectionKeyRegex.exec(ctx.queryParams.field)
  if (ctx.name === 'page-edit' && collectionDetails) newDetails.current.index = 5

  return newDetails
}
