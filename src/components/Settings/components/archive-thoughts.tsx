import React, { FC, useRef } from 'react';
import { Thought } from 'store/rxdb/schemas/thought';
import { thoughts as thoughtActions } from '../../../actions';
import cn from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import useLoadingOverlay from 'react-use-loading-overlay';
import { Plan } from '../../../store/rxdb/schemas/plan';

export interface ArchiveThoughtsProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
}

export const ArchiveThoughts: FC<ArchiveThoughtsProps> = ({
  classes,
  thoughts,
  plan,
}) => {
  const { db } = useLoadedDB();
  const rootRef = useRef<HTMLDivElement>(null);
  const { setLoading, stopLoading } = useLoadingOverlay(rootRef);

  const handleClickArchiveNew = async () => {
    setLoading('Archiving thoughts...');
    await Promise.all(thoughts
      .filter(({ status, planId }) => planId === plan.id && status === 'new')
      .map(thought => thoughtActions.editThought(db, {
        ...thought,
        archived: true,
      })));
    stopLoading();
  };

  const handleClickArchiveCompleted = async () => {
    setLoading('Archiving thoughts...');
    await Promise.all(thoughts
      .filter(({ status, planId }) => planId === plan.id && status === 'completed')
      .map(thought => thoughtActions.editThought(db, {
        ...thought,
        archived: true,
      })));
    stopLoading();
  };

  return (
    <div ref={rootRef} className={classes.archiveThoughts}>
      <h3 className={classes.archiveThoughtsHeader}>
                Archive Thoughts
      </h3>
      <button
        className={cn(classes.archiveThoughtsButton, 'new')}
        onClick={handleClickArchiveNew}
      >
                New
      </button>
      <button
        className={cn(classes.archiveThoughtsButton, 'completed')}
        onClick={handleClickArchiveCompleted}
      >
                Completed
      </button>
    </div>
  );
};

export default ArchiveThoughts;
