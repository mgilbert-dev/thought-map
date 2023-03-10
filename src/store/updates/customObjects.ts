import { CustomObject } from '../../store/rxdb/schemas/customObject';
import { insert, remove, update } from '../../reducers/customObjects';
import { Notification, RxChangeEvent } from '../../types';
import { AppDispatch } from '../../store';

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export const handleCustomObjectChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, previousDocumentData }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const customObject: CustomObject = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(customObject));
      notification = { message: `${capitalize(customObject.type)} created` };
      break;
    
    case 'DELETE':
      dispatch(remove(previousDocumentData));
      notification = { message: `${capitalize(customObject.type)} removed` };
      break;

    case 'UPDATE':
      dispatch(update(customObject));
      notification = { message: `${capitalize(customObject.type)} updated` };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
