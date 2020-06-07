import ReactDOM from "react-dom"
import React from "react"
import { App } from "./components/boxes/App"

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<App />, rootEl)
