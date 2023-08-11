## Philips Hue Web App

A Next.js/React web app to explore your Hue Bridge.

## Setup

- Follow the instructions at https://developers.meethue.com/develop/get-started-2/ to discover the IP address of your Hue Bridge and create a username.
- Add a file named *.env.local* to the project root directory. Set the IP address of your Hue Bridge and the username you created in the previous step:

``````
NEXT_PUBLIC_HUE_IP=192.168.X.X
NEXT_PUBLIC_HUE_USERNAME=yourusername
``````
- Build the project
