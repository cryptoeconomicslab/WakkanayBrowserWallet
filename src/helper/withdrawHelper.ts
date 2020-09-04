import { Exit } from '@cryptoeconomicslab/plasma'

/**
 * find exit data that fits the conditional
 */
export function findExit(
  exitList: Exit[],
  ranges: { start: string; end: string }[],
  depositContractAddress: string
): Exit | null {
  // @NOTE: State Update has only one range
  const range = ranges[0]
  const queriedExit = exitList
    .filter(
      exit =>
        range &&
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
