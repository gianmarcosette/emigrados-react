// Países donde se puede vivir: códigos ISO 3166-1 alfa-2 (sin territorios deshabitados).
// El nombre en español lo da el navegador (Intl.DisplayNames); algunos se ajustan a mano.
const CODES =
  'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(
    ' ',
  )

const OVERRIDES = {
  CI: 'Costa de Marfil',
  HK: 'Hong Kong',
  MO: 'Macao',
  PS: 'Palestina',
}

const displayNames = new Intl.DisplayNames('es', { type: 'region' })

export function countryName(code) {
  if (!code) return ''
  return OVERRIDES[code] ?? displayNames.of(code) ?? code
}

export function isCountryCode(code) {
  return CODES.includes(code)
}

/** [{ code, name }] ordenados alfabéticamente, para el selector del perfil. */
export const RESIDENCE_OPTIONS = CODES.map((code) => ({ code, name: countryName(code) })).sort((a, b) =>
  a.name.localeCompare(b.name, 'es'),
)
