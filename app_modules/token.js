class Token{

	token(req, res, firebaseapp){
		var token = req.params.token
		var pass = 0
		var j = 0
		var ref = firebaseapp.database().ref('token')
		var dateNow = new Date()
		var id_user = ''
		ref.once('value', snap =>{
			snap.forEach(child => {
				j++
				if(child.val().value == token){
					var date1 = new Date(child.val().expried).getTime()
				 	var date2 = new Date(dateNow.getFullYear()+'/'+(dateNow.getMonth()+1)+'/'+dateNow.getDate()).getTime()
					var timeDiff = date1 - date2
				 	
				 	if(timeDiff > 0){
				 		var diffDays = timeDiff / (1000 * 3600 * 24);

						if(diffDays <= 60){
							pass = 1
							id_user = child.val().id_user
						} 
					}
				}
				if(j == snap.numChildren()){
					if (pass == 1  ) {
						res.json({
			 				status: true,
			 				id_user: id_user
					 	}) 
					}else{
						res.json({
			 				status: false
					 	}) 
					}
					res.end()
				}
			})
		})
	}
	
}

module.exports = Token