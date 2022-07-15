import { startsWith } from '../src/utils'

test('startsWith', () => {
  expect(startsWith('www.taobao.com', 'www.taobao')).toBeTruthy()
})
