import { action, toJS } from 'mobx'
import { get, post } from '@utils/request'

export default class BaseActions {
  constructor(store) {
    this.store = store
  }

  @action
  merge(target = {}, src) {
    if (!src) {
      src = target
      target = this.store
    }

    if (target.merge) {
      target.merge(src)
    } else {
      Object.assign(target, src)
    }
  }

  mergeConditions = (type, params = {}) => {
    this.merge(this.store[type + 'Conditions'], params)
  }

  @action
  resetConditions(type) {
    const conditions = this.store[type + 'Conditions']
    const newConditions = new this.store.constructor()[type + 'Conditions']

    conditions.replace(toJS(newConditions))
    this.merge({
      [type + 'FetchId']: new Date().getTime(),
    })
  }
}

BaseActions.prototype.get = get
BaseActions.prototype.post = post
