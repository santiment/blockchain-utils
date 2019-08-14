const assert = require("assert")

const { filterErrors } = require('../eth')
const testErrTxs = require('./test_err_txs.json')
const testParentErr = require('./test_parent_err.json')

describe('Find errors', function () {
  it('Find hashes of all txs with errors', function () {
    assert.strictEqual(
      filterErrors(testErrTxs).length,
      1
    )
  })
})

describe('Find parent errors', function () {
  it('Find children of trace with error', function () {
    assert.strictEqual(
      filterErrors(testParentErr).length,
      8
    )
  })
})
