import './style.scss';
import React, { FC, Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Plan } from '../../../store/rxdb/schemas/plan';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Graph } from './lib/graph';
import { ThoughtConnections } from './types';
import { useLoadedDB } from '../../../hooks/useDB';
import useModal from '../../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { settings as settingsActions } from '../../../actions';
import { settingSelector } from '../../../reducers/settings';
import { connectionSelector } from '../../../reducers/connections';
import { ButtonPositions, emphasizeButton } from '../../../reducers/tutorial';
import { planSelector } from '../../../reducers/plans';
import { sortFilterSettingsSelector } from '../../../reducers/sortFilterSettings';
import { searcherWorker } from '../../../store/init';
import FilterAndSearch from './FilterAndSearch';
import ThoughtNodes from './ThoughtNodes';
import PriorityTutorial from '../../Tutorials/PriorityTutorial';
import LongPressTutorial from '../../Tutorials/LongPressTutorial';
import BlankThoughtNode from './BlankThoughtNode';
import { intoMap } from '../../../lib/util';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
  statusOptions: string[];
  typeOptions: string[];
  from: string;
}

export const Content: FC<ContentProps> = ({ classes, thoughts, plan, statusOptions, typeOptions, from }) => {
  const dispatch = useDispatch();
  const thoughtMap = useRef<Graph>(new Graph());
  const { db } = useLoadedDB();
  const [openModal] = useModal();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<string[]>(null);
  const stateConnections = useSelector(connectionSelector);
  const plans = useSelector(planSelector);
  const settings = useSelector(settingSelector);
  const sortFilterSettings = useSelector(sortFilterSettingsSelector);
  
  const connectionStatusByThought = useMemo(() => {
    thoughtMap.current
      .updateThoughts(thoughts)
      .updateConnections(Object.values(stateConnections));
    const normalizedThoughts = intoMap(thoughts);
    return Object.values(stateConnections).reduce((next, { from, to }) => {
      const fromThought = normalizedThoughts[from];
      const toThought = normalizedThoughts[to];
      if (fromThought && toThought) {
        next[from] = next[from] || [0, 0];
        next[from][1]++;
        if (toThought.status === 'completed') next[from][0]++;
      }
      return next;
    }, {} as ThoughtConnections);
  }, [stateConnections, thoughts]);

  useEffect(() => {
    const runSearch = async () => {
      const matches = await searcherWorker.findMatches(searchTerm);

      setMatchingThoughts(matches);
    };

    if (searchTerm?.length > 2) {
      runSearch();
    } else if (searchTerm?.length === 0) {
      setMatchingThoughts(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (thoughts.length === 0) {
      dispatch(emphasizeButton(ButtonPositions.Right));

      return () => {
        dispatch(emphasizeButton(null));
      };
    }
  }, [thoughts.length]);
  
  useEffect(() => {
    if (settings.didInit === true && settings.disableTips !== true) {
      if (
        thoughts.length > 0 &&
        settings.learnedLongPress !== true
      ) {
        dispatch(emphasizeButton(ButtonPositions.LeftAlt));
        openModal(<LongPressTutorial />, 'About Long Press', {
          afterClose: () => {
            settingsActions.createSetting(db, {
              field: 'learnedLongPress',
              value: true,
            });
          }
        });
      } else if (
        thoughts.length > 3 &&
        settings.learnedPriorityList !== true
      ) {
        dispatch(emphasizeButton(ButtonPositions.MiddleAlt));
        openModal(<PriorityTutorial />, 'About Priority', {
          afterClose: () => {
            settingsActions.createSetting(db, {
              field: 'learnedPriorityList',
              value: true,
            });
          }
        });
      }
    }
  }, [settings.didInit]);

  return (
    <Fragment>
      <FilterAndSearch
        classes={classes}
        searchTerm={searchTerm}
        sortFilterSettings={sortFilterSettings}
        setSearchTerm={setSearchTerm}
      />
      {thoughts.length === 0 ? (
        <div className={classes.content}>
          {new Array(10).fill(null).map((_, idx) => {
            return (
              <BlankThoughtNode
                key={`${idx}-blank-thought`}
              />
            );
          })
          }
        </div>
      ) : (
        <ThoughtNodes
          classes={classes}
          thoughts={thoughts}
          matchingThoughts={matchingThoughts}
          plan={plan}
          thoughtMap={thoughtMap}
          sortFilterSettings={sortFilterSettings}
          plans={plans}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          from={from}
          connectionStatusByThought={connectionStatusByThought}
        />
      )}
    </Fragment>
  );
};

export default memo(Content);
