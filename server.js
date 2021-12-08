const express = require("express")
const path = require("path")
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, "build")))

app.use(function (req, res, next) {
  req.header("Access-Control-Allow-Origin", "*")
  req.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
  next()
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(PORT)
