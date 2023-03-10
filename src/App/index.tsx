import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Notification as NotificationType } from '../types';
import { backupSelector } from '../reducers/backups';
import { ModalContextValue } from '../hooks/useModal/types';
import { ModalProvider } from '../hooks/useModal';
import { statusOptionsSelector } from '../reducers/statusOptions';
import { useAppStyles } from './style';
import { subscribeToChanges } from '../store/updates';
import { Route, Routes } from 'react-router-dom';
import { tagOptionsSelector } from '../reducers/tagOptions';
import { typeOptionsSelector } from '../reducers/typeOptions';
import { useDB } from '../hooks/useDB';
import { useDispatch, useSelector } from 'react-redux';
import Backups from '../components/Backups';
import Connections from '../components/Connections';
import Div100vh from 'react-div-100vh';
import History from '../components/History';
import Home from '../components/Home';
import initializeApplication from '../store/init';
import Merge from '../components/Merge';
import Notifications from '../components/Notifications';
import ProcessMerge from '../components/Merge/ProcessMerge';
import PrivacyPolicy from '../components/PrivacyPolicy';
import Settings from '../components/Settings';
import Stage from '../components/Stage';
import Timeline from '../components/Timeline';
import Thought from '../components/Thought';
import { checkVersionAndOpenModalIfUpdate } from './util';
import AppNav from './AppNav';
import Plans from '../components/Plans';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [DBProvider, dbContext, dbReadyState] = useDB();
  const dispatch = useDispatch();
  const classes = useAppStyles({});

  const rootRef = useRef(null);
  const modalRef = useRef<ModalContextValue>(null); 
  const [lastNotification, setLastNotification] = useState<NotificationType>(null); 

  const backups = useSelector(backupSelector);
  const statusOptions = useSelector(statusOptionsSelector);
  const typeOptions = useSelector(typeOptionsSelector);
  const tagOptions = useSelector(tagOptionsSelector);

  const getModalContext = useCallback(modalContext => modalRef.current = modalContext,[]);    

  useEffect(() => {
    const checkLatestVersion = async () => {
      if (document.visibilityState === 'visible') {
        checkVersionAndOpenModalIfUpdate(backups, modalRef);
      }
    };

    document.addEventListener('visibilitychange', checkLatestVersion);
    return () => document.removeEventListener('visibilitychange', checkLatestVersion);
  }, [backups]);

  useEffect(() => {
    if (dbReadyState) {
      const init = async () => {
        const backups = await initializeApplication(dbContext.db, dispatch);
        document.body.classList.remove('loader');
        checkVersionAndOpenModalIfUpdate(backups, modalRef);
      };

      const unsubscribe = subscribeToChanges(dbContext.db, dispatch, setLastNotification);
      
      init();
      return () => unsubscribe();
    }
  }, [dbContext.db, dbReadyState]);

  if (!dbReadyState) return null;

  return (
    <ErrorBoundary>
      <DBProvider value={dbContext}>
        <ModalProvider getContext={getModalContext}>
          <Div100vh id={'app'} ref={rootRef} className={classes.root}>
            <Notifications lastNotification={lastNotification} />
            <Routes>
              <Route path={'/privacy'} element={<PrivacyPolicy/>}/>
              <Route path={'/'} element={<Home statusOptions={statusOptions} typeOptions={typeOptions}/>}/>
              <Route path={'/settings'} element={<Settings typeOptions={typeOptions} setLastNotification={setLastNotification}/>} />
              <Route path={'/thought/:id/connections'} element={<Connections statusOptions={statusOptions}/>} />
              <Route path={'/thought/:id/history'} element={<History statusOptions={statusOptions}/>} />
              <Route path={'/plan/:id/timeline'} element={<Timeline/>} />
              <Route path={'/plan/:id/thought/:id/history'} element={<History statusOptions={statusOptions}/>} />
              <Route path={'/thought/:id'} element={<Thought statusOptions={statusOptions} typeOptions={typeOptions} tagOptions={tagOptions}/>} />
              <Route path={'/plan/:id/thought/:thoughtId/connections'} element={<Connections statusOptions={statusOptions}/>} />
              <Route path={'/plan/:id/thought/:thoughtId'} element={<Thought statusOptions={statusOptions} typeOptions={typeOptions} tagOptions={tagOptions}/>} />
              <Route path={'/plan/:id/settings'} element={<Settings typeOptions={typeOptions} setLastNotification={setLastNotification}/>} />
              <Route path={'/plan/:id'} element={<Home statusOptions={statusOptions} typeOptions={typeOptions}/>} />
              <Route path={'/stage'} element={<Stage/>} />
              <Route path={'/backups'} element={<Backups/>} />
              <Route path={'/merge/:backupId'} element={<Merge/>} />
              <Route path={'/process-merge/:backupId'} element={<ProcessMerge/>} />
              <Route path={'/timeline'} element={<Timeline allPlans={true}/>} />
              <Route path={'/plans'} element={<Plans/>} />
            </Routes>
            <AppNav className={classes.nav}/>
          </Div100vh>
        </ModalProvider>
      </DBProvider>
    </ErrorBoundary>
  );
};

export default App;
