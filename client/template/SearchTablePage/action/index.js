import BaseActions from '@components/BaseActions'
import * as apis from '../constants/apis'
import store from '../store'

class Actions extends BaseActions {
  getList = (params = {}) => {
    return this.get(apis.API_GET_LIST, params)
  }

  createItem = (params = {}) => {
    return this.post(apis.API_CREATE_ITEM, params)
  }

  editItem = (params = {}) => {
    return this.post(apis.API_EDIT_ITEM, params)
  }

  deleteItem = (params = {}) => {
    return this.post(apis.API_DELETE_ITEM, params)
  }
}

export default new Actions(store)
