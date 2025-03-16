| [⁘ Core-Plex](../../../README.md) | [Guide](../index.md) | *Core* |
| :--  | :-- | :-- |
# ⁘ Core-Plex Guide \| Core

New `Core` instances, `Core.implement` assignments, and extended `Core` instances accept a `settings` parameter.  
```
const settings = {
  events: { 'some.event.target click': function eventTargetClick($event) { ... } }
}
```
*then instantiate*  
```
new Core(settings)
```
*or implement*  
```
Core.implement(new EventTarget(), settings)
```
*or inherit*  
```
class CustomCore extends Core {
  constructor($settings = {}) {
    super($settings)
  }
}
new CustomCore(settings)
```
