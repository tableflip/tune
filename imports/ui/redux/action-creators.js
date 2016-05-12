import * as Actions from './actions'

export function setSpinnerVisible (state) {
  return { type: Actions.SET_SPINNER_VISIBLE, state }
}

export function setFooterVisible (state) {
  return { type: Actions.SET_FOOTER_VISIBLE, state }
}

export function setRouteParams (params) {
  return { type: Actions.SET_ROUTE_PARAMS, params }
}

export function setRouteQueryParams (queryParams) {
  return { type: Actions.SET_ROUTE_QUERY_PARAMS, queryParams }
}

export function updatePageDetails (ctx) {
  return { type: Actions.UPDATE_PAGE_DETAILS, ctx }
}

export function setSlideDirection (direction) {
  return { type: Actions.SET_SLIDE_DIRECTION, direction }
}

export function incrementPageCount () {
  return { type: Actions.INCREMENT_PAGE_COUNT, count: 1 }
}

export function setPreferredSlideDirection (direction) {
  return { type: Actions.SET_PREFERRED_SLIDE_DIRECTION, direction: direction }
}

export function preventChildSwipe () {
  return { type: Actions.PREVENT_CHILD_SWIPE }
}
