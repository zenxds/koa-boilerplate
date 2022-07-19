import { observable } from 'mobx'

class Store {
  @observable loading = false
}

export default new Store()
