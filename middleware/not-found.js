const notFoundMiddleware = (req, res) => {
  res.status(404).send('Route not found')
}

export default notFoundMiddleware
