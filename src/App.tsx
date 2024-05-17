import { useState, useEffect } from 'react';
// USE FILE PICKER
// eslint-disable-next-line import/no-unresolved
import { useFilePicker } from 'use-file-picker';
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
  // eslint-disable-next-line import/no-unresolved
} from 'use-file-picker/validators';
// eslint-disable-next-line import/no-unresolved
import { FileContent } from 'use-file-picker/dist/interfaces';
// USE FILE PICKER
import { Route, Routes } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { Button, Slider, Toolbar, Typography } from '@mui/material';
import { navURLs } from './consts/navigationConsts';
import { ImagesRenderer } from './components/ImagesRenderer';

// https://stackoverflow.com/questions/31869471/loading-clients-images-into-a-canvas
// Try this

function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string) {
  console.log('downloadCanvasAsImage');

	/** https://enjeck.com/blog/download-canvas-image/ */

	// Grab the canvas element
	// const canvas = document.getElementById('debug-canvas') as HTMLCanvasElement;

	/* Create a PNG image of the pixels drawn on the canvas using the toDataURL method. PNG is the preferred format since it is supported by all browsers
	 */
	let dataURL;

	if (canvas?.toDataURL) {
		dataURL = canvas?.toDataURL?.('image/png');
	}

	if (!dataURL) {
		return;
	}

	// Create a dummy link text
	const a = document.createElement('a');
	// Set the link to the image so that when clicked, the image begins downloading
	a.href = dataURL;
	// Specify the image filename
	a.download = filename;
	// Click on the link to set off download
	a.click();
}

async function addImageToCanvas(
  canvas: CanvasRenderingContext2D,
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  // console.log(`addImageToCanvas(canvas, '${src?.substring(0, 20)}...', ${x}, ${y}, ${width}, ${height})`, {
  //   canvas,
  //   src,
  //   x,
  //   y,
  //   width,
  //   height,
  // });
  return new Promise((resolve, reject) => {
    const img2 = new Image();
    try {
      img2.onload = function () {
        canvas?.drawImage(img2, x, y, width, height);
        resolve(true);
      };
      img2.src = src;

    } catch (error) {
      reject(error);
    }
  });
}

