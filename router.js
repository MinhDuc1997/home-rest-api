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
const myhome = require('./app_modules/myhome')
const https = require('https')
const http = require('http')

app.get('/', function(req, res){
	res.send('<pre>Wellcome</pre>')
	res.end()
})

app.get('/api/v1/login/:username/:password', (req, res) =>{
	var lg = new login()
	lg.login(req, res, firebaseapp)		
})

app.get('/api/v1/token/:token', (req, res) =>{
	var tk = new token()
	tk.token(req, res, firebaseapp)
})

app.get('/api/v1/myhome/:device/:token', (req, res) =>{
	var mh = new myhome()
	mh.myhome(req, res, firebaseapp, http)
})

app.get('/api/v1/remote/:device/:id/:onoff/:token', (req, res) =>{
	var device = req.params.device
	var id = req.params.id
	var onoff = req.params.onoff
	var token = req.params.token
	var uri = 'http://localhost:3500/api/v1/token/'+token
	var ref = firebaseapp.database().ref('home/users')
	var i = -1
	http.get(uri, resp=>{
		let data = ''
			
			resp.on('data', chunk =>{
				data += chunk
			})

			resp.on('end', ()=>{
				json = JSON.parse(data)
				ref.once('value', snap =>{
					snap.forEach(child =>{
						if(child.val().id_user === json.id_user){
							child.val().light.forEach(childd =>{
								i++
								if(childd.id_light == id){
									console.log(child.val())
									//change here
									ref = firebaseapp.database().ref('home/users/'+child.key+'/light/'+i)
									ref.update({
										id_light: id,
										value: onoff
									})
									res.json({
										status: true,
										device: device,
										changed: {
											id: id,
											value: onoff
										}
									})
									res.end()
									console.log('home/users/'+child.key+'/light/'+i)
								}
							})
						}
					})
				})

			})
	})
})