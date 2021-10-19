import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'SOY-CLO LP',
    lpAddresses: {
      20729: '',
      820: '0xf43Db9BeC8F8626Cb5ADD409C7EBc7272c8f5F8f',
    },
    token: tokens.soy,
    quoteToken: tokens.wclo,
  },
  {
    pid: 1,
    lpSymbol: 'CLOE-CLO LP',
    lpAddresses: {
      20729: '',
      820: '0xfe61A8dc1458D013f31b7B5d0DDf82864Cf89035',
    },
    token: tokens.cloe,
    quoteToken: tokens.wclo,
  },
  {
    pid: 2,
    lpSymbol: 'CLO-BUSDT LP',
    lpAddresses: {
      20729: '',
      820: '0x3E5B906eE1Cb467E1511a2b1ad5a1bc4a3F9BF8B',
    },
    token: tokens.clo,
    quoteToken: tokens.busdt,
  },
  {
    pid: 3,
    lpSymbol: 'SOY-BUSDT LP',
    lpAddresses: {
      20729: '',
      820: '0xf16edf5Ba6bc116C17f6769deB470a190e272381',
    },
    token: tokens.soy,
    quoteToken: tokens.busdt,
  },
]

export default farms
