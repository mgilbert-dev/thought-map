import { Dispatch } from '@reduxjs/toolkit';
import { Plan } from '../../store/rxdb/schemas/plan';
import { insert, remove, update } from '../../reducers/plans';
import { Notification, RxChangeEvent } from '../../types';

export const handlePlanChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const plan: Plan = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(plan));
      notification = { message: 'Plan created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(plan));
      notification = { message: 'Plan removed' };
      break;

    case 'UPDATE':
      dispatch(update(plan));
      notification = { message: 'Plan updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
