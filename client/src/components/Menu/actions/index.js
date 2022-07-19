import BaseActions from '@components/BaseActions'

import paths from '@constants/paths'
import { menus } from '../constants'
import store from '../store'

class Actions extends BaseActions {
  getMenus = async() => {
    this.merge({
      menus: addInfo(menus),
    })
  }
}

// 为menu增加code和path
function addInfo(arr = [], level = 1) {
  return arr.map(item => {
    item.level = level

    if (paths[item.code]) {
      item.path = paths[item.code]
    }

    if (item.children && item.children.length) {
      item.children = addInfo(item.children, level + 1)
    }

    return item
  })
}

export default new Actions(store)
