import * as Variables from '../variables/index.js'
import * as Path from '../path/index.js'
import * as Tree from '../tree/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
export default function impandTree($root, $tree) {
  const typeofTree = typeof $tree
  const typeofRoot = typeof $root
  if(
    !['string', 'function'].includes(typeofTree) ||
    typeofRoot && typeofRoot !== 'object'
  ) { return $root }
  let tree = typedObjectLiteral($root)
  if(typeofRoot === 'object') {
    iterateRootEntries: 
    for(const [$rootKey, $rootValue] of Object.entries($root)) {
      if(typeofTree === 'string') { tree[$rootKey] = Tree.get($tree, $rootValue) }
      else if(typeofTree === 'function') { tree[$rootKey] = $tree($rootValue) }
      if(tree[$rootKey] && typeof tree[$rootKey] === 'object') {
        tree[$rootKey] = impandTree(tree[$rootKey], $tree)
      }
    }
  }
  return tree
}