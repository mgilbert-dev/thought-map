import { Dispatch } from '@reduxjs/toolkit';
import { Settings as SettingsType, setSettings } from '../reducers/settings';
import { Thoughts as ThoughtsType, setThoughts } from '../reducers/thoughts'; 
import { Connections as ConnectionsType, setConnections } from '../reducers/connections'; 
import { Notes as NotesType, setNotes } from '../reducers/notes'; 
import { Tags as TagsType, setTags } from '../reducers/tags'; 
import { Plans as PlansType, setPlans } from '../reducers/plans'; 
import { Templates as TemplatesType, setTemplates } from '../reducers/templates'; 
import { Pictures as PicturesType, setPictures } from '../reducers/pictures';
import { Statuses as StatusesType, setStatuses } from '../reducers/statuses';
import { StatusesByThought as StatusesByThoughtType, setStatusesByThought } from '../reducers/statusesByThought';
import { intoMap } from '../lib/util';
import { RxDatabase } from 'rxdb';
import {
  thoughts as thoughtActions,
  plans as planActions,
  connections as connectionActions,
  notes as noteActions,
  tags as tagActions,
  templates as templateActions,
  pictures as pictureActions,
  settings as settingActions,
  statuses as statusActions,
} from '../actions';

export const initializeApplication = async (db: RxDatabase, dispatch: Dispatch<any>) => {
  const setSettingsAction = (settings: SettingsType) => dispatch(setSettings(settings));
  const setThoughtsAction = (thoughts: ThoughtsType) => dispatch(setThoughts(thoughts));
  const setConnectionsAction = (connections: ConnectionsType) => dispatch(setConnections(connections));
  const setNotesAction = (notes: NotesType) => dispatch(setNotes(notes));
  const setTagsAction = (tags: TagsType) => dispatch(setTags(tags));
  const setPlansAction = (plans: PlansType) => dispatch(setPlans(plans));
  const setTemplatesAction = (templates: TemplatesType) => dispatch(setTemplates(templates));
  const setPicturesAction = (pictures: PicturesType) => dispatch(setPictures(pictures));
  const setStatusesAction = (statuses: StatusesType) => dispatch(setStatuses(statuses));
  const setStatusesByThoughtAction = (statusesByThought: StatusesByThoughtType) => dispatch(setStatusesByThought(statusesByThought));

  const [ thoughts, connections, plans, notes, tags, templates, pictures, settings, statuses ] = await Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    templateActions.getTemplates(db),
    pictureActions.getPictures(db),
    settingActions.getSettings(db),
    statusActions.getStatuses(db),
  ]);
  
  const statusesById = intoMap(statuses);
  const notesById = intoMap(notes);
  const tagsById = intoMap(tags);
  const picturesById = intoMap(pictures);
  const connectionsById = intoMap(connections);
  const statusesByThought = statuses.reduce((next, { id, thoughtId }) => {
    next[thoughtId] = next[thoughtId] || [];
    next[thoughtId].push(id);
    return next;
  }, {} as StatusesByThoughtType)

  const settingsMap = settings.reduce((next, { field, value }) => {
    next[field] = value;
    return next;
  }, {} as SettingsType);

  const thoughtsWithStatuses = thoughts.map(thought => {
    const statusIds = statusesByThought[thought.id];
    if (statusIds) {
      const statuses = statusIds.map(id => statusesById[id]);
      const sortedStatuses = statuses.sort((left, right) => right.created - left.created);
      const latestStatus = sortedStatuses[0];
  
      return {
        ...thought,
        status: latestStatus.text,
      };
    }
    return thought;
  });
  
  setThoughtsAction(thoughtsWithStatuses);
  setConnectionsAction(connectionsById);
  setPlansAction(plans);
  setNotesAction(notesById);
  setTagsAction(tagsById);
  setTemplatesAction(templates);
  setPicturesAction(picturesById);
  setSettingsAction(settingsMap);
  setStatusesAction(statusesById);
  setStatusesByThoughtAction(statusesByThought);

  return true;
};

export default initializeApplication;
