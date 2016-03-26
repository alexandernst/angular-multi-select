# Angular Multi Select [![Build Status](https://travis-ci.org/alexandernst/angular-multi-select.svg?branch=master)](https://travis-ci.org/alexandernst/angular-multi-select) ![Logo](https://raw.githubusercontent.com/alexandernst/angular-multi-select/assets/logo_small.png)
Pure Angular directive which creates the fastes dropdown you'll find.
It offers single or multiple selection modes and a wide range of output formats.
Doesn't require external libraries.

### How fast is it?

<b>VERY</b> fast. You won't find anything faster. The demos I work with are made of ~45.000 objects built with the <a href="https://github.com/alexandernst/angular-multi-select/blob/master/utils/generate_big_dataset.js">`utils/generate_big_dataset.js`</a> script, and the directive is able to check, validate, process and insert the entire data in ~1.5 seconds. You can get even faster than that if you craft your input data carefully (see <a href="http://alexandernst.github.io/angular-multi-select/#/under-the-hood">docs</a>).

![Screenshot](https://raw.githubusercontent.com/alexandernst/angular-multi-select/assets/demo.gif)

### Demo & How To
Go to http://alexandernst.github.io/angular-multi-select

### Change Log
See <a href="https://github.com/alexandernst/angular-multi-select/blob/master/CHANGELOG.md">CHANGELOG.md</a>.

### Installing

You can download this library from `npm`.

    npm install angular-multi-select

### Building

You'll need to install Node (because you need NPM) and Grunt. The first one is up to you. You can use
your distro's package manager, binaries from Node's webpage, etc. As for the second one: `npm install -g grunt-cli`.
After that you must install all dependencies: `npm install`. Last, you just need to run `grunt`
and everything will build.

### Bug Reporting
Please follow these steps:

1. **READ THE MANUAL AGAIN**. You might have missed something. This includes the MINIMUM ANGULARJS VERSION and the SUPPORTED BROWSERS.
2. The next step is to search in Github's issue section first. There might already be an answer for similar issue. Do check both open and closed issues.
3. If there's no previous issue found, then please create a new issue in https://github.com/alexandernst/angular-multi-select/issues.
4. Please **replicate the problem in JSFiddle or Plunker** (or any other online JS collaboration tool), and include the URL in the issue you are creating.

### Licence
See <a href="https://github.com/alexandernst/angular-multi-select/blob/master/LICENSE.txt">LICENSE.txt</a>.
