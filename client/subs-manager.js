import * as ActionCreators from './redux/action-creators'
import store from './redux/store'

Subs = new SubsManager()

Tracker.autorun(() => {
  if (Subs.ready()) {
    store.dispatch(ActionCreators.setSpinnerVisible(false))
  } else {
    store.dispatch(ActionCreators.setSpinnerVisible(true))
  }
});
