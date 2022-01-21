const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
	res.render('new')
})

router.post('/', (req, res) => {
	const name = req.body.name
	const UserId = req.user.id
	console.log(UserId)
	return Todo.create({name, UserId})
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))
})

router.put('/:id', (req,res) => {
	const UserId = req.user.id
	const id = req.params.id
	const {name, isDone} = req.body
	console.log(isDone)
	return Todo.findOne({
		where:{ // 用where條件式尋找
		id, 
		UserId
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

router.get('/:id', (req,res) => {
	const UserId = req.user.id
	const id = req.params.id
	return Todo.findOne({where:{id, UserId}})
		.then(todo => res.render('detail', {todo: todo.toJSON()}))
		.catch(error => res.status(422).json(error))
})

router.get('/:id/edit', (req,res) => {
	const UserId = req.user.id
	const id = req.params.id
	return Todo.findOne({where:{id, UserId}})
		.then(todo => res.render('edit', {todo: todo.toJSON(), UserId}))
		.catch(error => res.status(422).json(error))
})

router.delete('/:id', (req, res) => {
	const UserId = req.user.id
	const id = req.params.id
	return Todo.findOne({where:{id, UserId}})
		.then(todo => todo.destroy())
		.then(() => res.redirect('/'))
		.catch(error => res.status(422).json(error))
})

module.exports = router