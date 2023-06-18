const express = require('express')
const {engine} = require('express-handlebars')
const app = express()
const port = 3000
const restaurantsData = require('./restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.render('index', {restaurantsData})
})



app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})