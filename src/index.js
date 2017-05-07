import MessageSocket from 'message-socket';

import { method as filter } from './lib/observable/filter';
import Observable from './lib/observable';

const debug = require('debug')('atlona-matrix:device');

class AtlonaMatrix {
    constructor(host) {
        Object.defineProperty(
            this, '_socket', {
                value: new MessageSocket(host, 23, /(.*?)\r\n/g)
            }
        );

        Object.defineProperty(
            this, '_listenerQueue', {
                value: []
            }
        );

        Observable
            .from(
                this
                    ._socket
            )
            ::filter(x => !x.match(/^\s+$/))
            ::filter(x => x !== 'Welcome to TELNET.')
            .subscribe(x => {
                var resolve = this._listenerQueue.shift();
                if (typeof resolve === 'function') {
                    resolve(x);
                }
            });
    }

    send(cmd) {
        this._socket.send(`${cmd}\r\n`);

        var self = this;
        return new Promise(function(resolve, reject) {
            // TODO: this is a pretty hokey way to synchronize input
            // and output, but it basically works.
            self._listenerQueue.push(resolve);
        });
    }

    getPowerState() {
        return this.send('PWSTA')
            .then(x => x === 'PWON' ? 'on' : 'off')
    }

    getIsOn() {
        return this.send('PWSTA').then(x => x === 'PWON');
    }

    setIsOn(isOn) {
        this.send(!!isOn ? 'PWON' : 'PWOFF');
    }

    turnOn() {
        this.setIsOn(true);
    }

    turnOff() {
        this.setIsOn(false);
    }

    turnOffIfSafe() {
        this.getOutputStatus()
            .then(state => {
                var areAllOff =
                    state.reduce((acc, x) => acc && x === null, true);

                if (areAllOff) {
                    this.turnOff();
                }
            });
    }

    getHardwareInfo() {
        return Promise.all([
            this.send('Type'),
            this.send('Version')
        ]).then(([ type, version ]) => ({
            type, version
        }));
    }

    getOutputStatus() {
        return this.send('Status')
            .then(x => x.split(','))
            .then(outputs =>
                outputs.map(
                    i => {
                        let res = /^x(\d+)AV/.exec(i);
                        if (res && res[1] !== '0') {
                            return res[1] / 1
                        }

                        return null;
                    }
                )
            )
        ;
    }

    turnOffOutput(output) {
        if (Number.isInteger(output)) {
            this.send('x' + output + '$');
        }
    }

    setOutput(output, input) {
        debug(`Setting ${output} to ${input}`);
        if (!Number.isInteger(input)) {
            this.turnOffOutput(output);
        }
        else if (Number.isInteger(output)) {
            this.send('x' + input + 'AVx' + output);
        }
    }
}

export {
    AtlonaMatrix as default
}
