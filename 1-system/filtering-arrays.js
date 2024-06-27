const people = [
    { personal: 'Jean', family: 'Jennings' },
    { personal: 'Marlyn', family: 'Wescoff' },
    { personal: 'Ruth', family: 'Lichterman' },
    { personal: 'Betty', family: 'Snyder' },
    { personal: 'Frances', family: 'Bilas' },
    { personal: 'Kay', family: 'McNulty' }
]
  
const result = people.filter((el, i) => !(i % 2))
  
console.log(result)
// [
//     { personal: 'Jean', family: 'Jennings' },
//     { personal: 'Ruth', family: 'Lichterman' },
//     { personal: 'Frances', family: 'Bilas' }
// ]