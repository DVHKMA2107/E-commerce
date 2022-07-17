export default (myFunc) => (req, res, next) => {
  console.log(myFunc)
  Promise.resolve(myFunc(req, res, next)).catch(next)
}
