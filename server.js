const express = require("express")
const { create } = require("express-handlebars")
const cors = require("cors")
const { leerAnime, buscarPorNombre, agregarAnime, actualizarAnime, borrarAnime } = require("./utils/operations")

const app = express()

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

app.get(["/", "/home"], async (req, res) => {
	try {
		res.status(200).render("home", {
			home: true
		})
	} catch (err) {
		res.status(500).send({ code: 500, message: `Error al cargar pagina home` })
		console.log(err)
	}

})

app.get("/anime", async (req, res) => {
	try {
		let response = await leerAnime()
		res.render("anime", {
			animes: response.animes,
		})
	} catch (error) {
		res.render("anime", {
			error
		})
	}
})

app.get("/anime/:nombre", async (req, res) => {
	try {
		const { nombre } = req.params
		let found = await buscarPorNombre(nombre)
		res.render("updateAnime", {
			updateAnime: found,
		})
	} catch (error) {
		res.render("updateAnime", {
			error: true,
		})
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

app.put("/anime/:id", async (req, res) => {
	try {
		const { id } = req.params
		const { nombre, genero, year, autor } = req.body

		let found = await actualizarAnime(id, nombre, genero, year, autor)
		found.nombre = nombre
		found.genero = genero
		found.year = year
		found.autor = autor

		res.send({
			code: 200,
			message: 'Anime actualizado con exito'
		})
	}
	catch (error) {
		console.log(error)
		res.status(500).send({
			code: 500,
			message: "error al actualizar el Anime en la bd.",
		})
	}
})

app.delete("/anime/:id", async (req, res) => {
	try {
		const { id } = req.params
		console.log("index " + id)
		let respuesta = await borrarAnime(id)
		res.status(200).send({ code: 200, message: respuesta })
	} catch (error) {
		console.log(error)
		res.status(500).send({
			code: 500,
			message: `error al eliminar el anime ${id} en la bd`,
		})
	}
})

app.all('*', async (req, res) => {
	res.status(404).send(`Ruta ${req.method} no encontrada`)
})

module.exports = app