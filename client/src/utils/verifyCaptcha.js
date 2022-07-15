import { CAPTCHA_APP_KEY } from '@constants'

export default function (options = {}) {
  const div = document.createElement('div')
  document.body.appendChild(div)

  return new Promise((resolve) => {
    const captcha = _dx.Captcha(div, Object.assign({
      appKey: CAPTCHA_APP_KEY,
      style: 'popup',
      mutableHeight: true,
      qLink: true,
      success: token => {
        captcha.hide()

        resolve(token)
      },
    }, options))

    captcha.on('hide', function () {
      document.body.removeChild(div)
    })

    captcha.show()
  })
}
