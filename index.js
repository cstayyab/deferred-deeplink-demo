const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const pkgInfo = require('./package.json')

const iOSBundleId = process.env.IOS_BUNDLE_ID || process.env.BUNDLE_ID
const iOSTeamId = process.env.TEAMID
const iOSAppNumericId = process.env.IOS_APP_NUMERIC_ID
const androidBundleId = process.env.ANDROID_BUNDLE_ID || process.env.BUNDLE_ID
const deeplinkScheme = process.env.DEEP_LINK_SCHEME
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

const redirectPage = (deepLinkPath) => `
<!DOCTYPE html>
<html>
<head>
<title>Redirect to App or Store</title>
</head>
<body>
<script>
    function redirectToAppOrStore() {
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        var deepLink;
        var storeLink;

        if (isMobile) {
            // Define deep link and store links
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                deepLink = '${deeplinkScheme}://${deepLinkPath}';
                storeLink = 'https://apps.apple.com/app/id${iOSAppNumericId}';
            } else if (/Android/i.test(navigator.userAgent)) {
                // Construct the intent URI for Android deep linking
                deepLink = 'intent://${deepLinkPath}#Intent;scheme=${deeplinkScheme};package=${androidBundleId};end';
                storeLink = 'https://play.google.com/store/apps/details?id=${androidBundleId}';
            }

            // Attempt to redirect to the deep link
            window.location.href = deepLink;

            // Redirect to the store if the app is not installed
            setTimeout(function() {
                window.location.href = storeLink;
            }, 2500); // Adjust timeout as needed
        } else {
            // Optionally handle desktop users or show a message
            alert('Please visit this page on a mobile device.');
        }
    }

    // Run the redirect function when the page loads
    window.onload = redirectToAppOrStore;
</script>
</body>
</html>

`

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

app.get(`/:bundleId/*`, (req, res) => {
    const { bundleId } = req.params
    if(![iOSBundleId, androidBundleId].includes(bundleId)) {
        return res.status(404).json({
            error: 'Invalid Bundle ID.'
        })
    }
    const deepLinkPath = req.params[0];
    res.status(200).send(redirectPage(deepLinkPath))
});

app.listen(port, () => {
  console.log(`Deferred Deeplinkg Demo App listening on port ${port}`)
})

module.exports = app;