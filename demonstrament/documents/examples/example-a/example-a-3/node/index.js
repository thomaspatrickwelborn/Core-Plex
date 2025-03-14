console.log(
  "\n", "-------------------",
  "\n", "Example A.3. (Node)",
  "\n", "-------------------",
)
import { fileURLToPath } from 'url'
import path from 'path'
import * as inspector from 'node:inspector/promises'
import chokidar from 'chokidar'
import { Core } from '../../../../../../distributement/core-plex.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
inspector.open()
const styleWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.css'))
const scriptWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.js'))
const structWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.html'))
const coreInstance = new Core({ assign: 'on', deassign: 'off' })
// Struct Events
coreInstance.addEvents([{
  path: "styleWatcher", type: "add", 
  target: styleWatcher, listener: ($path) => console.log("add", $path),
}, {
  path: "styleWatcher", type: "change", 
  target: styleWatcher, listener: ($path) => console.log("change", $path),
}, {
  path: "styleWatcher", type: "unlink", 
  target: styleWatcher, listener: ($path) => console.log("unlink", $path),
}, {
  path: "styleWatcher", type: "error", 
  target: styleWatcher, listener: ($err) => console.log("error", $err),
}])
// Script Events
coreInstance.addEvents([{
  path: "scriptWatcher", type: "add", 
  target: scriptWatcher, listener: ($path) => console.log("add", $path),
}, {
  path: "scriptWatcher", type: "change", 
  target: scriptWatcher, listener: ($path) => console.log("change", $path),
}, {
  path: "scriptWatcher", type: "unlink", 
  target: scriptWatcher, listener: ($path) => console.log("unlink", $path),
}, {
  path: "scriptWatcher", type: "error", 
  target: scriptWatcher, listener: ($err) => console.log("error", $err),
}])
// Struct Events
coreInstance.addEvents([{
  path: "structWatcher", type: "add", 
  target: structWatcher, listener: ($path) => console.log("add", $path),
}, {
  path: "structWatcher", type: "change", 
  target: structWatcher, listener: ($path) => console.log("change", $path),
}, {
  path: "structWatcher", type: "unlink", 
  target: structWatcher, listener: ($path) => console.log("unlink", $path),
}, {
  path: "structWatcher", type: "error", 
  target: structWatcher, listener: ($err) => console.log("error", $err),
}])
coreInstance.enableEvents()
console.log(coreInstance.getEvents())