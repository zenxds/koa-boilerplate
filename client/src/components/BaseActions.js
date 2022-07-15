import { action } from 'mobx'
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
}

BaseActions.prototype.get = get
BaseActions.prototype.post = post
