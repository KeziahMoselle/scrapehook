const EventEmitter = require('events')
const https = require('https')

class Webhook extends EventEmitter {

  start (data) {
    this.url = data.url
    this.interval = data.interval || 5*60*1000
    this.scrape()
  }

  scrape () {
    setInterval(() => {

      https.get(this.url, (response) => {
        let data = ''

        response.on('data', (chunk) => {
          data += chunk
        })

        response.on('end', () => {
          console.log(data)
        })
      }).on('error', (error) => {
        throw new Error(error)
      })

    }, this.interval);
  }
  
}

module.exports = new Webhook()