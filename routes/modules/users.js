const express = require('express')
const passport = require('passport')
const router = express.Router()
const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
	return res.render('login')
})

router.post('/login', 
	passport.authenticate('local',{
			failureRedirect: '/users/login',
		}), (req, res) => {res.redirect('/')}	
)

router.get('/register', (req, res) => {
	res.render('register')
})

router.post('/register', (req, res) => {
	const {name, email, password, confirmPassword} = req.body
	const errors = []
	if(!email||!password||!confirmPassword||!name){
		errors.push({message: '所有欄位都是必填。'})
	}
	if(password !== confirmPassword){
		errors.push({message:'密碼與確認密碼不相符！'})
	}
	if(errors.length){
		return res.render('register', {
			errors, name, email, password, confirmPassword
		})
	}
	User.findOne({where: {email}})
	.then(user => {
		if(user){
			errors.push({message: '此帳號已經註冊過了。'})
			return res.render('register', {
				errors, name, email, password, confirmPassword
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

router.get('/logout', (req, res) => {
	req.logout()
	req.flash('success_msg', '您已登出！')
	res.redirect('/users/login')
})

module.exports = router