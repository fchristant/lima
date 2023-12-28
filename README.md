# LiMa

LiMa, short for Light Manager, is a Next.js/React web app to visualize and control the state of your Philips Hue light bulbs.

## Background

LiMa is a small one-time side project by [Ferdy Christant](https://ferdychristant.com/), a learning exercise to gain experience in Next.js/React whilst also building something potentially useful.

## Demo video
https://www.youtube.com/watch?v=1pIjJyt-vmw

## Features

LiMa is a single screen web app. It will visualize the light state of all light bulbs known to the Hue Bridge that you connect it to. 

![image](https://github.com/fchristant/lima/assets/228781/2cd5c874-ea52-4765-b8fc-118008b0f44f)

The top right toggle allows you to switch between *full* (shows all light controls) and *compact* (shows on/off only).

![image](https://github.com/fchristant/lima/assets/228781/38426051-436d-4e8d-be90-f5f66dfaf8f9)

Individual lights are in one of 3 main states:
- **Unreachable**. Rendered as grayed out. The light is physically off and cannot be controlled via the Bridge or this web app.
- **Reachable but off**. The light can be turned on using this web app.
- **Reachable and on**. The current light state is visualized.

![image](https://github.com/fchristant/lima/assets/228781/082ffcd0-c0bc-4912-bcfe-ede3ca028da5)

The state of an individual light is visualized like a dial, where the angle of the dial indicates brightness and its color an approximation of the light bulb color state. In *full* mode, the light's state is also shown numerically. The visualization is semi-realtime, it will automatically update based on changes both externally and within the app, typically with a 100ms delay. When an update is detected, a small pulse animation plays. When your bulbs are in high speed sync mode (for example Spotify Sync), the light state of LiMa will not be accurate, this is due to limitations in the Bridge API.

![image](https://github.com/fchristant/lima/assets/228781/0a817750-a024-4872-97f2-14fa1dafb626)

The navigation bar below the logo list your light groups and entertainment zones. By selecting a group, only the lights belonging to the group are shown. Open *All lights* (first option in the list) to undo any group filter. Each group button contains a toggle to power on/off all lights beloning to the group.

![image](https://github.com/fchristant/lima/assets/228781/076031fd-cc85-45a4-87ee-9d0049a4d85a)

When selecting a group, below the lights in the group are the scenes associated with the group. Click a scene to activate it for the selected group.

![image](https://github.com/fchristant/lima/assets/228781/5ae99507-4caa-448d-8b4c-4c0e80f91168)

Individual lights can be manipulated in the following ways:
- Turn on/off
- Pick a custom color
- Brightness slider
- Color temperature slider (for non-color bulbs)
- Saturation slider
- Hue slider

## Setup

- Clone the repository
- Use a Node/NPM version compatible with Next.js 13/14+
- npm install
- Follow the instructions at https://developers.meethue.com/develop/get-started-2/ to discover the IP address of your Hue Bridge and create a username.
- Add a file named *.env.local* to the project root directory. Set the IP address of your Hue Bridge and the username you created in the previous step:

``````
NEXT_PUBLIC_HUE_IP=192.168.X.X
NEXT_PUBLIC_HUE_USERNAME=yourusername
``````
- Run the project: next dev
- Navigate to localhost:3000

## Technical background
LiMa effectively is a render loop. It continuously polls the Hue Bridge V1 API for the latests state of lights and groups. When manipulating a light or group via LiMa, a POST call is made to your Hue Bridge, after which the next cycle of the polling mechanism picks up the change.

## Controlling the polling frequency
The default polling interval for the state of lights is 300ms, as set in Lightlist.tsx:

![image](https://github.com/fchristant/lima/assets/228781/09486e57-ddec-4637-87e5-de5d989bbc22)

This value can be set to a lower value but should not be set lower than 100 as the Hue Bridge API will not be able to keep up. Group state tends to change far less often so the default value for group state polling is set to 1000ms in Grouplist.tsx:

![image](https://github.com/fchristant/lima/assets/228781/2ac7f93e-f382-4346-a78c-cfb2b8f4f392)

## Controlling groups display

LiMa supports a crude way to perfect your light dashboard. Using optional files in the _customize_ directory, you can ignore groups, change their order, and change the order of lights within a group.

### Ignoring groups
A typical Hue Bridge may have groups, such as entertainment zones, that you do not want to appear in your dashboard. Using a *customize/groupsignore.ts* file, you can filter them out. Example:

![image](https://github.com/fchristant/lima/assets/228781/9a361c02-a808-44cc-b4b0-63e4021e2fa8)

The group identifiers in the array will lead to those groups not rendered in LiMa. To find out the ID of a group, use the network inspector in your browser to find it in the _groups_ network call:

![image](https://github.com/fchristant/lima/assets/228781/d9130c79-c426-4092-b8eb-37ba60e16112)

### Changing the groups order

Groups will be rendered in whatever order the Hue Bridge returns them, which may not be your ideal order. You can customize the order of groups using a *customize/groupsorder.ts* file. Example:

![image](https://github.com/fchristant/lima/assets/228781/85b62456-10c6-4586-834e-8b3fbff4560c)

### Changing the order of lights within a group

Lights within a group are ordered in whatever order the Hue Bridge returns them, which typically is the original order in which you installed them. This order may not always reflect physical reality. Say you have 3 lights in a row that you named _left_, _middle_, _right_, the Hue Bridge may return these in an illogical order. A special *customize/grouplightorder.ts* file allows you to manipulate the light order per group. Example:

![image](https://github.com/fchristant/lima/assets/228781/214e51a6-4d88-45e6-a827-ada8288b1ad6)

## Deployment considerations

The default way to run LiMa is to run the Next.js project. This will run LiMa locally. By figuring out the local network address of the machine you're running it on, you can then also open it on your other devices. You could then shutdown the server on your main machine and LiMa will keep working on your devices for as long as you do not refresh the page.

This approach is not great, but unfortunately alternative deployment models are tricky:
- It's possible to deploy LiMa publicly, for example on Vercel. This way your personal machine is taken out of the equasion. Unfortunately, public-to-private network calls (the public website will need to reach your private network Hue Bridge) are blocked in all browsers except Firefox, as a security measure. To make this type of deployment robust, a proxy would be needed.
- A Philips Bridge also features a token-based remote API that would address the above problem but it does not work for web apps due to a long running CORS issue on the preflight request. This is also the reason why LiMa uses the V1 API instead of the V2 API.
- Ideally, LiMa is packaged as a PWA (Progressive Web App) so that it can be installed as a fully local web app not requiring a server, but LiMa currently does not support this.

## Known issues and limitations
- The reported color on screen may be slightly inaccurate compared to the actual light bulbs due differences in color spaces.
- When all lights in a group are unreachable, the group toggle will not (can not) reflect this state.
- Sliders may stutter a little when you manipulate them, this is due to the render loop "catching up" with your changes.
- An external change of color temperature may take a long time to reflect in LiMa (Hue Bridge API limitation?).
- LiMa renders animated scenes but not sync mode. During sync mode, the Bridge does not give API updates.
- Error handling is very basic.
- I'm not a seasoned Next.js/React developer. Code quality is reasonable but surely has lots of room for improvement.

## Contributing
LiMa is a one-time effort, a learning exercise completed. I do not plan to spend time maintaining or extending it. I accept small pull requests but if you want to make serious changes, I invite you to fork it and make it your own.
