import React, { ChangeEventHandler, FC, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles'; 
import CircleButton from '../../General/CircleButton';
import Input from '../../General/Input';
import CheckBox from '../../General/CheckBox';
import Select from '../../General/Select';
import Check from '@material-ui/icons/Check';
import Create from '@material-ui/icons/Create';
import DeletePlan from './delete-plan';
import ArchiveThoughts from './archive-thoughts';
import { useNavigate } from 'react-router-dom';
import { useLoadedDB } from '../../../hooks/useDB';
import { plans as planActions, thoughts as thoughtActions } from '../../../actions';
import { planSettingsStyles } from '../styles';
import { Plan } from 'store/rxdb/schemas/plan';
import { Thought } from 'store/rxdb/schemas/thought';
import { Connection } from 'store/rxdb/schemas/connection';

interface PlanSettingsProps {
  classes: any;
  plan: Plan;
  thoughts: Thought[];
  typeOptions: string[];
  connections: {
    [connectionId: string]: Connection
  }
}

interface AddOrRemovableThoughts {
  id?: string;
  label: string;
}

export const PlanSettings: FC<PlanSettingsProps> = ({ classes, plan, thoughts, typeOptions, connections }) => {
  const navigate = useNavigate();
  const { db } = useLoadedDB();
  const [inputtedName, setInputtedName] = useState<string>(plan.name);
  const [hasChange, setHasChange] = useState<boolean>(false);
  const canAddThoughts: AddOrRemovableThoughts[] = useMemo(() => {
    return [{ label: 'Add Planless Thought' }].concat(
      thoughts
        .filter(thought => !thought.planId)
        .map((thought, idx) => ({id: thought.id, label: `${idx + 1} - ${thought.title}`}))
    );
  }, [thoughts, plan]);
  const canRemoveThoughts: AddOrRemovableThoughts[] = useMemo(() => {
    return [{ label: 'Remove Thought from Plan' }].concat(thoughts.filter(thought => {
      return thought.planId === plan.id;
    })
      .map((thought, idx) => ({id: thought.id, label: `${idx + 1} - ${thought.title}`})));
  }, [thoughts, plan]);

  const handleReturnHomeAfterDelete = () => navigate('/');

  const handleClickSubmitChanges = async () => {
    const editedPlan = Object.assign({}, plan, {
      name: inputtedName.trim(),
    });
    await planActions.editPlan(db, editedPlan);
    setHasChange(false);
  };

  const handleCheckArchive: ChangeEventHandler<HTMLInputElement> = e => {
    const editedPlan = Object.assign({}, plan, {
      archived: e.target.checked,
    });
    planActions.editPlan(db, editedPlan);
  };

  const handleCheckShowAll: ChangeEventHandler<HTMLInputElement> = e => {
    const editedPlan = Object.assign({}, plan, {
      showCompleted: e.target.checked,
    });
    planActions.editPlan(db, editedPlan);
  };

  const handleAddThought: ChangeEventHandler<HTMLSelectElement> = e => {
    const { value } = e.target;
    const [oneIndex] = value.split(' - ');
    const thoughtToAdd = canAddThoughts[Number(oneIndex)];
    const thought = thoughts.find(foundThought => foundThought.id === thoughtToAdd.id);
    const nextThought = Object.assign({}, thought, {
      planId: plan.id,
    });
    thoughtActions.editThought(db, nextThought);
  };

  const handleRemoveThought: ChangeEventHandler<HTMLSelectElement> = e => {
    const { value } = e.target;
    const [oneIndex] = value.split(' - ');
    const thoughtToRemove = canRemoveThoughts[Number(oneIndex)];
    const thought = thoughts.find(foundThought => foundThought.id === thoughtToRemove.id);
    const nextThought = Object.assign({}, thought, {
      planId: '',
    });
    thoughtActions.editThought(db, nextThought);
  };

  const handleSelectDefaultType: ChangeEventHandler<HTMLSelectElement> = async e => {
    const { value } = e.target;
    planActions.editPlan(db, {
      ...plan,
      defaultType: value,
    });
  };

  const handleInputName: ChangeEventHandler<HTMLInputElement> = e => {
    setHasChange(true);
    setInputtedName(e.target.value);
  };

  return (
    <article className={classes.root}>
      <Input
        id={'plan-name'}
        classes={classes}
        value={inputtedName}
        onChange={handleInputName}
        injectedComponent={<Create className={classes.editIcon} color={'primary'}/>}
      />
      <CheckBox
        id={'show-completed'}
        classes={classes}
        isChecked={Boolean(plan.showCompleted)}
        value={'Show Completed'}
        onChange={handleCheckShowAll}
        label={'Show Completed'}
      />
      <CheckBox
        id={'archive-plan'}
        classes={classes}
        isChecked={Boolean(plan.archived)}
        value={'Archive'}
        onChange={handleCheckArchive}
        label={'Archive'}
      />
      <Select
        id={'add-thoughts'}
        classes={classes}
        value={'Add Planless Thought'}
        options={canAddThoughts.map(({ label }) => label)}
        onChange={handleAddThought}
      />
      <Select
        id={'remove-thoughts'}
        classes={classes}
        value={'Remove Thought from Plan'}
        options={canRemoveThoughts.map(({ label }) => label)}
        onChange={handleRemoveThought}
      />
      <div className={classes.defaultType}>
        <span className={classes.defaultTypeHeader}>Default Type</span>
        <Select
          id={'default-type'}
          classes={classes}
          value={plan.defaultType || 'Select'}
          options={typeOptions}
          onChange={handleSelectDefaultType}
        />
      </div>
      <ArchiveThoughts
        classes={classes}
        thoughts={thoughts}
        plan={plan}
      />
      <DeletePlan
        classes={classes}
        plan={plan}
        thoughts={thoughts}
        afterDelete={handleReturnHomeAfterDelete}
        connections={connections}
      />
      {hasChange &&
          <CircleButton
            classes={classes}
            id={'submit-changes'}
            onClick={handleClickSubmitChanges}
            label={'Submit'}
            Icon={Check}
          />
      }
    </article>
  );
};

export default withStyles(planSettingsStyles)(PlanSettings);
