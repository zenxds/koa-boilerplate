import BaseActions from '@components/BaseActions'

// import { HOME_URL } from '@constants'
import * as constants from '../constants'
import store from '../store'

class Actions extends BaseActions {
  async login(data = {}) {
    return await this.post(constants.API_LOGIN, data)
  }

  async smsLogin(data = {}) {
    return await this.post(constants.API_SMS_LOGIN, data)
  }

  async wxLogin(data = {}) {
    return await this.post(constants.API_WX_LOGIN, data)
  }

  async register(data = {}) {
    return await this.post(constants.API_REGISTER, data)
  }

  async sendSMS(data = {}) {
    return await this.post(constants.API_SEND_SMS, data)
  }

  async resendSMS(data = {}) {
    return await this.post(constants.API_RESEND_SMS, data)
  }

  async validSMS(data = {}) {
    return await this.post(constants.API_VALID_SMS, data)
  }

  async validUserExist(data = {}) {
    return await this.post(constants.API_USER_EXIST, data)
  }

  async forgetPassword(data = {}) {
    return await this.post(constants.API_FORGET_PASSWORD, data)
  }

  async resetPassword(data = {}) {
    return await this.post(constants.API_RESET_PASSWORD, data)
  }

  async confirmReset(data = {}) {
    return await this.get(constants.API_CONFIRM_RESET, data)
  }

  async getScene(params = {}) {
    return await this.get(constants.API_GET_SCENE, params, {
      withCredentials: false
    })
  }

  async queryScene(params = {}) {
    return await this.get(constants.API_QUERY_SCENE, params, {
      withCredentials: false
    })
  }

  // getOAuthUrl(scene) {
  //   return `${HOME_URL}/weixin/oauth?scope=snsapi_base&backUrl=` + encodeURIComponent(`${HOME_URL}/weixin/sceneToOfficialAccount?scene=` + encodeURIComponent(scene))
  // }

  async validBind(params = {}) {
    return await this.get(constants.API_VALID_BIND, params)
  }

  async bindPhone(data = {}) {
    return await this.post(constants.API_BIND_PHONE, data)
  }
}

export default new Actions(store)
