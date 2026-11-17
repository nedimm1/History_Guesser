// Countries the source swallows into a neighbour's shape for some years, drawn again from their own
// shape in a nearby year (see `restore` in scripts/history-fixes.mjs). Applied after the era files.
export default [
  // The Soviet Union's shape covers most of the Eastern Bloc in 1945–46, Poland until 1952 and
  // Czechoslovakia 1969–1990, though all of them stayed separate states.
  ['Czechoslovakia', 1945, 1946, { restore: 1947 }], // restored in 1945
  ['Czechoslovakia', 1969, 1990, { restore: 1968 }], // the Warsaw Pact invasion of 1968 did not annex it
  ['Republic of Poland', 1945, 1952, { restore: 1953 }], // Poland in its post-1945 borders
  ['Hungary', 1945, 1946, { restore: 1947 }],
  ['Kingdom of Romania', 1945, 1946, { restore: 1947 }],
  ['Kingdom of Bulgaria', 1945, 1946, { restore: 1947 }],
  ['Second Republic of Austria', 1945, 1946, { restore: 1947 }], // Austria was restored in April 1945 (under four-power occupation)
  // The United Kingdom's shape covers Oman and the Trucial States until 1972 (Muscat and Oman was
  // never British; the Trucial States were a protectorate until the UAE formed in December 1971).
  ['Sultanate of Oman', 1956, 1969, { restore: 1973, as: 'Sultanate of Muscat and Oman' }],
  ['Sultanate of Oman', 1970, 1972, { restore: 1973 }], // renamed in 1970
  ['United Arab Emirates', 1956, 1970, { restore: 1973, as: 'Trucial States', member: '(British Empire)' }],
  ['United Arab Emirates', 1971, 1972, { restore: 1973 }],
  ['State of Qatar', 1971, 1972, { restore: 1973 }], // independent September 1971
  // British East Africa's shape covers Zambia and Malawi after their independence in 1964.
  ['Zambia', 1964, 1966, { restore: 1967 }],
  ['Malawi', 1964, 1966, { restore: 1967 }],
]
