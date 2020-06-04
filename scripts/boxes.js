import ReactDOM from "react-dom"
import React from "react"
import { Boxes } from "./Components/Boxes"

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(Boxes, rootEl)
