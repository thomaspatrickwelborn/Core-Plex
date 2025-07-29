console.log(
  "\n", "------------",
  "\n", "Example A.2.",
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
const completed = {
  styles: {
    add: [], change: [], unlink: []
  },
  scripts: {
    add: [], change: [], unlink: []
  },
  structs: {
    add: [], change: [], unlink: []
  },
}
const watchers = {
  styleWatcher: chokidar.watch(path.join(__dirname, 'some-files/index.css')),
  scriptWatcher: chokidar.watch(path.join(__dirname, 'some-files/index.js')),
  structWatcher: chokidar.watch(path.join(__dirname, 'some-files/index.html')),
}
const core = Core.implement(watchers, {
  events: {
    // Styles
    'styleWatcher add': function styleWatcherAdd($path) {
      console.log("add", $path)
      completed.styles.add.push($path)
    },
    'styleWatcher change': function styleWatcherChange($path) {
      console.log("change", $path)
      completed.styles.change.push($path)
    },
    'styleWatcher unlink': function styleWatcherUnlink($path) {
      console.log("unlink", $path)
      completed.styles.unlink.push($path)
    },
    // Scripts
    'scriptWatcher add': function scriptWatcherAdd($path) {
      console.log("add", $path)
      completed.scripts.add.push($path)
    },
    'scriptWatcher change': function scriptWatcherChange($path) {
      console.log("change", $path)
      completed.scripts.change.push($path)
    },
    'scriptWatcher unlink': function scriptWatcherUnlink($path) {
      console.log("unlink", $path)
      completed.scripts.unlink.push($path)
    },
    // Structs
    'structWatcher add': function structWatcherAdd($path) {
      console.log("add", $path)
      completed.structs.add.push($path)
    },
    'structWatcher change': function structWatcherChange($path) {
      console.log("change", $path)
      completed.structs.change.push($path)
    },
    'structWatcher unlink': function structWatcherUnlink($path) {
      console.log("unlink", $path)
      completed.structs.unlink.push($path)
    },
  },
  enableEvents: true,
  assign: 'on', deassign: 'off', 
})
core.getEvents().forEach(($eventDefinition) => {
  $eventDefinition.assigned.forEach(($enabledEvent) => console.log(JSON.stringify({
    enable: $enabledEvent.enable,
    path: $enabledEvent.path,
  }, null, 2)))
})
// Add Files
for(const $filepath of [
  './some-files/index.css', './some-files/index.html', './some-files/index.js'
]) {
  const filepath = path.join(__dirname, $filepath)
  await writeFile(filepath, "", { encoding: 'utf8' })
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

const { promise, resolve, reject } = Promise.withResolvers()
setTimeout(() => resolve(), 1000)
await promise

console.log("pass", (
  completed.styles.add.length === 1 &&
  completed.styles.change.length === 1 &&
  completed.styles.unlink.length === 1 &&
  completed.scripts.add.length === 1 &&
  completed.scripts.change.length === 1 &&
  completed.scripts.unlink.length === 1 &&
  completed.structs.add.length === 1 &&
  completed.structs.change.length === 1 &&
  completed.structs.unlink.length === 1
))