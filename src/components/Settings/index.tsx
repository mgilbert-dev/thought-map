import React, { FC, useCallback, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import { useIdFromUrl, useSearchParam } from '../../lib/util';
import NavBar from './components/nav-bar';
import PlanSettings from './components/plan-settings';
import AppSettings from './components/app-settings';
import { rootStyles } from './styles';
import { useSelector } from 'react-redux';
import { planSelector } from '../../reducers/plans';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';
import { useTypedSelector } from '../../reducers';

interface SettingsProps {
  classes: any;
  typeOptions: string[];
  setLastNotification: (notification: { message: string }) => void;
}

interface NavBarItem {
  value: string;
  current: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const Settings: FC<SettingsProps> = ({ classes, typeOptions, setLastNotification }) => {
  const navigate = useNavigate();
  const planId = useIdFromUrl('plan');
  const type = useSearchParam('type');

  const plans = useSelector(planSelector);
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  const connections = useSelector(connectionSelector);

  const plan = useMemo(() => plans.find(({ id }) => id === planId), [plans, planId]);
  const handleClick = useCallback(type => () => {
    navigate(`?type=${type}`);
  }, []);

  const items = useMemo(() => {
    const returnValue: NavBarItem[] = [{
      value: 'App',
      current: type !== 'plan',
      onClick: handleClick('app'),
      disabled: !planId,
    }];
    if (planId) returnValue.unshift({
      value: 'Plan',
      current: type === 'plan',
      onClick: handleClick('plan'),
    });
  
    return returnValue;
  }, [planId, type]);

  return (
    <div className={classes.root}>
      <NavBar
        items={items}
      />
      {type === 'plan' ? (
        plan ? 
          <PlanSettings
            plan={plan}
            thoughts={thoughts}
            typeOptions={typeOptions}
            connections={connections}
          /> :
          <Loading id={'thought-loader'}/>
      ) : (
        <AppSettings setLastNotification={setLastNotification}/>
      )}
    </div>
  );
};

export default withStyles(rootStyles)(Settings);
