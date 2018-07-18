class Myhome{

	myhome(req, res, firebaseapp, http){
		var token = req.params.token
		var device = req.params.device
		var uri = process.env.DOMAIN+'/api/v1/token/'+token
		var i = 0
		http.get(uri, resp =>{
			let data = ''
			
			resp.on('data', chunk=>{
				data += chunk
			})

			resp.on('end', ()=>{
				var json = JSON.parse(data)
				var array = []
				// check status token
				if(json.status == true){
					var ref = firebaseapp.database().ref('home/users/')

					//find id_user of token in "users"
					ref.once('value', snap =>{
						snap.forEach(child =>{
							if(child.val().id_user == json.id_user){
								switch(device){
									case 'light':{
										ref = firebaseapp.database().ref('home/users/'+child.key+'/light')
										ref.once('value', snapp =>{
											snapp.forEach(childd =>{
												i++
												array.push(childd.val())
												if(i == snap.numChildren()){
													res.json({
														device: device,
														status: true,
														token: true,
														light: array
													})
													res.end()
												}
											})
										})
										break
									}
									default:{
										res.json({
											device: 'unknown',
											status: false,
											token: true
										})
										res.end()
										break
									}
								}
							}
						})
					})
				}else{
					switch(device){
						case 'light':{
							res.json({
								device: device,
								status: false,
								token: 'expried',
							})
							res.end()
							break
						}
						default: {
							res.json({
								device: 'unknown',
								status: false,
								token: 'expried',
							})
							res.end()
							break
						}
					}
				}
			})
		})
	}

}

module.exports = Myhome