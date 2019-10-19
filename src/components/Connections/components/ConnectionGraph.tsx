import React, { FC, useMemo, useState, useEffect, useRef } from 'react';
import { withStyles, StyleRules, CSSProperties } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Connections } from '../../../reducers';
import NodeComponent from './NodeComponent';
import Grapher, {
  ThoughtsById,
} from '../lib/grapher';
import { Node } from '../lib/types';

interface ConnectionGraphProps {
  classes: any;
  thought: Thought;
  thoughts: Thought[];
  connections: Connections;
}


const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  nodeComponent: {
    ...theme.defaults.centered,
    '&:after': {
      content: "''",
      backgroundColor: theme.palette.primary[500],
      borderRadius: '50%',
      height: 20,
      width: 20,
    },
    '&.origin': {
      '&:after': {
        backgroundColor: theme.palette.secondary[300],
        height: 25,
        width: 25,
      },
    },
  },
  nodeTitle: {
    fontWeight: 600,
    color: theme.palette.gray[200],
  },
});

export const ConnectionGraph: FC<ConnectionGraphProps> = ({ classes, thought, thoughts, connections }) => {
  const grapher = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tree, setTree] = useState<Node[]>([]);

  const getGrapher = (): Grapher => {
    if (grapher.current === null) {
      grapher.current = new Grapher();
    }

    return grapher.current;
  }

  const thoughtsById = useMemo(() => {
    return thoughts.reduce((byId, thought) => {
      byId[thought.id] = thought;
      return byId;
    }, {} as ThoughtsById);
  }, [thoughts]);

  useEffect(() => {
    getGrapher()
      .update(thought, connections)
      .generate(setTree);
  }, [thought, connections]);

  useEffect(() => {
    getGrapher().draw(canvasRef.current, tree, thoughtsById);
  }, [tree, thoughtsById]);

  const [columns, rows, _nodes]: any[] = useMemo(() => {
    const maxY = Math.max(...tree.map(({ y }) => y));
    const maxX = Math.max(...tree.map(({ x }) => x));

    return [maxX, maxY, tree.map(({ x, y, vertex }) => {
      const nodeThought = thoughtsById[vertex.id];

      return (
        <NodeComponent
          classes={classes}
          key={nodeThought.id}
          x={x}
          y={y}
          columns={maxX}
          rows={maxY}
          thought={nodeThought}
          isOrigin={thought.id === nodeThought.id}
        />
      )
    })];
  }, [tree, thoughtsById]);

  const style: CSSProperties = useMemo(() => {
    return {
      display: 'grid',
      gridTemplateRows: `repeat(${rows + 1}, ${100 / (rows + 1)}%)`,
      gridTemplateColumns: `repeat(${columns + 1}, ${100 / (columns + 1)}%)`,
    };
  }, [columns, rows]);

  return (
    <div className={classes.root} style={style}>      
      <canvas
        className={classes.canvas}
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}  
      />
      {_nodes}
    </div>
  );
};

export default withStyles(styles)(ConnectionGraph);