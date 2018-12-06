module.exports=function(e){var t={};function __webpack_require__(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,__webpack_require__),o.l=!0,o.exports}return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},__webpack_require__.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,t){if(1&t&&(e=__webpack_require__(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(__webpack_require__.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)__webpack_require__.d(r,o,function(t){return e[t]}.bind(null,o));return r},__webpack_require__.n=function(e){var t=e&&e.__esModule?function getDefault(){return e.default}:function getModuleExports(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=0)}([function(e,t,r){const o=r(1),n=r(2);e.exports=new class ScrapeHook extends o{observe(e="",t={}){if(""===e)throw new Error("Missing first argument : url");if(0===arguments.length)throw new Error("Insufficient number of arguments");if("string"!=typeof e)throw new TypeError(`Expected url = string, got ${typeof e} : url`);if(2===arguments.length){if("object"!=typeof t)throw new TypeError(`Expected options = object, got ${typeof t}`);if(t.interval&&"number"!=typeof t.interval)throw new TypeError(`Expected options.interval = number, got ${typeof t.interval}`);if(t.postUrl&&"string"!=typeof t.postUrl)throw new TypeError(`Expected options.postUrl = string, got ${typeof t.postUrl}`);if(t.element&&"string"!=typeof t.element)throw new TypeError(`Expected options.element = string, got ${typeof t.element}`)}this.url=e,this.interval=t.interval||3e5,this.postUrl=t.postUrl||void 0,this.element=t.element||void 0,this.firstRequest=!0,this.oldBody="",this.body="",this.scrape()}scrape(){setInterval(()=>{n.get(this.url,e=>{let t="";e.on("data",e=>{t+=e}),e.on("end",()=>{if(this.firstRequest)return this.oldBody=t,this.firstRequest=!1;this.compare(t,this.oldBody)})}).on("error",e=>{throw new Error(e)})},this.interval)}compare(e,t){if(this.element){const r=this.scrapeElement(e),o=this.scrapeElement(t);r===o?(this.emit("nodiff"),this.oldBody=e):(this.emit("update",{new:r,old:o}),this.postUrl&&this.post({new:r,old:o}),this.oldBody=e)}else e===t?(this.emit("nodiff"),this.oldBody=e):(this.emit("update",{new:e,old:this.oldBody}),this.postUrl&&this.post({new:e,old:this.oldBody}),this.oldBody=e)}post(e){const t=JSON.stringify(e),r={method:"POST",headers:{"Content-Type":"application/json","Content-Length":t.length}},o=n.request(this.postUrl,r);o.write(t),o.on("error",e=>new Error(e)),o.end()}scrapeElement(e){const t=this.element.replace("content","(.*)");return new RegExp(t).exec(e)[1]}}},function(e,t){e.exports=require("events")},function(e,t){e.exports=require("https")}]);