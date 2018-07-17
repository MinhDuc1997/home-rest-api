require('dotenv').config()
const server = require('./app')
const app = new server().build()
const firebase = require('firebase')
const firebaseapp = firebase.initializeApp({
	apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID
})
const login = require('./app_modules/login')
const token = require('./app_modules/token')

app.get('/', function(req, res){
	res.send('<pre>wellcome</pre>')
	res.end
})

app.get('/api/v1/login/:username/:password', function(req, res){
	var lg = new login()
	lg.login(req, res, firebaseapp)		
})

app.get('/api/v1/token/:token', function(req, res){
	var tk = new token()
	tk.token(req, res, firebaseapp)
})