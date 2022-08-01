export default (myFunc) => (req, res, next) => {
  Promise.resolve(myFunc(req, res, next)).catch(next)
}

// Promise resoleve(promise) return promise
