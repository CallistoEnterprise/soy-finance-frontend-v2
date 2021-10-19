import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { Farm } from 'state/types'

const getFarmFromTokenSymbol = (farms: Farm[], tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (farm: Farm, quoteTokenFarm: Farm, bnbPriceBusd: BigNumber): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === 'BUSDT') {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'WCLO') {
    return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSDT/CLO farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't USDC or wCLO, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - CLO, (pBTC - CLO)
  // from the CLO - pBTC price, we can calculate the PNT - USDC price
  if (quoteTokenFarm.quoteToken.symbol === 'WCLO') {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'USDC') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed USDC/wCLO quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (farm: Farm, quoteTokenFarm: Farm, bnbPriceBusd: BigNumber): BigNumber => {
  if (farm.quoteToken.symbol === 'BUSDT') {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === 'WCLO') {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WCLO') {
    return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSDT') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchFarmsPrices = async (farms) => {
  const cloUsdcFarm = farms.find((farm: Farm) => farm.pid === 2)
  
  const cloPriceUsdc = cloUsdcFarm.tokenPriceVsQuote ? BIG_ONE.div(cloUsdcFarm.tokenPriceVsQuote) : BIG_ZERO
  
  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, cloPriceUsdc)
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, cloPriceUsdc)
    const token = { ...farm.token, usdcPrice: baseTokenPrice.toJSON() }
    const quoteToken = { ...farm.quoteToken, usdcPrice: quoteTokenPrice.toJSON() }
    return { ...farm, token, quoteToken }
  })

  return farmsWithPrices
}

export default fetchFarmsPrices