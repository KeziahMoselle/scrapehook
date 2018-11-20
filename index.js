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
   * Set URL
   * Set interval
   * Set firstRequest to true
   * Set oldBody
   * Begin to scrape
   *
   * @param {object} data
   * @memberof Webhook
   */
  observe (url = '', options = {}) {
    // Check if url is empty
    if (url === '') throw new Error('Missing first argument : url')
    // Check if url is passed (must be)
    if (arguments.length === 0) throw new Error('Insufficient number of arguments')
    // Check type of url (should be a string)
    if (typeof url !== 'string') throw new TypeError(`Expected string, got ${typeof url} : url`)
    // Check type of options
    if (arguments.length === 2) {
      // Check type of each key of options
      // Check type of options (should be an object)
      if (typeof options !== 'object') throw new TypeError(`Expected object, got ${typeof options}`)
      // Check if interval is set
      if (options.interval) {
        // Check type of interval (should be a number)
        if (typeof options.interval !== 'number') throw new TypeError(`Expected number, got ${typeof options.interval}`)
      }
    }
    // Set parameters
    this.url = url
    this.interval = options.interval || 5*60*1000

    // Set properties
    this.firstRequest = true
    this.oldBody = ''

    // Start scraping
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


  /**
   * POST request to the provided POST url
   * POST only if compare return false
   * POST the data which changed
   * 
   * @memberof Webhook
   */
  post () {
    // TODO
  }
  
}

module.exports = new Webhook()
