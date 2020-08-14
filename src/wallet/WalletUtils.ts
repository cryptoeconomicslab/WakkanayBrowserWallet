export const validateNetwork = (specifiedNetworkName, currentNetworkName) => {
  if (
    specifiedNetworkName !== 'local' &&
    currentNetworkName !== specifiedNetworkName
  ) {
    throw new Error(
      `Your wallet is connecting to "${currentNetworkName}" but "${specifiedNetworkName}" is expected.`
    )
  }
}
