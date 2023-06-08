const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.get(["/", "home"], (req, res) => {
	res.send("Hi there")
})

app.listen(PORT, () => console.log(`Server running on port => ${PORT} 🔥🔥🔥`))
