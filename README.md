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

Webhook.on('nodiff', () => {
  // No changes detected
})

Webhook.on('update', (data) => {
  // Changes detected
})
```

Options
```js
Webhook.observe('https://domain.com', {
  postUrl: 'https://domain.com/post',
  interval: 10*60*1000
})
```

### API

#### .observe(url, [options])
##### url
Type: `String`

The URL you want to observe

##### options
Type: `Object`

~~###### postUrl~~

~~Type: `String`~~

~~Send a POST request to `postUrl` with `data` as a payload~~

###### interval
Type: `Number`

Default: `5 minutes`

#### .on('nodiff', function)
Event 'nodiff' is emitted when a website does not change
##### function
Type: `Function`

#### .on('update', function)
Event 'update' is emitted when a website change
##### function
Type: `Function`

~~Argument: `data`~~

~~`data` contains what has changed~~
