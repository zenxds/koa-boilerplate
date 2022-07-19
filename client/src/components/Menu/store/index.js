import { observable, computed } from 'mobx'

class Store {
  @observable menus = []

  @computed get pathMap() {
    const map = {}

    function walk(list) {
      list.forEach(item => {
        if (item.children) {
          walk(item.children)
        }

        map[item.path] = {
          code: item.code,
          path: item.path,
          name: item.name,
        }
      })
    }

    walk(this.menus)
    return map
  }

  @computed get parentMap() {
    const map = {}

    function walk(list, parentCode) {
      list.forEach(item => {
        if (item.children) {
          walk(item.children, item.code)
        }

        if (parentCode) {
          map[item.code] = parentCode
        }
      })
    }

    walk(this.menus)
    return map
  }
}

export default new Store()