async function compileCanvas(
  filesContent: FileContent<string>[],
  sheetWidth: number,
  sheetHeight: number,
  cardWidth: number,
  cardHeight: number
) {
  console.log('compileCanvas', {
    filesContent,
    sheetWidth,
    sheetHeight,
    cardWidth,
    cardHeight,
  });
  const canvas = (document.getElementById('the-canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;

  let x = 0;
  let y = 0;
  for (let i = 0; i < filesContent.length; i++) {
    const file = filesContent[i];

    const posX = cardWidth * x;
    const posY = cardHeight * y;
    console.log(`addImage ${i} to (${posX}, ${posY})`, { x, y })
    await addImageToCanvas(
      canvas,
      file.content,
      posX, // x
      posY, // y
      cardWidth, // width
      cardHeight // height
    );

    if ((i + 1) % sheetWidth === 0) {
      y++;
      x = 0;
    } else {
      x++;
    }

  }
}

export function App() {

  const [filesLoadedTrigger, setFilesLoadedTrgger] = useState(0);

  const [firstCardWidth, setFirstCardWidth] = useState(0);
  const [firstCardHeight, setFirstCardHeight] = useState(0);

  const [sheetWidth, setSheetWidth] = useState(10);
  const [sheetHeight, setSheetHeight] = useState(7);

  const { openFilePicker, filesContent, plainFiles, loading, errors, clear  } = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    validators: [
      new FileAmountLimitValidator({ max: 70 }),
      new FileTypeValidator(['jpg', 'png']),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      new ImageDimensionsValidator({
        maxHeight: 5000, // in pixels
        maxWidth: 5000,
        minHeight: 1,
        minWidth: 1,
      }),
    ],
    onFilesSuccessfullySelected: () => {
      console.log('onFilesSuccessfullySelected');

      setFilesLoadedTrgger(filesLoadedTrigger + 1);
    }
  });
  useEffect(() => {
    const elm = document.getElementById('first-image') as HTMLImageElement;
    if (elm) {
      setFirstCardWidth(elm.naturalWidth);
      setFirstCardHeight(elm.naturalHeight);
    } else {
      console.log('Could not find first image');
    }
    // if (filesContent.length) {
    //   compileCanvas(filesContent, sheetWidth, sheetHeight);
    // }
  }, [filesLoadedTrigger])

  if (firstCardHeight) {
    console.log(`First image is ${firstCardWidth}x${firstCardHeight}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    console.log('errors', errors);
    return (
      <div>
        <Typography variant="h3">
          Errored
        </Typography>
        <Button onClick={clear}>Clear Files</Button>
        {/* {errors.length === 1 &&
        <Typography>{errors[0].reason}</Typography>
        }
        {errors.length > 1 &&
        <ul>
          {
            errors.map(({ reason }) => <li>{reason}</li>)
          }
        </ul>
        } */}
      </div>
    );
  }


  console.log('filesContent', filesContent);
  console.log('plainFiles', plainFiles);

  // const one = new Image();
  // one.onerror = function (error) {
  //   console.log('Error loading image', error);
  // }
  // one.src = `file:${folder.join('\\')}\\${files[0]}`;

  // mergeImages([
  //   { src: `${folder}/${files[0]}`, x: 0, y: 0 },
  //   { src: `${folder}/${files[1]}`, x: cardDims.width, y: 0 },
  // ])
  //   .then(b64 => {
  //     console.log('b64', b64);
  //     fs.writeFileSync(
  //       `${folder}\\composedImage.jpg`,
  //       b64
  //     )
  //   });


  console.log('Canvas Key', [firstCardWidth, firstCardHeight, sheetWidth, sheetHeight]);

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense" disableGutters>
          <Typography variant="h1" fontSize="16px">
            Tabletop Simulator Custom Deck Builder
          </Typography>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path={navURLs.home()}
          element={
            <div style={{ padding: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Typography variant="body1">Width {sheetWidth}</Typography>
                <Slider
                  defaultValue={10}
                  step={1}
                  min={1}
                  max={10}
                  aria-label="Width"
                  value={sheetWidth}
                  onChange={(ev, newVal) => {
                    if (newVal instanceof Array) {
                      return;
                    }
                    setSheetWidth(newVal)
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Typography variant="body1">Height {sheetHeight}</Typography>
                <Slider
                  defaultValue={7}
                  step={1}
                  min={1}
                  max={7}
                  aria-label="Height"
                  value={sheetHeight}
                  onChange={(ev, newVal) => {
                    if (newVal instanceof Array) {
                      return;
                    }
                    setSheetHeight(newVal)
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => openFilePicker()}
                  style={{
                    marginRight: '12px',
                  }}
                >
                  Select files
                </Button>
                <Typography>
                  {filesContent.length} file{filesContent.length === 1 ? '' : 's'}
                </Typography>
              </div>
              
              <Button
                variant="contained"
                onClick={
                  () =>
                    compileCanvas(filesContent, sheetWidth, sheetHeight, firstCardWidth, firstCardHeight)
                }
                disabled={!filesContent.length}
                style={{
                  margin: '0 12px 12px 0',
                }}
              >
                Compile Canvas
              </Button>
              
              <Button
                variant="contained"
                onClick={
                  () =>
                    downloadCanvasAsImage(
                      document.getElementById('the-canvas') as HTMLCanvasElement,
                      'Deck.jpg'
                    )
                }
                disabled={!filesContent.length}
                style={{
                  margin: '0 12px 12px 0',
                }}
              >
                Download Canvas
              </Button>

              <Typography
                variant="overline"
              >
                (The below is not a preview, and just a view of the files)
              </Typography>

              {/* IMAGES PREVIEW */}
              <ImagesRenderer
                filesContent={filesContent}
                cardWidth={firstCardWidth}
                cardHeight={firstCardHeight}
              />

              {/* HIDDEN */}
              <canvas
                id="the-canvas"
                key={[firstCardWidth, firstCardHeight, sheetWidth, sheetHeight].join('-')}
                width={firstCardWidth * sheetWidth}
                height={firstCardHeight * sheetHeight}
                style={{
                  // display: 'none'
                  outline: '1px solid red',
                }}
              />
            </div>
          }
        />
      </Routes>
    </>
  )
}