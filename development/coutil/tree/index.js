import * as path from '../path/index.js'
import typedObjectLiteral from '../typed-object-literal/index.js'
import regularExpressions from '../regular-expressions/index.js'
function get($path, $source) {
  const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
  const key = subpaths.pop()
  let subtarget = $source
  for(const $subpath of subpaths) { subtarget = subtarget[$subpath] }
  return subtarget[key]
}
function set($path, $source) {
  const {
    keypaths, key, typeofRoot
  } = path.parse($path)
  const target = typedObjectLiteral(typeofRoot)
  let subtarget = target
  for(const $subpath of keypaths) {
    if(Number($subpath)) { subtarget[$subpath] = [] }
    else { subtarget[$subpath] = {} }
    subtarget = subtarget[$subpath]
  }
  subtarget[key] = $source
  return target
}
export { get, set }