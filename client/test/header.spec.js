import React from 'react'
import { mount } from 'enzyme'

import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import injects from '../src/inject'
import Header from '../src/components/Header'

test('header', () => {
  const wrapper = mount(<Provider {...injects}><Router><Header /></Router></Provider>)

  expect(wrapper.html()).toBeTruthy()
})
