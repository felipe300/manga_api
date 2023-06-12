const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../server.js")

chai.use(chaiHttp)
const response = (uri) => chai.request(server).get(`${uri}`)

describe("Provando la respuesta de la ruta 'home'", () => {
	let resp

	before(() => {
		resp = response("/")
	})

	it("Comprueba que la respuesta sea un código 200", (done) => {
		resp.end((err, data) => {
			chai.assert.equal(data.status, 200, "El código de estado no coincide")
		})
		done()
	})
})

// Testing la ruta no el Metodo
describe('Test de la ruta POST /anime', () => {
	let resp

	before(() => {
		resp = response("/anime")
	})

	it('Ruta recibe codigo 200', (done) => {
		resp = response('/anime')
		resp.end((error, data) => {
			chai.assert.equal(
				data.status,
				200,
				'No coincide con codigo 200')
		})
		done()
	})
})

describe("comprobar que solo se puede acceder a rutas creadas: Metodo GET", () => {
	let resp
	beforeEach(() => {
		resp = response("/noexiste")
	})

	it("comprueba que el codigo de respuesta sea 404", (done) => {
		resp.end((err, data) => {
			chai.assert.equal(data.status, 404, "El código de estado no coincide")
		})
		done()
	})

	// skip - only => with only pass
	// de esta foma solo lee el primer 'it', el segundo it es nulo
	// it("debe existir una respuesta visual", () => {
	// 	resp.end((err, data) => {
	// 		chai.assert.equal(
	// 			data.text,
	// 			`Ruta ${data.error.method} no encontrada`,
	// 			"No hay respuesta")
	// 	})
	// })
})

describe("Respuesta visual si no se encuentra una ruta", () => {
	let resp
	beforeEach(() => {
		resp = response("/noexiste")
	})

	it("comprueba que el codigo de respuesta sea 404", (done) => {
		resp.end((err, data) => {
			chai.assert.equal(data.status, 404, "El código de estado no coincide")
		})
		done()
	})

	// skip - only => with only pass
	it("debe existir una respuesta visual", (done) => {
		resp.end((err, data) => {
			chai.assert.equal(
				data.text,
				`Ruta ${data.error.method} no encontrada`,
				"No hay respuesta")
		})
		done()
	})
})

describe("GET ruta desconocida", function () {
	let resp
	beforeEach(() => {
		resp = response("/rutadesconocida")
	})

	it("Debería devolver una lista de usuarios", function (done) {
		resp.end(function (err, res) {
			chai.assert.equal(res.status, 404) // check status response 404
			done()
		})
	})
})