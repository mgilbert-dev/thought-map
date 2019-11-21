import React, { useMemo, useCallback, useState, useRef, FC } from 'react';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import { withStyles } from '@material-ui/core/styles';
import Home from '@material-ui/icons/Home';
import Settings from '@material-ui/icons/Settings';
import { thoughtHomeStyles } from './styles';
import Loading from '../Loading';
import ThoughtInformation from './ThoughtInformation';
import ThoughtSettings from '../ThoughtSettings';
import CircleButton from '../General/CircleButton';
import { thoughts as thoughtActions, plans as planActions } from '../../actions';
import { openConfirmation, homeUrl, getIdFromUrl } from '../../lib/util';
import { Picture } from '../../store/rxdb/schemas/picture';
import { Thought as ThoughtType } from '~store/rxdb/schemas/types';
import { SectionVisibility } from './types';
import { useLoadingOverlay } from '../../hooks/useLoadingOverlay';
import { thoughtSelector } from '../../reducers/thoughts';
import { tagSelector } from '../../reducers/tags';
import { noteSelector } from '../../reducers/notes';
import { connectionSelector } from '../../reducers/connections';
import { planSelector } from '../../reducers/plans';
import { statusesByThoughtSelector } from '../../reducers/statusesByThought';
import { statusSelector } from '../../reducers/statuses';
import { pictureSelector } from '../../reducers/pictures';
import { settingSelector } from '../../reducers/settings';
import { useSelector } from 'react-redux';

export interface PriorityOption {
  value: number;
  label: string;
}

export interface ConnectionSummary {
  isParent: boolean;
  otherThought: ThoughtType;
  connectionId: string;
}

interface ThoughtProps {
  classes: any;
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 0, label: 'NOT RELEVANT (HIDE)' },
  { value: 1, label: 'LOW (1)' },
  { value: 2, label: 'LOW (2)' },
  { value: 3, label: 'LOW (3)' },
  { value: 4, label: 'LOW (4)' },
  { value: 5, label: 'MEDIUM (5)' },
  { value: 6, label: 'MEDIUM (6)' },
  { value: 7, label: 'MEDIUM (7)' },
  { value: 8, label: 'HIGH (8)' },
  { value: 9, label: 'HIGH (9)' },
  { value: 10, label: 'HIGH (10)' },
];

const SECTION_DELIMITER_REGEX = /^_/;

export const DEFAULT_SECTIONS = 'type-status-priority-description-datetime-notes-recurring-tags-connections-pictures';

