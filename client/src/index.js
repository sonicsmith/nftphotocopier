import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Grommet } from "grommet"
import * as serviceWorker from "./serviceWorker"
import "./fonts/punkkid.ttf"

const theme = {
  global: {
    colors: {
      background: {
        dark: "grey-4",
        light: "grey-1",
      },
    },
  },
  button: {
    border: {
      radius: "8px",
      // color: "rgb(50,50,238)",
    },
  },
}

ReactDOM.render(
  <Grommet full theme={theme}>
    <App />
  </Grommet>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
