// import modules //
const express = require("express")
require("dotenv").config()

// init
const app = express()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Listening on " + PORT)
})

