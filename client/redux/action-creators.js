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

export function setPageIndices (indices) {
  return { type: Actions.SET_PAGE_INDICES, indices }
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
