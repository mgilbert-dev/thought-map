import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: () => ({
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background[600],
    display: 'grid',
    padding: 10,
    gridRowGap: '10px',
    gridTemplateAreas: `"compare"
                        "queue"
                        "remove"
                        "stage"
                        "."`,
    gridTemplateRows: 'calc(100% - 395px) 100px 100px 100px 95px',
    gridTemplateColumns: '1fr',
    '& > *': {
      boxShadow: '0px 0px 5px 2px black',
      backgroundColor: theme.palette.background[100],
    }
  }),
  upToDate: () => ({
    height: '100%',
    width: '100%',
    ...theme.defaults.centered,
    fontWeight: 600,
    fontSize: 40,
    color: theme.palette.secondary[700],
  }),
  currentCompare: () => ({
    gridArea: 'compare',
  }),
  currentReview: () => ({
    gridArea: 'compare',
  }),
  compareQueue: () => ({
    gridArea: 'queue',
  }),
  removableQueue: () => ({
    gridArea: 'remove',
  }),
  mergeStage: () => ({
    gridArea: 'stage',
  }),
  currentRemovable: () => ({
    gridArea: 'compare',
  }),
}));

export const useCompareQueueStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    padding: 10,
    gridGap: '10px',
    gridTemplateAreas: `"title "
                        "items"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: '1fr',
  },
  title: {
    gridArea: 'title',
    fontWeight: 600,
    color: theme.palette.background[800],
  },
  items: {
    gridArea: 'items',
    overflow: 'auto',
    display: 'grid',
    gridAutoFlow: 'column',
    gridColumnGap: '20px',
  },
  compareItem: () => ({
    backgroundColor: theme.palette.background[300],
    color: theme.palette.secondary[700],
    display: 'grid',
    padding: 5,
    width: 100,
    gridTemplateAreas: `"collection-name"
                        "diff-fields"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: '1fr',
    transition: 'all 0.2s linear',
    boxShadow: '0px 0px 3px 0px black',
    '&.selected': {
      boxShadow: '0px 0px 6px -1px black',
      color: theme.palette.background[300],
      backgroundColor: theme.palette.secondary[700],
    },
  }),
  compareItemCollectionName: () => ({
    gridArea: 'collection-name',
    fontWeight: 600,    
  }),
  compareItemDiffFields: () => ({
    gridArea: 'diff-fields',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  readyToMergeButton: () => ({
    fontWeight: 600,
    ...theme.defaults.centered,
    fontSize: 20,
    color: theme.palette.primary[700],
  }),
}));

export const useMergeStageStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    padding: 10,
    gridGap: '10px',
    gridTemplateAreas: `"title"
                        "items"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: '1fr',
  },
  title: {
    gridArea: 'title',
    fontWeight: 600,
    color: theme.palette.background[800],
  },
  items: {
    gridArea: 'items',
    overflow: 'auto',
    display: 'grid',
    gridAutoFlow: 'column',
    gridColumnGap: '20px',
  },
  mergeItem: () => ({
    backgroundColor: theme.palette.background[300],
    color: theme.palette.secondary[700],
    display: 'grid',
    padding: 5,
    width: 100,
    gridTemplateAreas: '"collection-name"',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
    transition: 'all 0.2s linear',
    boxShadow: '0px 0px 3px 0px black',
    '&.selected': {
      boxShadow: '0px 0px 6px -1px black',
      color: theme.palette.background[300],
      backgroundColor: theme.palette.secondary[700],
    },
  }),
  mergeItemCollectionName: () => ({
    gridArea: 'collection-name',
    fontWeight: 600,    
    ...theme.defaults.centered,
  }),
  removeButton: () => ({
    '& svg': {
      color: 'white',
    },
  }),
}));

export const useRemovableQueueStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    padding: 10,
    gridGap: '10px',
    gridTemplateAreas: `"title "
                        "items"`,
    gridTemplateRows: 'max-content 1fr',
    gridTemplateColumns: '1fr',
  },
  title: {
    gridArea: 'title',
    fontWeight: 600,
    color: theme.palette.background[800],
  },
  items: {
    gridArea: 'items',
    overflow: 'auto',
    display: 'grid',
    gridAutoFlow: 'column',
    gridColumnGap: '20px',
  },
  removableItem: {

  },
  removableItemCollectionName: {

  },
}));
