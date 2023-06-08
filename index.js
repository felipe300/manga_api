const express = require("express")
const { create } = require("express-handlebars")
const cors = require("cors")
const { v4: uuid } = require("uuid")
const { leerAnime, buscarPorNombre, agregarAnime } = require("./utils/operations")

const app = express()
const PORT = process.env.PORT || 3000

const hbs = create({
	partialsDir: ["views/partials/"],
})

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")

app.use(express.json())
app.use(cors())

app.use(
	"/bootstrap",
	express.static(__dirname + "/node_modules/bootstrap/dist/")
)

app.get(["/", "/home"], (req, res) => {
	res.render("home", {
		home: true
	})
})

app.get("/anime", async (req, res) => {
	let response = leerAnime()
	response
		.then(data => {
			res.render("anime", {
				animes: data.animes,
				anime: true
			})
		})
		.catch(error => {
			res.render("animes", {
				error
			})
		})
})

app.get("/anime/api/:nombre", async (req, res) => {
	try {
		const { nombre } = req.params
		let response = await buscarPorNombre(nombre)
		if (response) {
			res.status(200).send(response)
		} else {
			res.status(500).send({ code: 500, message: `El anime ${nombre} no existe` })
		}
	} catch (err) {
		res.status(500).send({ code: 500, message: err.message })
		console.log(err)
	}
})

app.post("/anime", async (req, res) => {
	try {
		const { nombre, genero, year, autor } = req.body
		let response = await agregarAnime(nombre, genero, year, autor)
		res.status(201).send({ code: 201, message: response })
	} catch (err) {
		res.status(500).send({ code: 500, message: `El anime ${nombre} no se ha creado` })
		console.log(err)
	}
})

app.put("/anime/:id", (req, res) => {
	res.send("Hi there")
})

app.delete(["/anime/:id", "home"], (req, res) => {
	res.send("Hi there")
})

app.listen(PORT, () => console.log(`Server running on port => ${PORT} 🔥🔥🔥`))
