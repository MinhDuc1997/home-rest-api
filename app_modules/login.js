class Login{

	login(req, res, firebaseapp){
		var username = req.params.username
		var password = req.params.password
		var email = ''
		var id_user = ''
		var pass = 0
		var ref = firebaseapp.database().ref('users')
		var j = 0
		ref.once('value', snap =>{
			j++
			snap.forEach(child =>{
				if(child.val().password === password && child.val().username === username){
					pass = 1
					id_user = child.val().id_user
					email = child.val().email
				}
				if(j === snap.numChildren()){
					if(pass === 1){
							console.log('pass')
							var new_token = '';
		  					var limit = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		  					var length = 64
			  				for (var k = 0; k < 64; k++)
			    				new_token += limit.charAt(Math.floor(Math.random() * limit.length))
							var new_date = new Date()
							new_date.setDate(new_date.getDate()+31)
							new_date = new_date.toString()
							new_date = new Date(new_date)
							new_date = new_date.getFullYear()+'/'+(new_date.getMonth()+1)+'/'+new_date.getDate()
							console.log(new_date)
							res.json({
								status_login: true,
								user_info:{
									username: username,
									email: email,
									token: new_token
								}
							})
							var refdb = firebaseapp.database().ref('token')
							refdb.push({
								expried: new_date,
								id_user: id_user,
								value: new_token
							})
						}else{
							res.json({
								status_login: false,
							})
						}
						res.end()
					}
				j++
			})
		}), function(errorObj){
			console.log('read false')
		}
	}
	
}
module.exports = Login