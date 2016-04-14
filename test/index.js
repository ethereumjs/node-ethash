'use strict'
/* global describe */

/**
 * @param {Object} ethash
 * @param {string} description
 */
function test (ethash, description) {
  describe(description, function () {
    require('./ethash')(ethash)
  })
}

test(require('../js/bindings'), 'ethash bindings')
