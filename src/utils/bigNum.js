export function formatBig(bgInt) {
  const ACCUR = 16
  let valStr = bgInt.toString()
  let len = valStr.length

  if (bgInt == BigInt(0)) {
    return '0'
  }

  let res

  if (len > ACCUR) {
    let diff = len - ACCUR
    res = bgInt.slice(0, diff) + '.' + bgInt.slice(diff)
  } else {
    let diff = ACCUR - len
    let result = '0.'
    for (var i = 0; i < diff; i++) {
      result += '0'
    }
    res = result + valStr
  }

  // remove trailing 0
  return res.replace(/0+$/, '')
}
