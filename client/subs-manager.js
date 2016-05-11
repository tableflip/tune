import { Tracker } from 'meteor/tracker'
import { setSpinnerVisible } from './redux/action-creators'
import store from './redux/store'

window.Subs = new SubsManager()

Tracker.autorun(() => {
  if (window.Subs.ready()) {
    store.dispatch(setSpinnerVisible(false))
  } else {
    store.dispatch(setSpinnerVisible(true))
  }
})
