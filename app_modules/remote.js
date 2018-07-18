class Remote{

	remote(req, res, firebaseapp, http){
		var device = req.params.device
		var id = req.params.id
		var onoff = req.params.onoff
		var token = req.params.token
		var uri = process.env.DOMAIN+'/api/v1/token/'+token
		var ref = firebaseapp.database().ref('home/users')
		var pass = 0
		var i = -1
		var j = 0

		//check input
		if(id != parseInt(id) || onoff != parseInt(onoff) || onoff<0 || onoff >1 || onoff.toString().length >1){
			res.json({
				status: false,
				error: 'error input value'						
			})
			res.end()
			return
		}

		//change process
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
											j++
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
												pass = 1
											}
											if(j == child.numChildren()){
												if(pass === 0){
													res.json({
														status: false,
														error: 'unknown id'						
													})
													res.end()
												}
											}
										})
										break
									}
									default:{
										res.json({
											status: false,
											device: 'unknown',
											token: true,
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