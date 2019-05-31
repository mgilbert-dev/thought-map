import './styles.css';

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    padding: 20,
    backgroundColor: '#d2d2d2',
    gap: '20px',
    gridTemplateAreas: `"content header"
                        "content header"
                        "content guide-button"
                        "content settings-button"`,
    gridTemplateRows: 'repeat(4, 1fr)',
    gridTemplateColumns: 'repeat(2, 1fr)',
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `"content content"
                          "guide-button guide-button"
                          "settings-button settings-button"
                          "header header"`,
      gridTemplateRows: '5fr minmax(50px, 1fr) minmax(50px, 1fr) minmax(50px, 1fr)',
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    //Dev
    '& > *': {
      // border: '1px solid black',
    }
  },
  content: {
    gridArea: 'content',
    display: 'grid',
    border: '5px solid #1f719e',
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'auto',
    ...theme.defaults.castShadow.light,
    '& > *': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    '& > h3': {
      fontWeight: 600,
    },
  },
  thoughtNode: {
    border: '1px solid black',
  },
  guideButton: {
    gridArea: 'guide-button',
    border: '5px solid #1f719e',
    fontSize: 20,
    ...theme.defaults.castShadow.light,
  },
  header: {
    gridArea: 'header',
    margin: 'auto',
    fontSize: 50,
  },
  CircleButton: {
    position: 'fixed',
    border: `2px solid ${theme.palette.primary[500]}`,
    top: 0,
    right: 0,
    margin: 30,
    height: 70,
    width: 70,
    borderRadius: '50%',
    backgroundColor: theme.palette.gray[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s linear',
    color: 'white',
    '&:hover': {
      transform: 'scale(1.1)',
      ...theme.defaults.castShadow.heavy,
    },
    '&:active': {
      transform: 'scale(1)',
      boxShadow: 'none',
    },
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      bottom: 0,
      transition: 'all 0.1s linear',
      ...theme.defaults.castShadow.heavy,
      '&:hover': {
        transform: 'unset',
      },
      '&.touched': {
        boxShadow: 'none!important',
        transform: 'scale(0.9)!important',
      },
    },
  },
  settingsButton: {
    gridArea: 'settings-button',
    border: '5px solid #1f719e',
    fontSize: 20,
    ...theme.defaults.castShadow.light,
  }
});
