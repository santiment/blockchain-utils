const trie = require('trie-prefix-tree')
const { groupBy } = require('lodash')

function setErrors(traces) {
  let txs = groupBy(traces, tx => tx.transactionHash)
  const hashes = Object.keys(txs)

  hashes.forEach(hash => {
    const txTraces = txs[hash]

    const errorTraces = txTraces.filter(trace => typeof trace.error !== 'undefined')
    if (errorTraces.length === 0) return

    const traceAddresses = txTraces.map(trace => (trace.traceAddress.length > 0) ? '-1 ' + trace.traceAddress.join(' ') : '-1 ')
    const txTrie = trie(traceAddresses)

    let errAddresses = errorTraces.map(trace => {
      const errPrefix = '-1 ' + trace.traceAddress.join(' ')
      const children = txTrie.getPrefix(errPrefix)
      return children
    })
    errAddresses = [].concat(...errAddresses)
    txs[hash].forEach(trace => {
      if (errAddresses.indexOf('-1 ' + trace.traceAddress.join(' ')) !== -1) {
        trace['error'] = 'parent_error'
      }
    })
  })
  return [].concat(...Object.values(txs))

}

/** Remove traces which contain no useful data. For example:
 {
     "error": {
         "code": -32000,
         "message": "first run for txIndex 323 error: insufficient funds for gas * price + value: address 0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a have 79011297267895730 want 79314366712002216"
     }
 }
*/
function filterNonActions(traces) {
  return traces.filter(trace => typeof trace.action != 'undefined')
}

function filterErrors(traces) {
  traces = filterNonActions(traces)
  traces = setErrors(traces)
  traces = traces.filter(trace => typeof trace.error === 'undefined')
  return traces
}

module.exports = {
  filterErrors
}
