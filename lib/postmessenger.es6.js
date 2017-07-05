// Talk to iFrames with postMessage
// Cross-window messaging API is supported by all modern browsers including IE8.
// It allows windows/frames from multiple domains to communicate with each other.

export default {
	/**
	 * @param {Object} json
	 * @param {String} target
	 * @param {HTMLElement} targetElement
	 */
	send: function(json, target, targetElement) {
		if (typeof target === 'undefined') {
			throw new Error('You must supply a target as a string');
		}
		if (typeof targetElement === 'undefined') {
			targetElement = window.parent;
		}
		targetElement.postMessage(this._serialize(json), target);
	},

	/**
	 * @param {Function} callback
	 */
	listen: function(callback) {
		/**
		 * @param {SyntheticEvent} e
		 */
		const receiveMessage = (e) => callback(this._unserialize(e.data));

		if (window.addEventListener) {
			window.addEventListener('message', receiveMessage, false);
		} else {
			window.attachEvent('onmessage', receiveMessage);
		}
	},

	/**
	 * @param {Object} obj
	 * @private
	 */
	_serialize: function(obj) {
		return JSON.stringify(obj);
	},

	/**
	 * @param {String} string
	 * @private
	 */
	_unserialize: function(string) {
		try {
			let o = JSON.parse(string);

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors,
			// hence the type-checking, but... JSON.parse(null) returns 'null',
			// and typeof null === "object", so we must check for that, too.
			if (o && typeof o === 'object' && o !== null) {
				return o;
			}
		} catch (ex) {
			console.warn('Invalid JSON:', ex);
		}
	}
};
