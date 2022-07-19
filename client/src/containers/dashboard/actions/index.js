import BaseActions from '@components/BaseActions'
import * as constants from '../constants'
import store from '../store'

class Actions extends BaseActions {
  getMsg() {
    return this.get(constants.API_MSG)
  }
}

export default new Actions(store)
