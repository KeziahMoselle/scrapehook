const EventEmitter = require('events')
const https = require('https')

/**
 * ScrapeHook class
 *
 * @class ScrapeHook
 * @extends {EventEmitter}
 */
class ScrapeHook extends EventEmitter {
  /**
   * Initialize the ScrapeHook
   * Set URL
   * Set interval
   * Set firstRequest to true
   * Set oldBody
   * Begin to scrape
   *
   * @param {object} data
   * @memberof ScrapeHook
   */
  observe (url = '', options = {}) {
    // Check if url is empty
    if (url === '') throw new Error('Missing first argument : url')
    // Check if url is passed (must be)
    if (arguments.length === 0) throw new Error('Insufficient number of arguments')
    // Check type of url (should be a string)
    if (typeof url !== 'string') throw new TypeError(`Expected url = string, got ${typeof url} : url`)
    // Check type of options
    if (arguments.length === 2) {
      // Check type of each key of options
      // Check type of options (should be an object)
      if (typeof options !== 'object') throw new TypeError(`Expected options = object, got ${typeof options}`)
      // Check if interval is set
      if (options.interval) {
        // Check type of interval (should be a number)
        if (typeof options.interval !== 'number') throw new TypeError(`Expected options.interval = number, got ${typeof options.interval}`)
      }
      // Check if postUrl is set
      if (options.postUrl) {
        // Check type of postUrl (should be a string)
        if (typeof options.postUrl !== 'string') throw new TypeError(`Expected options.postUrl = string, got ${typeof options.postUrl}`)
      }
      // Check if element is set
      if (options.element) {
        // Check type of interval (should be a string)
        if (typeof options.element !== 'string') throw new TypeError(`Expected options.element = string, got ${typeof options.element}`)
      }
    }
    // Set parameters
    this.url = url
    this.interval = options.interval || 5*60*1000 // Default: 5 minutes
    this.postUrl = options.postUrl || undefined
    this.element = options.element || undefined

    // Set properties
    this.firstRequest = true
    this.oldBody = ''
    this.body = ''

    // Start scraping
    this.scrape()
  }

  /**
   * Fetch the body of a page
   * Executed every this.interval (default: 5min)
   * Call compare() when response end
   *
   * @memberof ScrapeHook
   */
  scrape () {
    setInterval(() => {

      https.get(this.url, (response) => {
        let body = ''

        response.on('data', (chunk) => {
          body += chunk
        })

        response.on('end', () => {
          // If it's the first request, set the body of reference
          if (this.firstRequest) {
            this.oldBody = body
            return this.firstRequest = false
          }
          // Compare the two bodies
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
   * Emit 'update' when body !== oldBody
   *
   * @param {string} body
   * @param {string} oldBody
   * @returns {boolean}
   * @memberof ScrapeHook
   */
  compare (body, oldBody) {
    // Perform regex if an element has been precised
    if (this.element) {
      const newContent = this.scrapeElement(body)
      const oldContent = this.scrapeElement(oldBody)
      if (newContent === oldContent) {
        this.emit('nodiff')
        this.oldBody = body
      } else {
        this.emit('update', {
          new: newContent,
          old: oldContent
        })
        if (this.postUrl) {
          this.post({
            new: newContent,
            old: oldContent
          })
        }
        this.oldBody = body
      }
    } else {
      // Or check the entire body
      if (body === oldBody) {
        this.emit('nodiff')
        this.oldBody = body
      } else {
        this.emit('update', {
          new: body,
          old: this.oldBody
        })
        if (this.postUrl) {
          this.post({
            new: body,
            old: this.oldBody
          })
        }
        this.oldBody = body
      }
    }
  }


  /**
   * POST request to the provided POST url
   * POST only if compare return false
   * POST the data which changed
   * 
   * @memberof ScrapeHook
   */
  post (payload) {
    const data = JSON.stringify(payload)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    const request = https.request(this.postUrl, options)
    request.write(data)
    request.on('error', (error) => new Error(error))
    request.end()
  }


  /**
   * Fetch the content of an element
   * Ex : <h1>Hello World !</h1>
   * Will return : 'Hello World !'
   *
   * @param {string} body
   * @returns {string} content of `element`
   * @memberof ScrapeHook
   */
  scrapeElement (body) {
    // Replace 'content' by (.*) -> Catch content in the element
    const element = this.element.replace('content', '(.*)')
    // Create the regex
    const regex = new RegExp(element)
    // Return the content of the element
    return regex.exec(body)[1]
  }
  
}

module.exports = new ScrapeHook()
