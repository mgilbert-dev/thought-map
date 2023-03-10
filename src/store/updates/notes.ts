import { Note } from '../../store/rxdb/schemas/note';
import { insert, remove, update } from '../../reducers/notes';
import { Notification, RxChangeEvent } from '../../types';
import { searcherWorker } from '../init';
import { AppDispatch } from '../../store';

export const handleNoteChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const note: Note = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(note));
      searcherWorker.buildTree(null,{ [note.id]: note }, null);
      notification = { message: 'Note created' };
      break;
    
    case 'DELETE':
      dispatch(remove(documentId));
      searcherWorker.invalidate(documentId);
      notification = { message: 'Note removed' };
      break;

    case 'UPDATE':
      dispatch(update(note));
      searcherWorker.invalidate(note.id).then(() => {
        searcherWorker.buildTree(null,{ [note.id]: note }, null);
      });
      notification = { message: 'Note updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
