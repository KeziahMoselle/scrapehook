const EventEmitter = require('events')
const https = require('https')

/**
 * Webhook class
 *
 * @class Webhook
 * @extends {EventEmitter}
 */
class Webhook extends EventEmitter {
  /**
   * Initialize the Webhook 
   *
   * @param {object} data
   * @memberof Webhook
   */
  start (data) {
    this.url = data.url
    this.interval = data.interval || 5*60*1000
    this.firstRequest = true
    this.oldBody = ''
    this.scrape()
  }

  /**
   * Fetch the body of a page
   * Executed every this.interval (default: 5min)
   * Call compare() when response end
   *
   * @memberof Webhook
   */
  scrape () {
    setInterval(() => {

      https.get(this.url, (response) => {
        let body = ''

        response.on('data', (chunk) => {
          body += chunk
        })

        response.on('end', () => {
          if (this.firstRequest) {
            console.log('Set oldBody for the first time')
            this.oldBody = body
            return this.firstRequest = false
          }
          this.compare(body, this.oldBody)
        })
      }).on('error', (error) => {
        throw new Error(error)
      })

    }, this.interval);
  }
  
  /**
   * Return true when the oldBody is equal to the actual body received
   * Emit 'nodiff' when body === oldBody
   * Emit 'diff' when body !== oldBody
   *
   * @param {string} body
   * @param {string} oldBody
   * @returns {boolean}
   * @memberof Webhook
   */
  compare (body, oldBody) {
    if (body === oldBody) {
      this.oldBody = body
      this.emit('nodiff')
      return true
    } else {
      this.oldBody = body
      this.emit('diff')
      return false
    }
  }
  
}

module.exports = new Webhook()
