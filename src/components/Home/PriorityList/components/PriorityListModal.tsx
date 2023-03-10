import React, { FC, useMemo } from 'react';
import PriorityList from './PriorityList';
import { differenceInDays, differenceInHours } from 'date-fns';
import { Thought } from 'store/rxdb/schemas/thought';

interface PriorityListModalProps {
  classes: any;
  thoughts: Thought[];
  onMinimize?: () => void;
  onClose?: () => void;
}

export const PriorityListModal: FC<PriorityListModalProps> = ({ classes, thoughts, onMinimize }) => {
  const priorityThoughts = useMemo(() => {
    const thoughtsWithPriority = thoughts.map(assignThoughtPriority);

    return thoughtsWithPriority
      .sort((a, b) => a.priority > b.priority ? -1 : 1)
      .slice(0, 10)
      .map(({ thought }) => thought);
  }, [thoughts]);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Priorities</h1>
      {priorityThoughts.length > 0 ?
        (<PriorityList classes={classes} thoughts={priorityThoughts} onMinimize={onMinimize}/>) :
        (<span>
          You are all caught up on priorities. Congratulations!
        </span>)
      }
    </div>
  );
};

const assignThoughtPriority = (thought: Thought): { thought: Thought, priority: number} => {
  const dateModifier = getDateModifier(thought);
  const priorityModifier = getPriorityModifier(thought);
  const lastUpdatedModifier = getLastUpdatedModifier(thought);
  const statusModifier = getStatusModifier(thought);
  const typeModifier = getTypeModifier(thought);
  const goalModifier = getGoalModifier(thought);

  return {
    priority: dateModifier + priorityModifier + lastUpdatedModifier + statusModifier + typeModifier + goalModifier,
    thought,
  };
};

const getDateModifier = ({ date }: { date?: string }) => {
  if (!date) return 0;

  const daysDiff = differenceInDays(new Date(date), new Date());

  if (daysDiff < 0) return 20;
  if (daysDiff < 1) return 15;
  if (daysDiff < 3) return 8;
  if (daysDiff < 5) return 5;
  return 1;
};

const getPriorityModifier = ({ priority }: { priority?: number }) => {
  return priority || -1000;
};

const getLastUpdatedModifier = ({ updated }: { updated?: number }) => {
  const hoursDiff = differenceInHours(new Date(), new Date(updated));

  if (hoursDiff < 1) return 3;
  if (hoursDiff < 24) return 2;
  if (hoursDiff < 48) return 1;
  return 0;
};

const getStatusModifier = ({ status }: { status?: string }): number => {
  switch (status) {
    case 'new':
      return 1;
    case 'in progress':
      return 2;
    case 'won\'t fix':
      return -1000;
    case 'completed':
      return -1000;
    default:
      return 0;
  }
};

const getTypeModifier = ({ type = '' }: { type?: string }) => {
  switch (type.toLowerCase()) {
    case 'reminder':
      return 3;
    case 'todo':
      return 2;
    case 'task':
      return 1;
    default:
      return 0;
  }
};

const getGoalModifier = ({ goalPoints = 0}): number => {

  return Math.min(10, goalPoints);
};

export default PriorityListModal;
