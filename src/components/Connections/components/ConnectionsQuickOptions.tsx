import React, { FC, useState } from 'react';
import { StyleRules, withStyles } from '@material-ui/styles';
import ConnectionsModal from '../../Thought/components/sections/ConnectionsSection/components/ConnectionsModal';
import StatusesModal from './StatusesModal';
import VisibilityModal from './VisibilityModal';
import LocationModal from './LocationModal';
import { thoughtSelector } from '../../../reducers/thoughts';
import classNames from 'classnames';
import { useTypedSelector } from '../../../reducers';

interface ConnectionsQuickOptionsProps {
  classes: any,
  onClose: () => void;
  thoughtId: string;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  root: {
    overflow: 'hidden',
    height: 500,
    display: 'grid',
    gridTemplateAreas: `"header"
                        "nav-items"
                        "content"`,
    gridTemplateRows: 'max-content max-content 1fr',
    gridTemplateColumns: '1fr',
    gridRowGap: '10px',
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    gridArea: 'header',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    justifyContent: 'center',
    flex: 1,
    gridArea: 'content',
  },
  navItems: () => ({
    display: 'flex',
    overflow: 'auto',
    borderBottom: `1px solid ${theme.palette.secondary[500]}`,
    gridArea: 'nav-items',
  }),
  navItem: () => ({
    color: theme.palette.background[400],
    fontWeight: 600,
    display: 'flex',
    '&:not(:first-child)': {
      paddingLeft: 15,
      borderLeft: `1px solid ${theme.palette.background[900]}`,
    },
    '&:not(:last-child)': {
      paddingRight: 15,
    },
    '&.active': {
      color: theme.palette.secondary[500],
    },
  }),
  navButton: {
    color: 'inherit',
  },
});

enum ViewOptions {
  Connections = 'Connections',
  Statuses = 'Status',
  Visibility = 'Visibility',
  Location = 'Location',
}

export const ConnectionsQuickOptions: FC<ConnectionsQuickOptionsProps> = ({ classes, onClose, thoughtId, statusOptions }) => {
  const [currentView, setCurrentView] = useState<ViewOptions>(ViewOptions.Connections);
  const thought = useTypedSelector(state => thoughtSelector.selectById(state, thoughtId));

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>{thought.title}</h1>
      <ul className={classes.navItems}>
        {[ViewOptions.Connections, ViewOptions.Statuses, ViewOptions.Visibility, ViewOptions.Location].map(option => {
          return (
            <li key={option} className={classNames(classes.navItem, {
              active: currentView === option,
            })}>
              <button
                className={classes.navButton}
                onClick={() => setCurrentView(option)}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
      <section className={classes.modalContent}>
        {currentView === ViewOptions.Connections && <ConnectionsModal
          onClose={onClose}
          thoughtId={thoughtId}
          autoFocus={false}
        />}
        {currentView === ViewOptions.Statuses && <StatusesModal
          onClose={onClose}
          thought={thought}
          statusOptions={statusOptions}
        />}
        {currentView === ViewOptions.Visibility && <VisibilityModal
          onClose={onClose}
          thought={thought}
        />}
        {currentView === ViewOptions.Location && <LocationModal
          onClose={onClose}
          thought={thought}
        />}
      </section>
    </div>
  );
};

export default withStyles(styles)(ConnectionsQuickOptions);
