async function returnImmediately () {
    try {
        x
        return Promise.reject(new Error('deliberate'))
    } catch (err) {
        throw new Error('caught exception')
    }
}
  
const result = returnImmediately()
result.then(val => console.log(`val = ${val}`))
result.catch(err => console.log(`caller caught ${err}`))
