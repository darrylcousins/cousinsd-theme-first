import React from 'react';
import ReactDOM from 'react-dom';

import { App } from "./components/boxes/App"

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<App />, rootEl)
