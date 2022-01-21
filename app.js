const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const passport = require('passport')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000
const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({defaultLayout:'main', extname:'.hbs'}))
app.set('view engine', 'hbs')
app.use(session({
	secret:'SecretsMakeWomanWoman',
	resave: false,
	saveUninitialized: true
}))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

usePassport(app)
app.get('/', (req,res) => {
	return Todo.findAll({
		raw: true,
		nest: true
	})
	.then(todos => res.render('index', {todos}))
	.catch(error => {res.status(422).json(error)})
})

app.get('/todos/new', (req, res) => {
	res.render('new')
})

app.post('/todos', (req, res) => {
	const name = req.body.name
	const temperaryUserId = '168'
	return Todo.create({name, UserId:temperaryUserId})
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))
})

app.put('/todos/:id', (req,res) => {
	const temperaryUserId = '168' // 之後回來改
	const id = req.params.id
	const {name, isDone} = req.body
	console.log(isDone)
	return Todo.findOne({
		where:{ // 用where條件式尋找
		id, 
		UserId: temperaryUserId
		}}) 
		.then(todo => {
			if (isDone){
				return todo.update({name,isDone:'1'})
			}
			return todo.update({name,isDone:'0'})
		})
		.then(() => res.redirect(`/todos/${id}`))
		.catch(error => res.status(422).json(error))
})

app.get('/todos/:id', (req,res) => {
	const id = req.params.id
	return Todo.findByPk(id) // 用主鍵尋找
		.then(todo => res.render('detail', {todo: todo.toJSON()}))
		.catch(error => res.status(422).json(error))
})

app.get('/todos/:id/edit', (req,res) => {
	const temperaryUserId = '168' // 之後回來改
	const id = req.params.id
	return Todo.findByPk(id) // 用主鍵尋找
		.then(todo => res.render('edit', {todo: todo.toJSON(), UserId: temperaryUserId}))
		.catch(error => res.status(422).json(error))
})

app.get('/users/login', (req, res) => {
	res.render('login')
})

app.post('/users/login', passport.authenticate('local',{
	successRedirect: '/',
	failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
	res.render('register')
})

app.post('/users/register', (req, res) => {
	const {name, email, password, confirmPassword} = req.body
	User.findOne({where: {email}})
	.then(user => {
		if(user){
			console.log('User already exists.')
			return res.render('register', {
				name, email, password, confirmPassword
			})
		}
		return bcrypt.genSalt(10)
		.then(salt => bcrypt.hash(password, salt))
		.then(hash => User.create({
			name, email, password:hash
		}))
		.then(() => res.redirect('/'))
		.catch(err => console.log(err))
	})
})

app.get('/users/logout', (req, res) => {
	res.send('logout')
})

app.listen(PORT, () => {
	console.log(`App is running on http://localhost:${PORT}`)
})

