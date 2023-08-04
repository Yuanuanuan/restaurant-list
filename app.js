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
})

app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    return res.redirect('/restaurants')
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Rest.findAll({
    raw: true
  })
    .then((data) => {
      const restaurantName = data.filter((data) => {
        return data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      })

      res.render('index', { rest: restaurantName, keywords })
    })
    .catch((err) => console.log(err))
  })

  app.get('/restaurants/new', (req, res) => {
    return res.render('new')
  })

  app.post('/restaurants', (req, res) => {
    const data = {
      name: req.body.name,
      name_en: req.body.name_en,
      category: req.body.category,
      image: req.body.image,
      location: req.body.location,
      phone: req.body.phone,
      google_map: req.body.google_map,
      rating: req.body.rating,
      description: req.body.description
    }

    return Rest.create(data)
      .then(() => {
      res.redirect('/restaurants')
      })
      .catch((err) => console.log(err))
  })

  app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id

    return Rest.findByPk(id, {
      raw: true
    })
      .then((rest) => res.render('info', { rest }))
      .catch((err) => console.log(err))
  })
  

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id

  return Rest.findByPk(id, {
    raw: true
  })
    .then((rest) => res.render('edit', { rest }))
})

app.put('/restaurants/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  return Rest.update(
    { 
      name: body.name,
      name_en: body.name_en,
      category: body.category,
      image: body.image,
      location: body.location,
      phone: body.phone,
      google_map: body.google_map,
      rating: body.rating,
      description: body.description
    },
    { where: { id }}
    )
      .then(() => res.redirect(`${id}`))
      .catch((err) => console.log(err))
})

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id

  return Rest.destroy({ where: { id }})
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})