class Remote{

	remote(req, res, firebaseapp, http){
		var device = req.params.device
		var id = req.params.id
		var onoff = req.params.onoff
		var token = req.params.token
		var uri = process.env.DOMAIN+'/api/v1/token/'+token
		var ref = firebaseapp.database().ref('home/users')
		var i = -1
		http.get(uri, resp=>{
			let data = ''
				
			resp.on('data', chunk =>{
				data += chunk
			})

			resp.on('end', ()=>{
				var json = JSON.parse(data)
				if(json.status === true){
					ref.once('value', snap =>{
						snap.forEach(child =>{
							if(child.val().id_user === json.id_user){
								switch(device){
									case 'light':{
										child.val().light.forEach(childd =>{
											i++
											if(childd.id_light == id){
												//change here
												ref = firebaseapp.database().ref('home/users/'+child.key+'/light/'+i)
												ref.update({
													id_light: id,
													value: onoff
												})
												res.json({
													status: true,
													device: device,
													token: true,
													changed: {
														id: id,
														value: onoff
													}
												})
												res.end()
											}
										})
										break
									}
									default:{
										res.json({
											status: false,
											device: 'unknown',
											token: true,
											changed: ''
										})
										res.end()
									}
								}
							}
						})
					})
				}else{
					switch(device){
						case 'light':{
							res.json({
								status: false,
								device: device,
								token: false
							})
							res.end()
							break
						}
						default:{
							res.json({
								status: false,
								device: 'unknown',
								token: false
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

module.exports = Remote