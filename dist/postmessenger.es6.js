'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Talk to iFrames with postMessage
// Cross-window messaging API is supported by all modern browsers including IE8.
// It allows windows/frames from multiple domains to communicate with each other.

exports.default = {
	/**
  * @param {Object} json
  * @param {String} target
  * @param {HTMLElement} targetElement
  */
	send: function send(json, target, targetElement) {
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
	listen: function listen(callback) {
		var _this = this;

		/**
   * @param {SyntheticEvent} e
   */
		var receiveMessage = function receiveMessage(e) {
			return callback(_this._unserialize(e.data));
		};

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
	_serialize: function _serialize(obj) {
		return JSON.stringify(obj);
	},

	/**
  * @param {String} string
  * @private
  */
	_unserialize: function _unserialize(string) {
		try {
			var o = JSON.parse(string);

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors,
			// hence the type-checking, but... JSON.parse(null) returns 'null',
			// and typeof null === "object", so we must check for that, too.
			if (o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null) {
				return o;
			}
		} catch (ex) {
			console.warn('Invalid JSON:', ex);
		}
	}
};