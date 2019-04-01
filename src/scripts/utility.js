import moment from "moment"
import createHash from "create-hash"
import b64 from "base64-js"

function format(time) {
  const m = moment(time)
  return m.format(`YYYY.MM.DD hh:mm:ss`)
}

function txToHash(tx) {
  let txbytes = b64.toByteArray(tx)

  let hash = createHash("sha256")
    .update(Buffer.from(txbytes))
    .digest("hex")

  return hash.toUpperCase()
}

function fromNow(time) {
  const m = moment(time)
  return m.fromNow()
}

export default {
  format,
  txToHash,
  fromNow
}
