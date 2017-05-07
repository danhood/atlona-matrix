# atlona-matrix
> Control your Atlona HDMI matrix switch over the network

[![NPM Version][npm-image]][npm-url]
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

`atlona-matrix` is a Node.js library that allows you to control your Atlona HDMI matrix switch over your local network.  It's especially useful for integrating into a home automation system.

## Getting Started

`atlona-matrix` is distributed through NPM:

```sh
npm install atlona-matrix

# or, if you prefer:
yarn add atlona-matrix
```

## Examples

Atlona matrix switches unfortunately do not advertise themselves on the local network in any way that facilitates discovery, so you'll have to have some other way of knowing the IP address of your switch.

Once you've solved that problem, connecting to and controlling your switch is easy:

```javascript
const matrix = new AtlonaMatrix('192.168.1.1'); // or whatever
```

### Commands
Commands of the form `get<Something>` return Promises.  Other commands return nothing.

#### getPowerState()
Returns a promise that resolves with `'on'` or `'off'` depending on the current state of the switch.

#### getIsOn()
Returns a boolean indicating the whether the switch is on or not.

#### getHardwareInfo()
Returns a Promise that resolves with an object indicating the type and version of the hardware.

#### getOutputStatus()
Returns a Promise that resolves with a list of the current inputs mapped to each output.

#### setOutput(output, input)
Set the given output to show the given input

#### setIsOn(isOn)
Turn the switch on (isOn == true) or off (isOn == false).

#### turnOn()
Unconditionally try to turn the switch on.

#### turnOff()
Unconditionally try to turn the switch off.

#### turnOffIfSafe()
Turn the switch off if it can be determined that none of the outputs are in use.

#### turnOffOutput(output)
Turn off a single given output


## Compatibility

`atlona-matrix` is built to support Node.js version 6.0 or higher.

## Contributing

Contributions are of course always welcome.  If you find problems, please report them in the [Issue Tracker](http://www.github.com/forty2/atlona-matrix/issues/).  If you've made an improvement, open a [pull request](http://www.github.com/forty2/atlona-matrix/pulls).

Getting set up for development is very easy:
```sh
git clone <your fork>
cd atlona-matrix
yarn
```

And the development workflow is likewise straightforward:
```sh
# make a change to the src/ file, then...
yarn build
node dist/example.js

# or if you want to clean up all the leftover build products:
yarn run clean
```

## Release History

* 1.0.0
    * The first release.

## Meta

Zach Bean – zb@forty2.com

Distributed under the MIT license. See [LICENSE](LICENSE.md) for more detail.

[npm-image]: https://img.shields.io/npm/v/atlona-matrix.svg?style=flat
[npm-url]: https://npmjs.org/package/atlona-matrix
