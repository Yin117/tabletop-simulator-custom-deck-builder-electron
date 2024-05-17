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
import { Toolbar, Typography } from '@mui/material';
import { navURLs } from './consts/navigationConsts';
import { ImagesRenderer } from './components/ImagesRenderer';

// https://stackoverflow.com/questions/31869471/loading-clients-images-into-a-canvas
// Try this

const cardDims = {
  width: 479,
  height: 671,
};


function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string) {
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
  console.log(`addImageToCanvas(canvas, '${src?.substring(0, 20)}...', ${x}, ${y}, ${width}, ${height})`, {
    canvas,
    src,
    x,
    y,
    width,
    height,
  });
  return new Promise((resolve, reject) => {
    const img2 = new Image();
    try {
      img2.onload = function () {
        canvas?.drawImage(img2, x, y, width, height);
        console.log('onLoad ran');
        resolve(true);
      };
      img2.src = src;

    } catch (error) {
      reject(error);
    }
  });
}

async function envoke(filesContent: FileContent<string>[]) {
  console.log('envoke');
  const canvas = (document.getElementById('the-canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;

  let i = 0;
  for (const file of filesContent) {
    await addImageToCanvas(
      canvas,
      file.content,
      cardDims.width * i, // x
      0, // y
      cardDims.width,
      cardDims.height
    );

    // ++
    i++;
  }
}

export function App() {

  const { openFilePicker, filesContent, plainFiles, loading, errors } = useFilePicker({
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
  });

  const [firstCardWidth, setFirstCardWidth] = useState(0);
  const [firstCardHeight, setFirstCardHeight] = useState(0);

  useEffect(() => {
    const elm = document.getElementById('first-image') as HTMLImageElement;
    if (elm) {
      setFirstCardWidth(elm.naturalWidth);
      setFirstCardHeight(elm.naturalHeight);
    }
  }, [!!filesContent, filesContent.length]);

  if (firstCardHeight) {
    console.log(`First image is ${firstCardWidth}x${firstCardHeight}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    console.log('errors', errors);
    return <div>Error...</div>;
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
            <div>
              Home

              <button onClick={() => openFilePicker()}>Select files</button>
              <br />
              {
                !!filesContent.length &&
                <button onClick={() => envoke(filesContent)}>Compile Canvas</button>
              }
              <button
                onClick={
                  () =>
                    downloadCanvasAsImage(
                      document.getElementById('the-canvas') as HTMLCanvasElement,
                      'Deck.jpg'
                    )
                }
              >
                Download Canvas
              </button>
              <canvas id="the-canvas" width={filesContent.length * cardDims.width} height={cardDims.height} />
              <ImagesRenderer
                filesContent={filesContent}
              />
            </div>
          }
        />
      </Routes>
    </>
  )
}