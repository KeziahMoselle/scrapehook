<h2 align="center">Webhook</h2>

### In development...

### Todos

- [ ] Add the Webhook POST url
- [ ] Add `data` as a payload for the POST url

### Install
`npm install @keziahmoselle/webhook`

### Usage
```js
const Webhook = require('@keziahmoselle/webhook')

Webhook.observe('https://domain.com')

// No changes detected
Webhook.on('nodiff', () => {
  // Do something
})

// Changes detected
Webhook.on('update', (data) => {
  data.now // New content
  data.old // Old content
})
```

Options
```js
Webhook.observe('https://domain.com', {
  // The URL you want to POST the data
  postUrl: 'https://domain.com/post',
  // The element you want to watch
  // NOTE: `content` is a placeholder for the content you want to watch (it is required)
  element: '<title>content</title>',
  // At which interval you want to scrape ?
  // Default: 5 minutes
  interval: 10*60*1000
})
```

### API

#### .observe(url[, options])
##### url
Type: `String`

The URL you want to observe

##### options
Type: `Object`

~~###### postUrl~~

~~Type: `String`~~

~~Send a POST request to `postUrl` with `data` as a payload~~

###### element
Type: `String`

The element you want to watch. If you want to watch the title of a page for example :
```js
Webhook.observe('https://domain.com', {
  element: '<h1>content</h1>'
})
```
Note that `content` will be replaced by the actual content of the web page.

###### interval
Type: `Number`

Default: `5 minutes`
```js
Webhook.observe('https://domain.com', {
  interval: 60*60*1000 // It will scrape every 1 hour
})
```

#### .on('nodiff', function)
Event 'nodiff' is emitted when a website does not change
##### function
Type: `Function`

#### .on('update', function)
Event 'update' is emitted when a website change
##### function
Type: `Function`

Argument: `data` (Type: `Object`)

`data.new` contains what has changed

`data.old` contains the old content
