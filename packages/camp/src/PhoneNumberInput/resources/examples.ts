import type { CountryCode, NationalNumber } from 'libphonenumber-js'

export const MOBILE_EXAMPLES = {
  AC: '40123',
  AD: '312345',
  AE: '501234567',
  AF: '701234567',
  AG: '2684641234',
  AI: '2642351234',
  AL: '672123456',
  AM: '77123456',
  AO: '923123456',
  AR: '91123456789',
  AS: '6847331234',
  AT: '664123456',
  AU: '412345678',
  AW: '5601234',
  AX: '412345678',
  AZ: '401234567',
  BA: '61123456',
  BB: '2462501234',
  BD: '1812345678',
  BE: '470123456',
  BF: '70123456',
  BG: '48123456',
  BH: '36001234',
  BI: '79561234',
  BJ: '90011234',
  BL: '690001234',
  BM: '4413701234',
  BN: '7123456',
  BO: '71234567',
  BQ: '3181234',
  BR: '11961234567',
  BS: '2423591234',
  BT: '17123456',
  BW: '71123456',
  BY: '294911911',
  BZ: '6221234',
  CA: '5062345678',
  CC: '412345678',
  CD: '991234567',
  CF: '70012345',
  CG: '061234567',
  CH: '781234567',
  CI: '0123456789',
  CK: '71234',
  CL: '221234567',
  CM: '671234567',
  CN: '13123456789',
  CO: '3211234567',
  CR: '83123456',
  CU: '51234567',
  CV: '9911234',
  CW: '95181234',
  CX: '412345678',
  CY: '96123456',
  CZ: '601123456',
  DE: '15123456789',
  DJ: '77831001',
  DK: '32123456',
  DM: '7672251234',
  DO: '8092345678',
  DZ: '551234567',
  EC: '991234567',
  EE: '51234567',
  EG: '1001234567',
  EH: '650123456',
  ER: '7123456',
  ES: '612345678',
  ET: '911234567',
  FI: '412345678',
  FJ: '7012345',
  FK: '51234',
  FM: '3501234',
  FO: '211234',
  FR: '612345678',
  GA: '06031234',
  GB: '7400123456',
  GD: '4734031234',
  GE: '555123456',
  GF: '694201234',
  GG: '7781123456',
  GH: '231234567',
  GI: '57123456',
  GL: '221234',
  GM: '3012345',
  GN: '601123456',
  GP: '690001234',
  GQ: '222123456',
  GR: '6912345678',
  GT: '51234567',
  GU: '6713001234',
  GW: '955012345',
  GY: '6091234',
  HK: '51234567',
  HN: '91234567',
  HR: '921234567',
  HT: '34101234',
  HU: '201234567',
  ID: '812345678',
  IE: '850123456',
  IL: '502345678',
  IM: '7924123456',
  IN: '8123456789',
  IO: '3801234',
  IQ: '7912345678',
  IR: '9123456789',
  IS: '6111234',
  IT: '3123456789',
  JE: '7797712345',
  JM: '8762101234',
  JO: '790123456',
  JP: '9012345678',
  KE: '712123456',
  KG: '700123456',
  KH: '91234567',
  KI: '72001234',
  KM: '3212345',
  KN: '8697652917',
  KP: '1921234567',
  KR: '1020000000',
  KW: '50012345',
  KY: '3453231234',
  KZ: '7710009998',
  LA: '2023123456',
  LB: '71123456',
  LC: '7582845678',
  LI: '660234567',
  LK: '712345678',
  LR: '770123456',
  LS: '50123456',
  LT: '61234567',
  LU: '628123456',
  LV: '21234567',
  LY: '912345678',
  MA: '650123456',
  MC: '612345678',
  MD: '62112345',
  ME: '67622901',
  MF: '690001234',
  MG: '321234567',
  MH: '2351234',
  MK: '72345678',
  ML: '65012345',
  MM: '92123456',
  MN: '88123456',
  MO: '66123456',
  MP: '6702345678',
  MQ: '696201234',
  MR: '22123456',
  MS: '6644923456',
  MT: '96961234',
  MU: '52512345',
  MV: '7712345',
  MW: '991234567',
  MX: '12221234567',
  MY: '123456789',
  MZ: '821234567',
  NA: '811234567',
  NC: '751234',
  NE: '93123456',
  NF: '381234',
  NG: '8021234567',
  NI: '81234567',
  NL: '612345678',
  NO: '40612345',
  NP: '9841234567',
  NR: '5551234',
  NU: '8884012',
  NZ: '211234567',
  OM: '92123456',
  PA: '61234567',
  PE: '912345678',
  PF: '87123456',
  PG: '70123456',
  PH: '9051234567',
  PK: '3012345678',
  PL: '512345678',
  PM: '551234',
  PR: '7872345678',
  PS: '599123456',
  PT: '912345678',
  PW: '6201234',
  PY: '961456789',
  QA: '33123456',
  RE: '692123456',
  RO: '712034567',
  RS: '601234567',
  RU: '9123456789',
  RW: '720123456',
  SA: '512345678',
  SB: '7421234',
  SC: '2510123',
  SD: '911231234',
  SE: '701234567',
  SG: '81234567',
  SH: '51234',
  SI: '31234567',
  SJ: '41234567',
  SK: '912123456',
  SL: '25123456',
  SM: '66661212',
  SN: '701234567',
  SO: '71123456',
  SR: '7412345',
  SS: '977123456',
  ST: '9812345',
  SV: '70123456',
  SX: '7215205678',
  SY: '944567890',
  SZ: '76123456',
  TA: '8999',
  TC: '6492311234',
  TD: '63012345',
  TG: '90112345',
  TH: '812345678',
  TJ: '917123456',
  TK: '7290',
  TL: '77212345',
  TM: '66123456',
  TN: '20123456',
  TO: '7715123',
  TR: '5012345678',
  TT: '8682911234',
  TV: '901234',
  TW: '912345678',
  TZ: '621234567',
  UA: '501234567',
  UG: '712345678',
  US: '2015550123',
  UY: '94231234',
  UZ: '912345678',
  VA: '3123456789',
  VC: '7844301234',
  VE: '4121234567',
  VG: '2843001234',
  VI: '3406421234',
  VN: '912345678',
  VU: '5912345',
  WF: '821234',
  WS: '7212345',
  XK: '43201234',
  YE: '712345678',
  YT: '639012345',
  ZA: '711234567',
  ZM: '955123456',
  ZW: '712345678',
} as { [country in CountryCode]: NationalNumber }

