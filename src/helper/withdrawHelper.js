/**
 * find exit data that fits the conditional
 */
export function findExit(exitList, blockNumber, range, depositContractAddress) {
  const queriedExit = exitList
    .filter(exit => exit.stateUpdate.blockNumber.raw === blockNumber.toString())
    .filter(
      exit =>
        exit.stateUpdate.range.start.raw === range.start &&
        exit.stateUpdate.range.end.raw === range.end
    )
    .filter(
      exit =>
        exit.stateUpdate.depositContractAddress.raw.toLowerCase() ===
        depositContractAddress.toLowerCase()
    )
  if (queriedExit.length > 0) {
    return queriedExit[0]
  }
  return null
}