export const Thought: FC<ThoughtProps> = ({ classes, statusOptions, typeOptions, tagOptions }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [setLoading, stopLoading, updateLoading] = useLoadingOverlay(rootRef);
  const db = useLoadedDB();
  const { history } = useApp();
  const settingsGearButtonSVGRef = useRef<HTMLElement>(null);
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const [editAllSections, setEditAllSections] = useState<boolean>(false);
  const thoughtId = getIdFromUrl(history, 'thought');
  const thoughts = useSelector(thoughtSelector);
  const tags = useSelector(tagSelector);
  const notes = useSelector(noteSelector);
  const connections = useSelector(connectionSelector);
  const plans = useSelector(planSelector);
  const statusesByThought = useSelector(statusesByThoughtSelector);
  const statuses = useSelector(statusSelector);
  const pictures = useSelector(pictureSelector);
  const settings = useSelector(settingSelector);


  const thought = useMemo(() => thoughts.find(thought => thought.id === thoughtId), [thoughtId, thoughts]);
  const relatedTags = useMemo(() => Object.values(tags).filter(tag => tag.thoughtId === thoughtId), [thoughtId, tags]);
  const relatedNotes = useMemo(() => Object.values(notes).filter(note => note.thoughtId === thoughtId), [thoughtId, notes]);
  const relatedConnections: ConnectionSummary[] = useMemo(() =>
    Object.values(connections)
      .filter(({ to, from }) => {
        return to === thoughtId || from === thoughtId;
      })
      .map(({ id, to, from }) => {
        const otherThought = thoughts.find(({ id: otherThoughtId }) => otherThoughtId !== thoughtId && (otherThoughtId === to || otherThoughtId === from));
        return {
          isParent: otherThought.id === to,
          otherThought,
          connectionId: id,
        };
      })
  , [thoughtId, connections, thoughts]);

  const plan = useMemo(() => {
    return plans.find(({ id}) => thought && id === thought.planId);
  }, [plans, thought]);

  const thoughtSections = thought && thought.sections ?
    thought.sections :
      plan && plan.defaultSections ?
        plan.defaultSections :
        DEFAULT_SECTIONS;

  const thoughtStatuses = useMemo(() => {    
    if (typeof thoughtId === 'string') {
      return (statusesByThought[thoughtId] || [])
        .map(statusId => statuses[statusId])
        .filter(Boolean);
    }
    return [];
  }, [statuses, statusesByThought, thoughtId]);

  const pinnedPictures: Picture[] = useMemo(() => {
    return Object.values(pictures).filter(picture => {
      return picture.pinned && picture.thoughtId === thoughtId;
    });
  }, [thoughtId, pictures]);

  const handleClickHome = (): void => {
    history.push(`${homeUrl(history)}?from=${thoughtId}`);
  };

  const handleUpdate = useCallback(async updatedThought => {
    await thoughtActions.editThought(db, updatedThought);
  }, []);

  const handleClickDelete = useCallback(() => {
    if (typeof thoughtId === 'string') {
      const onConfirm = async () => {        
        setLoading('Deleting thought');
        await thoughtActions.deleteThought(db, thoughtId);
        updateLoading('Thought deleted');
        history.push(homeUrl(history));
      };
  
      openConfirmation('Are you sure you want to delete this?', onConfirm);
    }
  }, [thoughtId]);

  const handleClickSettings = useCallback(() => {
    setDisplaySettings(prev => !prev);
    if (!displaySettings) {
      gearOpening(settingsGearButtonSVGRef.current);
    } else {
      gearClosing(settingsGearButtonSVGRef.current);
    }
  }, [thoughtId, displaySettings]);

  const handleEditAllSections = useCallback(() => {
    setDisplaySettings(false);
    setEditAllSections(true);
  }, []);  

  const handleCancelEditAllSections = useCallback(() => {
    setEditAllSections(false);
  }, []);

  const handleApplySectionState = useCallback(() => {
    planActions.editPlan(db, {
      ...plan,
      defaultSections: thought.sections,
    });
  }, [plan, thought]);

  const handleChangeHideFromHomeScreen = useCallback(checked => {
    handleUpdate({
      ...thought,
      hideFromHomeScreen: checked,
    });
  }, [thought]);

  const sectionOrder = useMemo(() => {
    return thoughtSections.split('-').map(section => {
      return section.replace(SECTION_DELIMITER_REGEX, '');
    });
  }, [thoughtSections]);

  const sectionVisibility = useMemo(() => {
    return thoughtSections.split('-').reduce((visibility, section) => {
      
      if (section.startsWith('_')) {
        visibility[section.replace(SECTION_DELIMITER_REGEX, '')] = false;
      } else {
        visibility[section] = true;
      }
      return visibility;
    }, {} as SectionVisibility);
  }, [thoughtSections]);

  return (
    <div ref={rootRef} className={classes.root}>
      {!thought &&
        <Loading id={'thought-loader'}/>}
      {thought && 
        <ThoughtInformation
          thought={thought}
          tags={relatedTags}
          notes={relatedNotes}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          tagOptions={tagOptions}
          priorityOptions={PRIORITY_OPTIONS}
          onUpdate={handleUpdate}
          statuses={thoughtStatuses}
          pinnedPictures={pinnedPictures}
          connections={relatedConnections}
          plan={plan}
          sectionOrder={sectionOrder}
          sectionVisibility={sectionVisibility}
          cancelEditAllSections={handleCancelEditAllSections}
          editAllSections={editAllSections}
        />
      }
      <ThoughtSettings
        display={displaySettings}
        thought={thought}
        tags={relatedTags}
        notes={relatedNotes}
        onDelete={handleClickDelete}
        onEditSections={handleEditAllSections}
        onApplySectionState={handleApplySectionState}
        onChangeHideFromHomeScreen={handleChangeHideFromHomeScreen}
      />
      {!displaySettings && <CircleButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>}
      <CircleButton
        svgRef={settingsGearButtonSVGRef}
        classes={classes}
        id={'settings'}
        onClick={handleClickSettings}
        label={'Settings'}
        Icon={Settings}
      />
    </div>
  );
};

const gearOpening = (element: HTMLElement): void => {
  element.classList.add('gear-opening');
};

const gearClosing = (element: HTMLElement): void => {
  element.classList.remove('gear-opening');
}

export default withStyles(thoughtHomeStyles)(Thought);
