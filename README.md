# Deferred Deep Linking Demo App

## Overview
This Express.js application is designed to demonstrate deferred deep linking capabilities. It handles deep links for both iOS and Android platforms, redirecting users to the respective app if installed, or to the app store if not. The project also includes a test page that simulates deep linking behavior for verification purposes.

### Features
- Dynamic deep link handling based on user agent.
- iOS Universal Links support.
- Android Intent URI for deep linking.
- Test page for deep linking functionality.
- Redirection to the respective app store if the app is not installed.

## Getting Started

### Prerequisites
Ensure you have Node.js and npm installed on your system to run the application locally.

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/cstayyab/deferred-deep-link-demo.git
cd deferred-deep-link-demo
npm install
```

### Configuration
Create a `.env` file in the root directory of the project and fill it with the necessary environment variables based on the provided `.env.sample`.

## Environment Variables
You need to configure the following environment variables for the application to function correctly:

- `IOS_BUNDLE_ID`: Your iOS app's bundle identifier.
- `TEAMID`: Your Apple Developer Team ID.
- `IOS_APP_NUMERIC_ID`: The numeric ID of your iOS app from the App Store.
- `ANDROID_BUNDLE_ID`: Your Android app's package name.
- `DEEP_LINK_SCHEME`: The URL scheme used for deep linking.

Refer to the `.env.sample` file for details and format.

## Deployment to Vercel

This application is configured for deployment on Vercel with the included `vercel.json` file. To deploy:

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Log in to Vercel CLI:
```bash
vercel login
```

3. Deploy the application:
```bash
vercel --prod
```

The deployment will automatically use the configuration specified in `vercel.json`.

## Local Development

To run the application locally:
```bash
npm start
```

By default, the application will start on port 3000, unless specified otherwise in your environment variables.

## Testing Deep Links

Visit `http://localhost:3000/testPage` on a mobile device or emulator to access the deep link test page. Clicking the test link will attempt to open the app on the device. If the app is not installed, it should redirect to the appropriate app store after a short delay.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
