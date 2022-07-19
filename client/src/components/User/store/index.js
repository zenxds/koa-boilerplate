import { observable, computed } from 'mobx'

class Store {
  @observable isLogin = !!window.user
  @observable user = window.user ? JSON.parse(window.user) : {}

  @computed get username() {
    return this.user.username
  }
}

export default new Store()
