const app = require("./server.js")

const PORT = process.env.PORT || 3000

const main = () => {
	let server = app.listen(PORT)

	server.on("error", function (error) {
		console.error("Error en el servidor:")
	})
}

main()