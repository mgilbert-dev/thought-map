import React, { FC, useMemo, useState, FormEvent } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { AppState } from '../../../reducers';
import { useModalDynamicState } from '../../../hooks/useModal';
import { openConfirmation } from '../../../lib/util';
import Input from '../../General/Input';
import { settings as settingsActions, statuses as statusActions, thoughts as thoughtActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Status } from '../../../store/rxdb/schemas/status';
import Delete from '@material-ui/icons/Delete';

interface CustomStatusesProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
  },
  inputLabel: {

  },
  customStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customStatusText: {

  },
  deleteCustomStatus: {
    color: theme.palette.red[500],
  },
});

export const CustomStatuses: FC<CustomStatusesProps> = ({ classes, onClose }) => {
  const state: AppState = useModalDynamicState();
  const [inputtedValue, setInputtedValue] = useState<string>('');
  const db = useLoadedDB();
  const customStatuses = useMemo(() => {
    return Array.isArray(state.settings.customStatuses) ? state.settings.customStatuses : [];
  }, [state.settings]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputtedValue('');
    const next = customStatuses.concat(inputtedValue);
    settingsActions.createSetting(db, {
      field: 'customStatuses',
      value: next,
    });
  };

  const deleteCustomStatus = (value: string) => async () => {
    const next = customStatuses.filter(prev => prev !== value);
    const deleteCustomStatus = () => {
      settingsActions.createSetting(db, {
        field: 'customStatuses',
        value: next,
      });
    };
    const allStatuses = await statusActions.getStatuses(db);
    const badStatuses = allStatuses.filter(status => status.text === value);
    if (badStatuses.length > 0) {
      const confirmAndDelete = async () => {
        const thoughtsToDecrement = [...new Set(badStatuses.map(({ thoughtId }) => thoughtId))]
          .map(thoughtId => state.thoughts.find(thought => thought.id === thoughtId));
        const convertThought = async (thought: Thought) => {
          return thoughtActions.editThought(db, {
            ...thought,
            status: 'new',
          });
        };
        const deleteStatus = async (status: Status) => {
          return statusActions.deleteStatus(db, status.id);
        };

        await Promise.all(thoughtsToDecrement.map(convertThought));
        await Promise.all(badStatuses.map(deleteStatus));
        deleteCustomStatus();
      };
      openConfirmation('This status is associated with one or more thoughts. Deleting it will alter the history of these thoughts and automatically set the status to \'new\'', confirmAndDelete);
    } else {
      deleteCustomStatus();
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Input
          classes={classes}
          value={inputtedValue}
          onChange={e => setInputtedValue(e.target.value)}
        />
        <button>Create</button>
      </form>
      {customStatuses.map(status => {
        return (
          <div key={status} className={classes.customStatus}>
            <span className={classes.customStatusText}>{status}</span>
            <button className={classes.deleteCustomStatus} onClick={deleteCustomStatus(status)}><Delete/></button>
          </div>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CustomStatuses);
