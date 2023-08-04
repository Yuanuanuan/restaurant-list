const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()

const db = require('./models')
const Rest = db.Restaurant

const port = 3000

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/restaurants', (req,res) => {
  return Rest.findAll({
    attributes: ['id', 'image', 'name', 'category', 'rating'],
    raw: true
  }) 
    .then((rest) => res.render('index', { rest }))
    .catch((err) => console.log(err))
  // return Rest.findAll({
  //   attributes: ['id', 'image', 'name', 'category', 'rating'],
  //   raw: true
  // }) 
  //   .then((rest) => res.send({ rest }))
  //   .catch((err) => console.log(err))

})

app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    return res.redirect('/')
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  const matchedRestaurant = restaurantsData.filter( 
  data => {
    return data.name.toLowerCase().includes(keyword) || 
    data.category.includes(keyword)
  })
  res.render('index', {restaurantsData: matchedRestaurant, keywords})
})

app.get('/restaurants/:restaurantId', (req, res) => {
  const {restaurantId} = req.params
  const restaurantData = restaurantsData.find(data => {
    return data.id === Number(restaurantId)
  })
  res.render('show', {restaurantData})
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})