import * as Variables from '../variables/index.js'
import * as Path from '../path/index.js'
import * as Tree from '../tree/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
export default function expandTree($root, $tree) {
  const typeofRoot = typeof $root
  const typeofTree = typeof $tree
  if(
    !['string', 'function'].includes(typeofTree)
  ) { return undefined }
  let tree
  if($root && typeofRoot === 'object') {
    iterateRootEntries: 
    for(const [$rootKey, $rootValue] of Object.entries($root)) {
      if(typeofTree === 'string') { tree = Tree.set($tree, $rootValue) }
      else if(typeofTree === 'function') { tree = $tree($rootValue) }
    }
  }
  else {
    if(typeofTree === 'string') { tree = Tree.set($tree, $root) }
    else if(typeofTree === 'function') { tree = $tree($root) }
  }
  return tree
}