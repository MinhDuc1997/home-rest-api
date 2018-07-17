class App{

	build(){
		const express = require('express')
		const app = express()
		app.listen(3500, () => console.log('opened port 3500'))
		return app
	}

}

module.exports = App