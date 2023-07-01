import { LogViewerStyled } from './styled';
import { List } from 'react-virtualized';

export interface LogViewerProps {
  className?: string;
  path: string;
  lines: string[];
}

const LogViewer = ({ path, lines }: LogViewerProps) => {
  return (
    <LogViewerStyled>
      <div className='path selectable'>{path}</div>
      <br />
      {/* @ts-ignore */}
      <List
        width={500}
        height={200}
        rowCount={lines.length}
        rowHeight={50}
        rowRenderer={({ index, key, style }) => (
          <pre className='selectable' key={key} style={style}>
            {lines[index]}
          </pre>
        )}
      />
    </LogViewerStyled>
  );
};

export default LogViewer;
