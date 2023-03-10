import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { stageSelector } from '../../reducers/stage';
import { thoughtSelector } from '../../reducers/thoughts';
import Wrapper from './Wrapper';
import { Thought } from '../../store/rxdb/schemas/types';
import { makeStyles } from '@material-ui/core';
import { useTypedSelector } from '../../reducers';

interface StageProps {

}

const useStyles = makeStyles((theme: any) => ({
  header: {
    fontSize: 24,
    paddingLeft: 20,
    flex: '0 0 70px',
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background[600],
    color: theme.palette.background[200],
  },
}));

const sortThoughtsWithIndex = (thoughts: Thought[]): Thought[] => {
  const thoughtsWithIndexes = thoughts.filter(({ stageIndex }) => stageIndex > 0)
    .sort((a, b) => {
      if (a.stageIndex < b.stageIndex) {
        return -1;
      }
      return 1;
    });
  const thoughtsWithoutIndexes = thoughts
    .filter(({ stageIndex }) => stageIndex === 0)
    .sort((a, b) => a.updated - b.updated);

  thoughtsWithIndexes.forEach(thought => {
    thoughtsWithoutIndexes.splice(thought.stageIndex - 1, 0, thought);
  });

  return thoughtsWithoutIndexes;
};

export const Stage: FC<StageProps> = () => {
  const stage = useSelector(stageSelector);
  const normalizedThoughts = useTypedSelector(thoughtSelector.selectEntities);
  const classes = useStyles();
  const [activeThoughts, backlogThoughts] = useMemo(() => {
    if (Object.keys(normalizedThoughts)?.length > 0) {
      return [
        sortThoughtsWithIndex(stage.current.map(id => normalizedThoughts[id])),
        sortThoughtsWithIndex(stage.backlog.map(id => normalizedThoughts[id])),
      ];
    } else {
      return [];
    }
  }, [stage, normalizedThoughts]);

  if (!activeThoughts || !backlogThoughts) {
    return <div style={{ height: '100%' }}/>;
  }

  return (
    <>
      <h1 className={classes.header}>Stage</h1>
      <Wrapper
        activeThoughts={activeThoughts}
        backlogThoughts={backlogThoughts}
      />
    </>
  );
};

export default Stage;
