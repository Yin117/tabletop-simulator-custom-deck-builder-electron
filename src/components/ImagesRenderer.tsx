// eslint-disable-next-line import/no-unresolved
import { FileContent } from 'use-file-picker/dist/interfaces';




interface IPropsImageRenderer {
  filesContent: FileContent<string>[];
  firstImageId?: string;
}

export function ImagesRenderer({ filesContent, firstImageId = 'first-image' }: IPropsImageRenderer) {

  if (!filesContent.length) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
    }}>
      {filesContent.map((file, index) => (
        <div key={index}>
          <img
            id={index === 0 ? firstImageId : undefined}
            alt={file.name}
            src={file.content}
          />
        </div>
      ))}
    </div>
  )
}