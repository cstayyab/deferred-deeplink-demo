const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const pkgInfo = require('./package.json')

const iOSBundleId = process.env.IOS_BUNDLE_ID || process.env.BUNDLE_ID
const iOSTeamId = process.env.TEAMID
const univeralLink = {
    "applinks": {
        "apps": [],
        "details": [{
            "appID": `${iOSTeamId}.${iOSBundleId}`,
            "paths": [`/${iOSBundleId}/*`]
            }
        ]
    }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Deferred Deep Link Testing Demo!',
    author: pkgInfo.author
  })
})

app.get('/.well-known/apple-app-site-association', (req, res) => {
    if(iOSBundleId && iOSTeamId) {
        res.json(univeralLink)
    } else {
        res.status(404).json({
            error: 'Team ID or Bundle ID is missing.'
        })
    }
})

app.listen(port, () => {
  console.log(`Deferred Deeplinkg Demo App listening on port ${port}`)
})

module.exports = app;