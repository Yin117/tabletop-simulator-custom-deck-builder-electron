// eslint-disable-next-line import/no-unresolved
import { FileContent } from 'use-file-picker/dist/interfaces';




interface IPropsImageRenderer {
  filesContent: FileContent<string>[];
  firstImageId?: string;
  cardWidth?: number;
  cardHeight?: number;
}

export function ImagesRenderer(props: IPropsImageRenderer) {
  const {
    filesContent,
    firstImageId = 'first-image',
    cardWidth,
    cardHeight,
  } = props;

  const sizeVector = cardWidth && cardHeight
    ? Math.sqrt(Math.pow(cardWidth, 2) + Math.pow(cardHeight, 2))
    : 0;
  const width = sizeVector && cardWidth
    ? (cardWidth / sizeVector) * 10
    : 50;
  const height = sizeVector && cardHeight
    ? (cardHeight / sizeVector) * 20
    : 100;

  if (!filesContent.length) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
    }}>
      <img
        id={firstImageId}
        alt={filesContent[0].name}
        src={filesContent[0].content}
        // style={{
        //   display: 'none',
        // }}
      />
      {filesContent.map((file, index) => (
        <div key={index}>
          <img
            alt={file.name}
            src={file.content}
            width={width}
            height={height}
          />
        </div>
      ))}
    </div>
  )
}