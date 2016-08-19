/**
 * Patch
 * Codesketch demonstrating theoretical patch-inspired
 * Javascript components.
 *
 * @version 0.1.0
 * @author Kyle Edwards <edwards.kyle.a@gmail.com>
 * @license MIT
 */

class Module {

    constructor(options) {

        var patch = {},
            func,
            args,
            init

        this.listeners = []

        if (typeof options === 'function') {
            func = options
        } else if (typeof options === 'object') {
            func = options.func
            init = options.init
            args = options.args
        }

        func = (typeof func === 'function') ? func : function () {}
        init = (typeof init === 'function') ? init : function () {}
        args = args || []

        patch.in = null
        patch.out = (value) => {
            this.listeners.forEach(module => module.process(value))
        }

        args.unshift(patch)

        this.process = function (input) {
            patch.in = input
            func.apply(this, args)
        }

        init.apply(this, args)

    }

    patchTo(listener) {
        this.listeners.push(listener)
        return listener // syntactic sugarrrr...
    }

}

/**
 * Helper function to create
 */

Module.factory = function (options) {
    var func
    if (typeof options === 'function') {
        func = options
        options = {
            func: func
        }
    }
    return function () {
        options.args = [...arguments]
        return new Module(options)
    }
}

Module.chain = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].patchTo && arguments[i + 1]) {
            arguments[i].patchTo(arguments[i + 1])
        }
    }
}