export const LANDLINE_EXAMPLES = {
  AC: '62889',
  AD: '712 345',
  AE: '02 234 5678',
  AF: '023 456 7890',
  AG: '(268) 460-1234',
  AI: '(264) 461-2345',
  AL: '022 345 678',
  AM: '(010) 123456',
  AO: '222 123 456',
  AR: '011 2345-6789',
  AS: '(684) 622-1234',
  AT: '01 234567890',
  AU: '(02) 1234 5678',
  AW: '521 2345',
  AX: '018 1234567',
  AZ: '(012) 312 34 56',
  BA: '030 212-345',
  BB: '(246) 412-3456',
  BD: '02-7111234',
  BE: '012 34 56 78',
  BF: '20 49 12 34',
  BG: '02 123 456',
  BH: '1700 1234',
  BI: '22 20 12 34',
  BJ: '20 21 12 34',
  BL: '0590 27 12 34',
  BM: '(441) 412-3456',
  BN: '234 5678',
  BO: '2 2123456',
  BQ: '715 1234',
  BR: '(11) 2345-6789',
  BS: '(242) 345-6789',
  BT: '2 345 678',
  BW: '240 1234',
  BY: '8 0152 45-09-11',
  BZ: '222-1234',
  CA: '(506) 234-5678',
  CC: '(08) 9162 1234',
  CD: '012 34567',
  CF: '21 61 23 45',
  CG: '22 212 3456',
  CH: '021 234 56 78',
  CI: '21 23 4 56789',
  CK: '21 234',
  CL: '(2) 2123 4567',
  CM: '2 22 12 34 56',
  CN: '010 1234 5678',
  CO: '(1) 2345678',
  CR: '2212 3456',
  CU: '(07) 1234567',
  CV: '221 12 34',
  CW: '9 435 1234',
  CX: '(08) 9164 1234',
  CY: '22 345678',
  CZ: '212 345 678',
  DE: '030 123456',
  DJ: '21 36 00 03',
  DK: '32 12 34 56',
  DM: '(767) 420-1234',
  DO: '(809) 234-5678',
  DZ: '012 34 56 78',
  EC: '(02) 212-3456',
  EE: '321 2345',
  EG: '02 34567890',
  EH: '05288-12345',
  ER: '08 370 362',
  ES: '810 12 34 56',
  ET: '011 111 2345',
  FI: '013 1234567',
  FJ: '321 2345',
  FK: '31234',
  FM: '320 1234',
  FO: '201234',
  FR: '01 23 45 67 89',
  GA: '01 44 12 34',
  GB: '0121 234 5678',
  GD: '(473) 269-1234',
  GE: '032 212 34 56',
  GF: '0594 10 12 34',
  GG: '01481 256789',
  GH: '030 234 5678',
  GI: '200 12345',
  GL: '32 10 00',
  GM: '566 1234',
  GN: '30 24 12 34',
  GP: '0590 20 12 34',
  GQ: '333 091 234',
  GR: '21 2345 6789',
  GT: '2245 6789',
  GU: '(671) 300-1234',
  GW: '443 201 234',
  GY: '220 1234',
  HK: '2123 4567',
  HN: '2212-3456',
  HR: '01 2345 678',
  HT: '22 45 3300',
  HU: '(06 1) 234 5678',
  ID: '(021) 8350123',
  IE: '(022) 12345',
  IL: '02-123-4567',
  IM: '01624 756789',
  IN: '074104 10123',
  IO: '370 9100',
  IQ: '01 234 5678',
  IR: '021 2345 6789',
  IS: '410 1234',
  IT: '02 1234 5678',
  JE: '01534 456789',
  JM: '(876) 523-0123',
  JO: '(06) 200 1234',
  JP: '03-1234-5678',
  KE: '020 2012345',
  KG: '0312 123 456',
  KH: '023 756 789',
  KI: '31234',
  KM: '771 23 45',
  KN: '(869) 236-1234',
  KP: '02 123 4567',
  KR: '02-212-3456',
  KW: '2234 5678',
  KY: '(345) 222-1234',
  KZ: '8 (71234) 5 67 89',
  LA: '021 212 862',
  LB: '01 123 456',
  LC: '(758) 430-5678',
  LI: '234 56 78',
  LK: '0112 345 678',
  LR: '021 234 567',
  LS: '2212 3456',
  LT: '(8-312) 34567',
  LU: '27 12 34 56',
  LV: '63 123 456',
  LY: '021-2345678',
  MA: '0520-123456',
  MC: '99 12 34 56',
  MD: '022 212 345',
  ME: '030 234 567',
  MF: '0590 27 12 34',
  MG: '020 21 234 56',
  MH: '247-1234',
  MK: '02 201 2345',
  ML: '20 21 23 45',
  MM: '01 234 567',
  MN: '5312 3456',
  MO: '2821 2345',
  MP: '(670) 234-5678',
  MQ: '0596 30 12 34',
  MR: '35 12 34 56',
  MS: '(664) 491-2345',
  MT: '2100 1234',
  MU: '5448 0123',
  MV: '670-1234',
  MW: '01 234 567',
  MX: '200 123 4567',
  MY: '03-2385 6789',
  MZ: '21 123 456',
  NA: '061 221 234',
  NC: '20.12.34',
  NE: '20 20 12 34',
  NF: '10 6609',
  NG: '01 804 0123',
  NI: '2123 4567',
  NL: '010 123 4567',
  NO: '21 23 45 67',
  NP: '01-4567890',
  NR: '444 1234',
  NU: '7012',
  NZ: '03-234 5678',
  OM: '23 123456',
  PA: '200-1234',
  PE: '(01) 1234567',
  PF: '40 41 23 45',
  PG: '312 3456',
  PH: '(02) 3234 5678',
  PK: '(021) 23456789',
  PL: '12 345 67 89',
  PM: '043 01 23',
  PR: '(787) 234-5678',
  PS: '02 223 4567',
  PT: '21 234 5678',
  PW: '277 1234',
  PY: '(021) 234 5678',
  QA: '4412 3456',
  RE: '0262 16 12 34',
  RO: '021 123 4567',
  RS: '010 234567',
  RU: '8 (301) 123-45-67',
  RW: '250 123 456',
  SA: '011 234 5678',
  SB: '40123',
  SC: '4 217 123',
  SD: '015 312 3456',
  SE: '08-12 34 56',
  SG: '6123 4567',
  SH: '22158',
  SI: '(01) 234 56 78',
  SJ: '79 12 34 56',
  SK: '02/212 345 67',
  SL: '(022) 221234',
  SM: '0549 886377',
  SN: '30 101 23 45',
  SO: '4 012345',
  SR: '211-234',
  SS: '0181 234 567',
  ST: '222 1234',
  SV: '2123 4567',
  SX: '(721) 542-5678',
  SY: '011 234 5678',
  SZ: '2217 1234',
  TA: '8999',
  TC: '(649) 712-1234',
  TD: '22 50 12 34',
  TG: '22 21 23 45',
  TH: '02 123 4567',
  TJ: '372 12 3456',
  TK: '3101',
  TL: '211 2345',
  TM: '(8 12) 34-56-78',
  TN: '30 010 123',
  TO: '20-123',
  TR: '(0212) 345 67 89',
  TT: '(868) 221-1234',
  TV: '20 123',
  TW: '02 2123 4567',
  TZ: '022 234 5678',
  UA: '03112 34567',
  UG: '031 2345678',
  US: '(201) 555-0123',
  UY: '2123 1234',
  UZ: '8 66 905 01 23',
  VA: '06 6981 2345',
  VC: '(784) 266-1234',
  VE: '0212-1234567',
  VG: '(284) 229-1234',
  VI: '(340) 642-1234',
  VN: '0210 1234 567',
  VU: '22123',
  WF: '72 12 34',
  WS: '22123',
  XK: '028 012 345',
  YE: '01 234 567',
  YT: '0269 60 12 34',
  ZA: '010 123 4567',
  ZM: '0211 234 567',
  ZW: '013 12345',
} as { [country in CountryCode]: NationalNumber }
