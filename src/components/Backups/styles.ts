import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: (params: any) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background[700],
  }),
  setupBackupTargetButton: (params: any) => ({
    margin: 'auto auto',
    color: theme.palette.background[700],
    backgroundColor: theme.palette.background[200],
    fontWeight: 600,
    fontSize: 24,
    border: `1px solid ${theme.palette.background[700]}`,
    padding: '10px 20px',
    borderRadius: 6,
  }),
  header: (params: any) => ({
    fontWeight: 900,
    fontSize: 20,
    color: theme.palette.secondary[200],
    padding: 20,
  }),
  backup: (params: any) => ({
    backgroundColor: theme.palette.background[100],
    margin: 20,
    position: 'relative',
    padding: 10,
    borderRadius: '3px',
    marginTop: 0,
    display: 'grid',
    gridTemplateAreas: `"backup-id update-status update-status edit"
                        "private-key delete active active"
                        "merge pull push push"`,
    gridTemplateRows: 'max-content max-content max-content',
    gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr)) 30px',
    gridRowGap: '10px',
    gridColumnGap: '5px',
    '&.isUpdating': {
      '&:after': {
        content: '"Updating..."',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#808080c9',
        zIndex: 999999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.secondary[300],
        textShadow: '1px 1px 4px #000000',
        fontWeight: 600,
        fontSize: 20,
      },
    },
  }),
  backupId: (params: any) => ({
    gridArea: 'backup-id',
    color: theme.palette.primary[600],
    fontWeight: 600,
    ...theme.defaults.centered,
    marginRight: 'auto',
  }),
  editButton: (params: any) => ({
    gridArea: 'edit',
    color: theme.palette.negative[500],
    ...theme.defaults.centered,
    '& svg': {
      height: '0.75em',
      width: '0.75em',
    },
  }),
  updateStatus: (params: any) => ({
    gridArea: 'update-status',        
    fontStyle: 'italic',
    display: 'flex',
    justifyContent: 'space-around',
    color: theme.palette.secondary[600],
    '&.updateAvailable': {
      color: theme.palette.primary[600],
      fontWeight: 600,
    },
  }),
  version: (params: any) => ({
    ...theme.defaults.centered,
    '&.merged': {
      fontWeight: 600,
    },
  }),
  button: (params: any) => ({
    border: `1px solid ${theme.palette.secondary[700]}`,
    borderRadius: '3px',
    color: theme.palette.secondary[700],
    fontWeight: 600,
    padding: '0 5px',
    cursor: 'pointer',
    '&.privateKey': {
      gridArea: 'private-key',
    },
    '&.merge': {
      gridArea: 'merge',
    },
    '&.pull': {
      gridArea: 'pull',
    },
    '&.push': {
      gridArea: 'push',
    },
    '&.delete': {
      gridArea: 'delete',
    },
    '&.active': {
      gridArea: 'active',
      '&.isActive': {
        fontWeight: 600,
        color: theme.palette.background[100],
        backgroundColor: theme.palette.secondary[700],
      },
    },
    '&:disabled': {
      color: 'gray',
    },
  }),
}));
