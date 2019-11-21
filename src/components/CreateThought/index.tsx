import React, { useState, FC, FormEventHandler, Fragment } from 'react';
import useApp from '../../hooks/useApp';
import { CloseModal } from '../../hooks/useModal/types';
import { useLoadedDB } from '../../hooks/useDB';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './style';
import Inputs from './Inputs';
import { createWholeThought } from '../../actions/complex';
import { homeUrl, getIdFromUrl } from '../../lib/util';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';

export interface CreatedThought {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  notes: string[];
  tags: string[];
  tagOptions: string[];
}

const DEFAULT_STATE: CreatedThought = {
  title: '',
  type: 'Task',
  date: '',
  time: '',
  description: '',
  notes: [],
  tags: [],
  tagOptions: [],
};

interface CreateThoughtProps {
  classes: any;
  typeOptions: string[];
  onClose: CloseModal;
}

export const CreateThought: FC<CreateThoughtProps> = ({ classes, typeOptions, onClose }) => {
  const { history } = useApp();
  const thoughts = useSelector(thoughtSelector);
  const [ready, setReady] = useState<boolean>(false);
  const [createdThought, setCreatedThought] = useState<CreatedThought>(DEFAULT_STATE);
  const db = useLoadedDB();
  const planId = getIdFromUrl(history, 'plan');
  const thoughtTitles = thoughts.map(({ title }) => title);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (ready) {
      const response = await createWholeThought(db, createdThought, planId);
      onClose();
      history.push(`${homeUrl(history)}thought/${response.thought.id}`);
    }
  };
  
  return (
    <Fragment>
      <form className={classNames(classes.form)} onSubmit={handleSubmit}>
        <Inputs
          classes={classes}
          createdThought={createdThought}
          setCreatedThought={setCreatedThought}
          typeOptions={typeOptions}
          onReady={setReady}
          thoughtTitles={thoughtTitles}
        />
        <button className={classes.submitButton} disabled={!ready}>
          Submit
        </button>
      </form>      
    </Fragment>
  );
};

export default withStyles(styles)(CreateThought);
