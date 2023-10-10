const http = require('http')

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('X-Powered-By', 'Node.js')
    res.write("<h1>Hello<h1>")
    res.write("<h1>Hello world<h1>")
    res.end()
})

const PORT = 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))