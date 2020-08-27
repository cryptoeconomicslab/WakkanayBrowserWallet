export const validateNetwork = (
  specifiedNetworkName: string,
  currentNetworkName: string
): void => {
  if (
    specifiedNetworkName !== 'local' &&
    currentNetworkName !== specifiedNetworkName
  ) {
    throw new Error(
      `Your wallet is connecting to "${currentNetworkName}" but "${specifiedNetworkName}" is expected.`
    )
  }
}
