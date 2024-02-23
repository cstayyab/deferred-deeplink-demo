const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const pkgInfo = require('./package.json')

const iOSBundleId = process.env.IOS_BUNDLE_ID || process.env.BUNDLE_ID
const iOSTeamId = process.env.TEAMID
const iOSAppNumericId = process.env.IOS_APP_NUMERIC_ID
const androidBundleId = process.env.ANDROID_BUNDLE_ID || process.env.BUNDLE_ID
const deeplinkScheme = process.env.DEEP_LINK_SCHEME
const appWebPage = process.env.APP_WEB_PAGE;
const univeralLink = {
    "applinks": {
        "apps": [],
        "details": [{
            "appID": `${iOSTeamId}.${iOSBundleId}`,
            "paths": [`/${iOSBundleId}/*`, `/universalLinkTest`]
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
                if (document.hasFocus()) {
                    window.location.href = storeLink;
                }
            }, 100); // Adjust timeout as needed

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

const universalLinkTestPage = () => `
<!DOCTYPE html>
<html>
<head>
<title>Redirect to App or Store</title>
</head>
<body>
<script>
    function redirectToAppOrStore() {
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        var os = (/iPhone|iPad|iPod/i.test(navigator.userAgent)) ? 'iOS' : ((/Android/i.test(navigator.userAgent)) ? 'Android' : 'None');
        var deepLink;
        var storeLink;

        if (isMobile) {
            // Define deep link and store links
            if (os == 'iOS') {
                storeLink = 'https://apps.apple.com/app/id${iOSAppNumericId}';
                deepLink = null;
            } else if (os == 'Android') {
                // Construct the intent URI for Android deep linking
                deepLink = 'intent://${deepLinkPath}#Intent;scheme=${deeplinkScheme};package=${androidBundleId};end';
                storeLink = 'intent://details?id=${androidBundleId}#Intent;scheme=market;action=android.intent.action.VIEW;package=com.android.vending;end';
            } else {
                storeLink = null;
                deepLink = null;
            }

            // Attempt to redirect to the deep link
            if(deepLink) {
                window.location.href = deepLink;
            }

            // Redirect to the store if the app is not installed
            setTimeout(function() {
                if (document.hasFocus()) {
                    if(storeLink) {
                        window.location.href = storeLink;
                    } else {
                        window.location.href = '${appWebPage}';
                    }
                }
            }, 100); // Adjust timeout as needed

        } else {
            window.location.href = '${appWebPage}';
        }
    }

    // Run the redirect function when the page loads
    window.onload = redirectToAppOrStore;
</script>
</body>
</html>

`

const testPage = (bundleId) => `
<!DOCTYPE html>
<html>
<head>
<title>Test Deep Link</title>
</head>
<body>
    <h1>Deep Link Test Page</h1>
    <p>Click the link below to test the deep linking functionality.</p>
    <a href="/${bundleId}/test">Test Deep Link</a>
</body>
</html>
`

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Deferred Deep Link Testing Demo!',
    author: pkgInfo.author
  })
})

app.get('/testPage', (req, res) => {
    const userAgent = req.headers['user-agent']

    let bundleId
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        bundleId = iOSBundleId
    } else if (/Android/i.test(userAgent)) {
        bundleId = androidBundleId
    } else {
        return res.send('Please visit this page on a mobile device.')
    }

    res.send(testPage(bundleId))
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

app.get('/universalLinkTest', (req, res) => {
    res.send(universalLinkTestPage());
});

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