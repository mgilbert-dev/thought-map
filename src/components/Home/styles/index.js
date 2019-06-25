import './styles.css';

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    padding: 20,
    backgroundColor: theme.palette.gray[500],
    gap: '20px',
    gridTemplateAreas: `"content content"
                        "plans-list plans-list"
                        "header header"`,
    gridTemplateRows: '7fr minmax(50px, 1fr) minmax(50px, 1fr)',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  selectLabel: {
    '&#plans': {
      gridArea: 'plans-list',
      display: 'flex',
      backgroundColor: '#8380ff',      
      borderRadius: '10px',
      position: 'relative',
      '& > select': {
        flex: 1,
        color: 'white',
        display: 'flex',
        textAlignLast: 'center',
        paddingLeft: 13,
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 24,
      }
    },
  },
  content: {
    gridArea: 'content',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'auto',
    ...theme.defaults.castShadow.light,
    '& > h3': {
      fontWeight: 600,
    },
    '& > :not(:last-child)': {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        borderBottom: '1px solid #0000003d',
        left: '20%',
        right: '20%',
        bottom: 0,
      },
    },
  },
  thoughtNode: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    '& > #status-select': {
      marginLeft: 20,
      padding: '5px 0',
      backgroundColor: '#8380ff',      
      borderRadius: '10px',
      '& > select': {
        color: 'white',
        display: 'flex',
        textAlignLast: 'center',
        paddingLeft: 13,
        backgroundColor: 'transparent',
        border: 'none',
      },
    },
  },
  thoughtNodeTitle: {
    color: theme.palette.gray[500],
  },
  guideButton: {
    gridArea: 'guide-button',
    fontSize: 20,
    borderRadius: 20,
    color: 'white',
    backgroundColor: '#8380ff',
    ...theme.defaults.castShadow.light,
  },
  header: {
    gridArea: 'header',
    margin: 'auto',
    fontSize: 50,
    fontFamily: 'avenir',
    color: '#c2c2ff',
  },
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[600],
    '&#add-thought, &#create-plan': {
      bottom: 10,
      right: 10,
    },
    '&#edit-plan': {
      bottom: 10,
      left: 10,
      opacity: 0.5,
    },
    '&#create-plan': {
      '&:disabled': {
        opacity: 0.5,
      },
    },
  },
  settingsButton: {
    gridArea: 'settings-button',
    fontFamily: 'avenir',
    fontSize: 20,
    borderRadius: 20,
    color: 'white',
    backgroundColor: '#0e466399',
    transition: 'all 0.1s linear',
    ...theme.defaults.castShadow.light,
    '&:active': {
      transform: 'scale(0.99)',
      boxShadow: 'none',
    },
  }
});
