const Webhook = require('./src/webhook')

Webhook.observe({
  url: 'https://keziahmoselle.fr/',
  interval: 10*1000
})

Webhook.on('diff', () => {
  console.log('diff')
})

Webhook.on('nodiff', () => {
  console.log('nodiff')
})
