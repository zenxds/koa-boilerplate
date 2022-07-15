import BaseActions from '@components/BaseActions'

import * as constants from '../constants'
import store from '../store'

class Actions extends BaseActions {
  async login(data = {}) {
    return await this.post(constants.API_LOGIN, data)
  }

  async register(data = {}) {
    return await this.post(constants.API_REGISTER, data)
  }
}

export default new Actions(store)
