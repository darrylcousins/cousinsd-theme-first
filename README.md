# shopify-theme-first
First crack at a shopify theme with react inclusion

[https://www.cadence-labs.com/2019/12/how-to-add-react-to-a-shopify-theme/]

# Install

```bash
  npm install
```

# Live development

In one screen run:

```bash
  theme watch
```

And in another:

```bash
  npm run watch
```

# Local developement

```bash
  npm run dev
```

This starts a `webpack-dev-server` on `http://localhost:8080` allowing for a
degree of local app development. This does not allow ajax calls to shopify.

# Notes

The file `boxes.bundle.js` is included in theme/layout.liquid.
Check the correct graphql host is used for the app in scripts/config.js
