console.log(
  "\n", "------------",
  "\n", "Example A.5.",
  "\n", "------------",
)
import { writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import * as inspector from 'node:inspector/promises'
import chokidar from 'chokidar'
import Core from '../../../../../distributement/core-plex.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
inspector.open()
const styleWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.css'))
const scriptWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.js'))
const structWatcher = chokidar.watch(path.join(__dirname, 'some-files/index.html'))
const coreInstance = new Core({ assign: 'on', deassign: 'off' })
const completed = {
  styles: { add: [], change: [], unlink: [], error: [] },
  scripts: { add: [], change: [], unlink: [], error: [] },
  structs: { add: [], change: [], unlink: [], error: [] },
}
// Struct Events
coreInstance.addEvents([{
  path: "styleWatcher", type: "add", 
  target: styleWatcher, listener: ($path) => {
    console.log("add", $path)
    completed.styles['add'].push($path)
  },
}, {
  path: "styleWatcher", type: "change", 
  target: styleWatcher, listener: ($path) => {
    console.log("change", $path)
    completed.styles['change'].push($path)
  },
}, {
  path: "styleWatcher", type: "unlink", 
  target: styleWatcher, listener: ($path) => {
    console.log("unlink", $path)
    completed.styles['unlink'].push($path)
  },
}, {
  path: "styleWatcher", type: "error", 
  target: styleWatcher, listener: ($err) => {
    console.log("error", $err)
    completed.styles['error'].push($path)
  },
}])
// Script Events
coreInstance.addEvents([{
  path: "scriptWatcher", type: "add", 
  target: scriptWatcher, listener: ($path) => {
    console.log("add", $path)
    completed.scripts['add'].push($path)
  },
}, {
  path: "scriptWatcher", type: "change", 
  target: scriptWatcher, listener: ($path) => {
    console.log("change", $path)
    completed.scripts['change'].push($path)
  },
}, {
  path: "scriptWatcher", type: "unlink", 
  target: scriptWatcher, listener: ($path) => {
    console.log("unlink", $path)
    completed.scripts['unlink'].push($path)
  },
}, {
  path: "scriptWatcher", type: "error", 
  target: scriptWatcher, listener: ($err) => {
    console.log("error", $err)
    completed.scripts['error'].push($path)
  },
}])
// Struct Events
coreInstance.addEvents([{
  path: "structWatcher", type: "add", 
  target: structWatcher, listener: ($path) => {
    console.log("add", $path)
    completed.structs['add'].push($path)
  },
}, {
  path: "structWatcher", type: "change", 
  target: structWatcher, listener: ($path) => {
    console.log("change", $path)
    completed.structs['change'].push($path)
  },
}, {
  path: "structWatcher", type: "unlink", 
  target: structWatcher, listener: ($path) => {
    console.log("unlink", $path)
    completed.structs['unlink'].push($path)
  },
}, {
  path: "structWatcher", type: "error", 
  target: structWatcher, listener: ($err) => {
    console.log("error", $err)
    completed.structs['error'].push($path)
  },
}])
.enableEvents()
const enabledEvents = coreInstance.getEvents({ enable: true })
console.log(enabledEvents)
// Add Files
for(const $filepath of [
  './some-files/index.css', './some-files/index.html', './some-files/index.js'
]) {
  const filepath = path.join(__dirname, $filepath)
  await writeFile(filepath, "a", { encoding: 'utf8' })
}
// Change
await new Promise(($resolve, $reject) => {
  setTimeout(() => $resolve(), 1000)
})
for(const $filepath of [
  './some-files/index.css', './some-files/index.html', './some-files/index.js'
]) {
  const filepath = path.join(__dirname, $filepath)
  await writeFile(filepath, "", { encoding: 'utf8' })
}
// Unlink
await new Promise(($resolve, $reject) => {
  setTimeout(() => $resolve(), 1000)
})
for(const $filepath of [
  './some-files/index.css', './some-files/index.html', './some-files/index.js'
]) {
  const filepath = path.join(__dirname, $filepath)
  await rm(filepath, { force: true })
}
const { promise, resolve } = Promise.withResolvers()
setTimeout(resolve, 1000)
await promise
console.log(completed)
console.log("pass", (
  completed.styles.add.length === 1 &&
  completed.styles.change.length === 1 &&
  completed.styles.unlink.length === 1 &&
  completed.styles.error.length === 0 &&
  completed.scripts.add.length === 1 &&
  completed.scripts.change.length === 1 &&
  completed.scripts.unlink.length === 1 &&
  completed.scripts.error.length === 0 &&
  completed.structs.add.length === 1 &&
  completed.structs.change.length === 1 &&
  completed.structs.unlink.length === 1 &&
  completed.structs.error.length === 0
))
