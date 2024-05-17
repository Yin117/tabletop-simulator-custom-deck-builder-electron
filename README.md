# tabletop-simulator-custom-deck-builder-electron
FUNCTIONAL-PROTOTYPE - Tabletop Simulator Custom Deck Builder, download the application and quickly build a sheet of cards, using Electron

---

## How to use
- Install modules `npm i`
- Run locally `npm run start`
  - If any issues, see if an exe works: `npm run make` (will write to `/out` folder)
- Match the desired settings in TTS
  - Pick a number of files (70 max)
  - Set the Width of the Sheet
  - Set the Height of the Sheet
- Compile the Canvas
- Download the Canvas
---

### Developer Note
I would like to invest more time refining this, but for now, it's fit for purpose

---

### Using
- [Electron Forge](https://www.electronforge.io/templates/typescript-+-webpack-template)
- [Material UI](https://mui.com/material-ui/getting-started/)

---

### Creation Process
- [Electron Forge Typescript with Webpack Template](https://www.electronforge.io/templates/typescript-+-webpack-template)
  - `npm init electron-app@latest my-new-app -- --template=webpack-typescript`
- Installed various `@types/*` modules
- Update `renderer.ts` and `index.html` to successfully run the React App code
- Installed `@emotion/react @emotion/styled @mui/material @mui/styled-engine-sc styled-components`
- Installed `@fontsource/roboto`
- Installed `@mui/icons-material`
  - https://mui.com/material-ui/icons/
- Installed `use-file-picker` for file accessing
- Made use of HTML5 native canvas to compile the images into a single canvas
