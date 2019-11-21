import React, { useEffect, Fragment, FC, Dispatch } from 'react';
import Input from '../General/Input';
import Select from '../General/Select';
import { CreatedThought } from './';

interface InputsProps {
  classes: any;
  createdThought: CreatedThought;
  setCreatedThought: (setter: ((prev: CreatedThought) => CreatedThought)) => void;
  typeOptions: string[];
  onReady: (ready: boolean) => void;
  thoughtTitles: string[];
}

export const Inputs: FC<InputsProps> = React.memo(({
  classes,
  createdThought,
  setCreatedThought,
  typeOptions,
  thoughtTitles,
  onReady,
}) => {
  const setTitle = (value: string) => setCreatedThought(prev => ({
    ...prev,
    title: value,
  }));
  const setType = (value: string) => setCreatedThought(prev => ({
    ...prev,
    type: value,
  }));

  const isReady = validateInputs(createdThought.title);

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  return (
    <Fragment>
      <Input classes={classes} id={'title'} value={createdThought.title} onChange={e => setTitle(e.target.value)} autoSuggest={thoughtTitles} autoFocus/>
      <Select classes={classes} id={'type'} value={createdThought.type} options={typeOptions} onChange={e => setType(e.target.value)}/>
    </Fragment>
  );
});

export default Inputs;

const validateInputs = (title: string): boolean => {
  return title !== '';
};
