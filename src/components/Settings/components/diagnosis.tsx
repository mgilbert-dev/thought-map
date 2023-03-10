import React, { FC, Fragment, memo, useMemo, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Tooltip from '../../General/Tooltip';
import { useLoadedDB } from '../../../hooks/useDB';
import { useNavigate } from 'react-router-dom';
import {
  DiagnosisChunks,
  FormattedResultActionEnum,
  SolutionTypes,
} from '../types';

import Thought from '../../../models/thoughts';
import Connection from '../../../models/connections';
import Plan from '../../../models/plans';
import Note from '../../../models/notes';
import Tag from '../../../models/tags';
import Template from '../../../models/templates';
import Picture from '../../../models/pictures';
import Setting from '../../../models/settings';
import Status from '../../../models/statuses';
import { RxDatabase, RxDocument } from 'rxdb';
import useLoadingOverlay from 'react-use-loading-overlay';

const modelsByTable: {
  [tableName: string]: {
    delete: ((db: RxDatabase, id: string) => Promise<any>),
    update: ((db: RxDatabase, object: RxDocument<any>) => Promise<any>),
    add?: ((db: RxDatabase, object: RxDocument<any>) => Promise<any>),
  },
} = {
  thought: { delete: Thought.delete, update: Thought.update },
  connection: { delete: Connection.delete, update: Connection.update },
  plan: { delete: Plan.delete, update: Plan.update },
  note: { delete: Note.delete, update: Note.update },
  tag: { delete: Tag.delete, update: Tag.update },
  template: { delete: Template.delete, update: Template.update },
  picture: { delete: Picture.delete, update: Picture.update },
  setting: { delete: Setting.delete, update: Setting.update },
  status: { delete: Status.delete, update: Status.update, add: Status.add }
};

import { jsonDump } from './Data';

interface DiagnosisProps {
  diagnosisChunks: DiagnosisChunks;
  onFix: () => void;
}

const useStyles = makeStyles((theme: any) => ({
  root: {
    overflow: 'auto',
  },
  diagnosis: {

  },
  actionType: {
    fontWeight: 600,
    fontSize: 12,
    '&:not(:first-child)': {
      margin: '5px 0',
    }
  },
  action: () => ({
    border: `1px solid ${theme.palette.background[900]}`,
    padding: 4,
  }),
  title: () => ({
    color: theme.palette.background[800],
    fontWeight: 600,
    fontSize: 10,
  }),
  furtherDetails: () => ({
    fontSize: 10,
    color: theme.palette.background[700],
  }),
  affectedItems: {
    fontWeight: 600,
    fontSize: 10,
    margin: '4px 0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
  },
  table: () => ({
    border: `1px solid ${theme.palette.background[900]}`,
    backgroundColor: theme.palette.background[0],
    borderRadius: '3px',
    padding: '1px 3px',
    cursor: 'pointer',
  }),
  tooltip: () => ({
    justifyContent: 'center',
    overflow: 'auto',
    '& > svg': {
      color: theme.palette.secondary[700],
    },
  }),
  actionButtons: () => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
    '& > button': {
      backgroundColor: theme.palette.background[0],
      color: theme.palette.secondary[700],
      border: `1px solid ${theme.palette.secondary[700]}`,
      padding: '3px 15px',
      borderRadius: '5px',
    }
  }),
}));

const canFix = (diagnosisChunks: DiagnosisChunks) => {
  return Object.keys(diagnosisChunks).filter(key => key === FormattedResultActionEnum.CAN_FIX).length > 0;
};

export const Diagnosis: FC<DiagnosisProps> = ({ diagnosisChunks, onFix }) => {
  const { db } = useLoadedDB();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { setLoading, stopLoading, updateText } = useLoadingOverlay(containerRef);
  const classes = useStyles();
  const _diagnosis = useMemo(() => {
    if (Object.keys(diagnosisChunks).length === 0) {
      return (
        <div className={classes.diagnosis}>
          Congratulations! Your data is perfect.
        </div>
      );
    }

    const handleClickThought = (thought: any) => () => {
      if (!thought.thoughtId) {
        navigate(`/thought/${thought.id}`);
      }
    };

    return (
      <div className={classes.diagnosis}>
        {Object.entries(diagnosisChunks).map(([actionType, chunks], actionIdx) => {
          return (
            <Fragment key={`${actionIdx}-action`}>
              <h2 className={classes.actionType}>{actionType}</h2>
              <div className={classes.action}>
                {Object.entries(chunks).map(([title, { furtherDetails, items }], titleIdx) => {
                  return (
                    <Fragment key={`${titleIdx}-title`}>
                      <h3 className={classes.title}>{title}</h3>
                      {furtherDetails && <span className={classes.furtherDetails}>{furtherDetails}</span>}
                      <h4 className={classes.affectedItems}>Affected items</h4>
                      {items.map(({ item, table }, itemIdx) => {
                        return (
                          <div key={`${itemIdx}-item`} className={classes.item}>
                            <button className={classes.table} onClick={handleClickThought(item)}>{table}</button>
                            <Tooltip className={classes.tooltip} text={JSON.stringify(item)} />
                          </div>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
      </div>
    );
  }, [diagnosisChunks]);

  const handleClickFixIssues = async () => {
    if (!diagnosisChunks[FormattedResultActionEnum.CAN_FIX]) {
      onFix();
      return;
    }
    (window as any).blockNotifications = true;
    (window as any).blockDBSubscriptions = true;
    setLoading('Loading - 0%');
    const allQueries = Object.entries(diagnosisChunks[FormattedResultActionEnum.CAN_FIX]);
    
    for (const [key, { items }] of allQueries) {
      updateText(`${key} - 0%`);
      let count = 0;
      for (const { item, table, solution } of items) {
        switch (solution) {
          case SolutionTypes.DELETE:
            await modelsByTable[table].delete(db, item.id);
            break;
          case SolutionTypes.NULL_OUT_PLAN_ID:
            await modelsByTable[table].update(db, {
              ...item,
              planId: '',
            });
            break;
          case SolutionTypes.CREATE_STATUS:
            await modelsByTable.status.add(db, {
              text: 'new',
              thoughtId: item.id,
              created: item.created,
              updated: item.created,
            }).then(() => {
              if (item.status !== 'new') {
                return modelsByTable.status.add(db, {
                  text: item.status,
                  thoughtId: item.id,
                  created: item.updated,
                  updated: item.updated,
                });
              }
            });
            break;
        }
        count++;
        updateText(`${key} - ${Math.floor((count * 100)/ items.length)}%`);
      }
    }
      
    (window as any).blockNotifications = false;
    stopLoading();
    location.reload();
    onFix();
  };

  return (
    <div ref={containerRef} className={classes.root}>
      {_diagnosis}
      {canFix(diagnosisChunks) && (<div className={classes.actionButtons}>
        <button onClick={() => jsonDump(db)}>Backup data</button>
        <button onClick={handleClickFixIssues}>Fix issues</button>
      </div>)}
    </div>
  );
};

export default memo(Diagnosis);
