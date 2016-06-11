### v7.4.6
- Fix a bug in the template preventing toggling the state of the node in some cases.
- Make it possible to select more than one node while in filtered mode (#101)

### v7.4.5
- Minor tweaks to package.json

### v7.4.4
- Release in Bower

### v7.4.3
- Fix preselect not working properly with quoted numbers.

### v7.4.2
- Add Bower support.

### v7.4.1
- Assign new output model only if something actually changed.
- Add a signal in the API for opening/closing a particular/all instance/s of AMS.

### v7.4.0
- Stop emitting the output model in the 'ams_output_model_change' event as we already have access to that data.
- Add an event for when the input model has been changed.

### v7.3.2
- Better handle empty output in outputModelIterator filter.

### v7.3.1
- Emit 'ams_output_model_change' after the model has been changed.

### v7.3.0
- Add an event for when the output model has been changed.

### v7.2.1
- Output model isn't required anymore. This will allow the output model to be assigned 'undefined'.

### v7.2.0
- Now it's possible to assign a default value that will be shown if nothing is checked (outputModelIterator filter).

### v7.1.2
- Do not crash if 'preselect' property is an empty string.

### v7.1.1
- Make it possible to controll all AMS instances with the API via the '\*' selector.

### v7.1.0
- Add a signals/events based API.

### v7.0.4
- Items container should be re-positioned after queries that modify the number of visible items.

### v7.0.3
- More fixes related to items container positioning in corner cases.

### v7.0.2
- Fix wrong positioning of the items container in certain cases.

### v7.0.1
- Fix a bad typo in the code preventing items to repaint after a check.

### v7.0.0
- Better support for Angular <1.4
- Dropdown label syntax has been changed to allow further customization.
- Now AMS will broadcast events on un/checking and opening/closing items.

### v6.3.3
##### Added / Updated
- More performance improvements.

### v6.3.2
##### Added / Updated
- Performance improvements by as much as 80%.
- Fixed a deadlock that would happen in certain cases when processing big data.

### v6.3.1
##### Added / Updated
- Fixed a bug in 'to_internal' that would cause bad '$ams_parents_id' generation in certain cases.
- Make items text non-selectable.
- Added 'toggle-open-state-nodes-checked-state-leafs-on-label-click' mod.

### v6.3.0
##### Added / Updated
- Added 'mods'.
- Added 'toggle-checked-state-on-label-click' mod.
- Added 'toggle-open-state-on-label-click' mod.

### v6.2.1
##### Added / Updated
- Fixed i18n-ES minification protection.

### v6.2.0
##### Added / Updated
- Now it is possible to make multiple preselections with 'preselect' attribute.

### v6.1.0
##### Added / Updated
- Now it is possible to create the dropdown label with values from the items in the output model.

### v6.0.7
##### Added / Updated
- Fix a bug related to keyboard handling.

### v6.0.6
##### Added / Updated
- Improvements in the keyboard handler.

### v6.0.5
##### Added / Updated
- Fix buggy global CSS styles generation.

### v6.0.4
##### Added / Updated
- CSS fixes.
- Code cleanup.

### v6.0.3
##### Added / Updated
- CSS fixes and improvements.

### v6.0.2
##### Added / Updated
- Fixed a bug causing AMS to crash in some cases.
- Make sure to run specs with min files.

### v6.0.1
##### Added / Updated
- Reworked how .map files are generated.

### v6.0.0
##### Added / Updated
- Major rewrite. Directive attributes have been changed. Please read docs.
- Angular Multi Select has been split into several parts.
- LokiJS is used to manage the data.
- Upgraded all the code to ES6.
- Reworked Grunt tasks.
- Reworked entirely the specs.
- Reworked CSS. Upgraded to CSS3 with heavy dependency on Flex.
- Improved minification process.
- Massive speed improvements (tests are done with up to 50k elements).
- Bower support has been removed.

### v5.5.8
##### Added / Updated
- Make output models optional for better Angular (1.4.9+) compatibility.

### v5.5.7
##### Added / Updated
- Unit tests fixes.

### v5.5.6
##### Added / Updated
- Bower fixes.

### v5.5.5
##### Added / Updated
- Fix malformed bower.json

### v5.5.5
##### Added / Updated
- Revert PR 44. NPM and Bower should stay separated.

### v5.5.4
##### Added / Updated
- Possibility to turn off automatic toggling of children/parents.
- CSS cleanup.
- Possibility to use non-default interpolation symbols.
- New API method that allows selection of various items at the same time.

### v5.5.3
##### Added / Updated
- Wrong tag.

### v5.5.2
##### Added / Updated
- Wrong tag.

### v5.5.1
##### Added / Updated
- Wrong tag.

### v5.5.0
##### Added / Updated
- Changed dist directory.

### v5.4.1
##### Added / Updated
- Disable outline on the directive. (CSS)

### v5.4.0
##### Added / Updated
- Major performance improvement by removing the scan/merge parent scopes.
- The item label and button label syntax has changed. Please check docs before upgrading.

### v5.3.21
##### Added / Updated
- Empty selection should trigger an empty string single-output-model.

### v5.3.20
##### Added / Updated
- Wrap API calls inside a 0 $timeout.

### v5.3.19
##### Added / Updated
- Do not uncheck items if they are already checked when using the 'select' API method.

### v5.3.18
##### Added / Updated
- Avoid out of time outputModel replacement.

### v5.3.17
##### Added / Updated
- Wait for DOM ops to finish before starting the directive. (delay-start)
- Better handle wrong values for 'preselect-value'.

### v5.3.16
##### Added / Updated
- Fix a bug when filtering/searching.

### v5.3.15
##### Added / Updated
- Make the single output model mode return a leaf.

### v5.3.14
##### Added / Updated
- Avoid nesting changes inside a $digest.
- Allow to preselect multiple values

### v5.3.13
##### Added / Updated
- Fix a bug with single output model mode.

### v5.3.12
##### Added / Updated
- Make it possible to configure the output model data.

### v5.3.11
##### Added / Updated
- Allow setting a limit to the number of selected items.

### v5.3.10
##### Added / Updated
- Improve performance.

### v5.3.9
##### Added / Updated
- Make it possible to map a single object/value to an output model.

### v5.3.8
##### Added / Updated
- Make it possible to pre-select items via properties.

### v5.3.7
##### Added / Updated
- Scan all $parents when creating labels for the button or for the items.
- Don't copy AngularJS internal values when creating labels.

### v5.3.6
##### Added / Updated
- Don't force the height of the items layer.

### v5.3.5
##### Added / Updated
- Small performance improvements.

### v5.3.4
##### Added / Updated
- Show that none is selected in btn-data.htm template when nothing is selected.

### v5.3.3
##### Added / Updated
- Fix a bug causing the 'setFocus' directive not receiving '$timeout' when minified.
- Now the button label can be styled with any variable from the item itself or from the parent scope.

### v5.3.2
##### Added / Updated
- The directive now exports a simple API that can be used for control purpose.

### v5.3.1
##### Added / Updated
- Fix smart positioning not working quite as expected.

### v5.3.0
##### Added / Updated
- Button icons are part of the CSS now.
- Removed the icons config.

### v5.2.1
##### Added / Updated
- Bring back button customization.
- Now the container layer will be placed on top or on the right of the button if there is no enough space.

### v5.2.0
##### Added / Updated
- Trigger callbacks after applying all the changes (on next tick).
- Show the layer on the left/top of the button if there is no enough space.

### v5.1.5
##### Added / Updated
- Handle destroy event (prevent possible memory leak).

### v5.1.4
##### Added / Updated
- Output model wasn't updated when everything was deselected.

### v5.1.3
##### Added / Updated
- jQuery is still needed for development and testing.

### v5.1.2
##### Added / Updated
- Remove jQuery from the dependencies in package.json.

### v5.1.1
##### Added / Updated
- Performance optimizations (stop $interpolating on each rendered item).

### v5.1.0
##### Added / Updated
- Simplify interpolation process and start using curly braces for it.

### v5.0.9
##### Added / Updated
- jQuery is not required anymore.

### v5.0.8
##### Added / Updated
- Close all other instances of the widget before opening it.

### v5.0.7
##### Added / Updated
- The dropdown is closed after selecting an item if in single mode.

### v5.0.6
##### Added / Updated
- Now it's possible to use vars from the parent scope in the item's label text.

### v5.0.5
##### Added / Updated
- Require grunt-contrib-jasmine >=v0.7.0
- Require jasmine-jquery >= 2.0.0

### v5.0.4
##### Added / Updated
- Require grunt-contrib-uglify >=v0.5.0

### v5.0.3
##### Added / Updated
- Require grunt-contrib-cssmin >=v0.10.0

### v5.0.2
##### Added / Updated
- Fixed a bug with 'Select All' selecting everything while in single mode.
- Implementing support for hidden elements.
- Implement unit tests using Jasmine.

### v5.0.1
##### Added / Updated
- Callbacks have been restored.
- Support dynamic data change of the input data.

### v5.0.0
##### Added / Updated
- Major rewrite of the project.
- The input data format has changed, please read docs.

### v4.0.6
##### Added / Updated
- Ignore more files in the NPM package.

### v4.0.5
##### Added / Updated
- Fixed minified version of JS file.

### v4.0.4
##### Added / Updated
- Add min version of the CSS and the JS files.

### v4.0.3
##### Added / Updated
- Apply some of the PRs from the original project.

### v4.0.2
##### Added / Updated
- Convert spaces to tabs.
- Clean indent style.

### v4.0.1
##### Added / Updated
- I'm forking this project as original project doesn't seem to have any activity.
- Renaming files to something more general.
- Moving from Bower to NPM

### v4.0.0
##### Added / Updated
- You can now customize output-model properties that you need, instead of having all data.
- <a href="https://github.com/isteven/angular-multi-select/issues/201">#201</a> (and other related issues) DOM bug is now fixed.
- <a href="https://github.com/isteven/angular-multi-select/issues/205">#205</a> (and other related issues) CSS bug is now fixed.
- <a href="https://github.com/isteven/angular-multi-select/issues/207">#207</a> (and other related issues) You can now update the directive by modifying the input-model as usual.

##### Deprecated / Breaking Changes
- input-model behaviour is now back like v2.x.x. If you don't re-use your input-model, you should be safe.

### v3.0.0
##### Added / Updated
- Support for AngularJs version 1.3.x (v3.0.0 also supports AngularJs 1.2.x, but beware of the breaking changes).
- Customized text on helper elements.
- 5 new callbacks.
- You can now set minimum characters required to trigger the search functionality.
- You can now define which input-model properties to search from (previously, all input-model properties are searched).
- On close, parent button will now receive focus.
- Using proper semantics (well at least better than previous version).
- Limited support on promise objects.
- Various small optimizations.

##### Deprecated / Breaking Changes
- File name and the directive name have been changed. I am really sorry for this, but this is the only workaround to prevent wrong language statistic in Github (they don''t count files whose name starts with "angular"). The repository name stays the same.
- output-model is now required.
- input-model is now static (not dynamically updated), hence why we need output-model. On the plus side, you now can re-use the input model where necessary.
- default-label is deprecated. Custom text and translations can be done using the translation attribute.

### v2.0.2
##### Added / Updated
- Bring back CSS into bower.json.

### v2.0.1
##### Added / Updated
- <a href="https://github.com/isteven/angular-multi-select/issues/52">#52</a> Form tag is now properly closed.

### v2.0.0
##### Added / Updated
- Unlimited nested grouping. Group headers are clickable to select / deselect all items under the group. Group headers are filter aware, means it will only affect filtered result.
- Helper buttons are now filter aware as well (For example, if you filter something and click 'Select All', the directive will tick all of the filtered result only. Same goes with 'Select None' and 'Reset' ).
- Supports arrow key navigation (up, down, left, right, and spacebar).
- New CSS styling.
- default-label attribute. You can define your default text on the button when nothing is selected.
- on-item-click attribute. This is a callback which will be triggered when a user click an item. Will pass the clicked item to the callback function.
- on-open and on-close callbacks will now pass the multi-select element (HTML) to the callback function.
- max-height attribute. You can define the height of the selection items container.

##### Deprecated / Breaking Changes
- on-focus attribute is deprecated.
- on-blur attribute is deprecated. Use on-close instead, as it will be triggered when user close a directive by clicking outside the directive.
- IE8 will no longer be supported.

### v1.2.0
##### Added / Updated:
- <a href="https://github.com/isteven/angular-multi-select/issues/19">#19</a> Default label on the dropdown button is now configurable using attribute "default-label"="...".
- <a href="https://github.com/isteven/angular-multi-select/issues/16">#16</a> Attribute "max-labels" can now be 0. If set to 0, the dropdown button will only display "(Total: X)".

### v1.1.0
##### Added / Updated:
- Added event callbacks.
- <a href="https://github.com/isteven/angular-multi-select/issues/5">#5</a> Helper elements are now configurable.

### v1.0.0
- First release.
