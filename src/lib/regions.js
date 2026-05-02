// src/lib/regions.js
// Country and US-state data for onboarding + regional leaderboards.
// Country codes are ISO 3166-1 alpha-2; state codes are USPS abbreviations.

const _OTHER_COUNTRIES = [
  { code: 'CA', name: 'Canada',         flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand',    flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland',        flag: '🇮🇪' },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪' },
  { code: 'FR', name: 'France',         flag: '🇫🇷' },
  { code: 'ES', name: 'Spain',          flag: '🇪🇸' },
  { code: 'IT', name: 'Italy',          flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal',       flag: '🇵🇹' },
  { code: 'NL', name: 'Netherlands',    flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium',        flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland',    flag: '🇨🇭' },
  { code: 'AT', name: 'Austria',        flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden',         flag: '🇸🇪' },
  { code: 'NO', name: 'Norway',         flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark',        flag: '🇩🇰' },
  { code: 'FI', name: 'Finland',        flag: '🇫🇮' },
  { code: 'PL', name: 'Poland',         flag: '🇵🇱' },
  { code: 'CZ', name: 'Czechia',        flag: '🇨🇿' },
  { code: 'GR', name: 'Greece',         flag: '🇬🇷' },
  { code: 'TR', name: 'Türkiye',        flag: '🇹🇷' },
  { code: 'RU', name: 'Russia',         flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine',        flag: '🇺🇦' },
  { code: 'IL', name: 'Israel',         flag: '🇮🇱' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia',   flag: '🇸🇦' },
  { code: 'EG', name: 'Egypt',          flag: '🇪🇬' },
  { code: 'ZA', name: 'South Africa',   flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria',        flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya',          flag: '🇰🇪' },
  { code: 'MX', name: 'Mexico',         flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil',         flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina',      flag: '🇦🇷' },
  { code: 'CL', name: 'Chile',          flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia',       flag: '🇨🇴' },
  { code: 'PE', name: 'Peru',           flag: '🇵🇪' },
  { code: 'IN', name: 'India',          flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan',       flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh',     flag: '🇧🇩' },
  { code: 'CN', name: 'China',          flag: '🇨🇳' },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea',    flag: '🇰🇷' },
  { code: 'TW', name: 'Taiwan',         flag: '🇹🇼' },
  { code: 'HK', name: 'Hong Kong',      flag: '🇭🇰' },
  { code: 'SG', name: 'Singapore',      flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia',       flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand',       flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam',        flag: '🇻🇳' },
  { code: 'ID', name: 'Indonesia',      flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines',    flag: '🇵🇭' },
].sort((a, b) => a.name.localeCompare(b.name));

// United States pinned at the top, then everyone else alphabetically.
export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  ..._OTHER_COUNTRIES,
];

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },        { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },        { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },     { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },    { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },        { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },         { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },       { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },           { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },       { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },          { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },      { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },       { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },       { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },     { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },           { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },         { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },   { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },   { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },          { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },        { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },     { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },      { code: 'WY', name: 'Wyoming' },
];

export function getCountry(code) {
  return COUNTRIES.find(c => c.code === code) || null;
}

export function getUsState(code) {
  return US_STATES.find(s => s.code === code) || null;
}