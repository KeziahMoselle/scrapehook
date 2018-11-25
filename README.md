<h2 align="center">ScrapeHook</h2>

### In development...

### Install
`npm install scrapehook`

### Usage
```js
const ScrapeHook = require('scrapehook')

ScrapeHook.observe('https://domain.com')

// No changes detected
ScrapeHook.on('nodiff', () => {
  // Do something
})

// Changes detected
ScrapeHook.on('update', (data) => {
  // Do something
  data.new // New content
  data.old // Old content
})
```

Options
```js
ScrapeHook.observe('https://domain.com', {
  // The URL you want to POST the data
  postUrl: 'https://domain.com/post',
  // The element you want to watch
  // NOTE: `content` is a placeholder for the content you want to watch (it is required)
  element: '<title>content</title>',
  // At which interval you want to scrape ? Default: 5 minutes
  interval: 10*60*1000 // Scrape every 10 minutes
})
```

---
### API
#### .observe(url[, options])
##### url: `String` (The URL you want to observe)

##### options: `Object`
- postUrl `String` (Send a POST request to `postUrl` with `data` as a payload)
- element: `String` (The element you want to watch)
- interval: `Number` Default: `5 minutes`

```js
ScrapeHook.observe('https://domain.com', {
  postUrl: 'https://domain.com/post' // It will send a POST request to this URL which contains old & new data
})
```
The POST request
```json
{
  "new": "New data",
  "old": "Old data"
}
```
If you want to watch the title of a page for example :
Note that `content` will be replaced by the actual content of the web page.
```js
ScrapeHook.observe('https://domain.com', {
  element: '<h1>content</h1>'
})
```
Change the interval
```js
ScrapeHook.observe('https://domain.com', {
  interval: 60*60*1000 // It will scrape every 1 hour
})
```

---
### Events
#### nodiff
Event 'nodiff' is emitted when a website does not change

```js
ScrapeHook.on('nodiff', () => {
  console.log('Same content !')
})
```

#### update
Event 'update' is emitted when a website change

- `data.new` contains the new content
- `data.old` contains the old content

```js
ScrapeHook.on('update', (data) => {
  console.log(data.new) // 'new content'
  console.log(data.old) // 'old content'
})
```
