export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.gray[500],
    overflow: 'hidden',
    '& > .isFocus': {
      flex: 1,
      ...theme.defaults.castShadow.light,
      margin: 50,
      backgroundColor: theme.palette.gray[0],
    }
  },
  phase: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    '& label': {
      textTransform: 'uppercase',
      margin: 10,
    },
  },
  phaseInputLabel: {    
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.gray[700],
    position: 'relative',
    '&#title': {
      gridArea: 'title-input',
    },
    '&#note': {
      marginRight: 30,
    },
    '& > div': {
      ...theme.defaults.underlineInput,
    },
  },
  phaseInputField: {
    height: '100%',
    fontSize: 20,
  },
  phaseSelectLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: theme.palette.gray[700],
    '&#type': {
      gridArea: 'type-input',
      '& > select': {
        backgroundColor: 'white',
      }
    },
    '&#tag': {
      '& > select': {
        backgroundColor: 'transparent',
        color: 'white',
      },
    }
  },
  phaseSelect: {
    flex: '0 0 40px',
    fontSize: 20,
    border: `1px solid ${theme.palette.gray[300]}`,
  },
  phaseOption: {
    
  },
  phaseDateLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: theme.palette.gray[700],
    '&#date': {
      gridArea: 'date-input',
    },
  },
  phaseDateField: {
    flex: '0 0 40px',
    fontSize: 20,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: '5px',
    backgroundColor: 'white',
  },
  phaseDescriptionLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: theme.palette.gray[700],
    '&#description': {
      gridArea: 'description-input',
      marginBottom: 10,
      flex: 1,
    },
  },
  phaseDescriptionField: {
    flex: 1,
    fontSize: 20,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: '5px',
  },
  phaseNextButton: {
    height: 80,
    ...theme.defaults.bubbleButton,
  },
  hideDescriptionButton: {
    marginTop: 10,
  },
  phase1: {
    '&:not(.isFocus)': {
      width: '100%',
      display: 'grid',
      gridTemplateAreas: `"header title-input"`,
      gridTemplateRows: 'repeat(1, 1fr)',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.palette.gray[300]}`,
    },
    '& #add-notes': {
      right: 'unset',
      left: 0,
    }
  },
  phase2: {
    '&:not(.isFocus)': {
      width: '100%',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.palette.gray[300]}`,
    },
    '& #add-tags': {
      right: 'unset',
      left: 0,
    }
  },
  phase3: {
    '& #add-notes': {
      right: 'unset',
      left: 0,
    }
  },
  addTagButton: {
    color: theme.palette.secondary[500],
  },
  deleteTagButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'white',
    '& > svg': {
      height: 15,
      width: 15,
    }
  },
  tagGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '5px',
    margin: 5,
    '& > li': {
      position: 'relative',
      border: '1px solid black',
      padding: '10px 0',
      textAlign: 'center',
      borderRadius: '5px',
      backgroundColor: theme.palette.primary[500],
      color: 'white',
    },
    '& > *': {
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  addNoteButton: {
    color: theme.palette.secondary[500],
  },
  deleteNoteButton: {
    position: 'absolute',
    right: -25,
    color: theme.palette.red[500],
  },
  phaseHeader: {
    gridArea: 'header',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
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
    opacity: 0.5,
    '&:not([disabled])': {
      opacity: 1,
      '&:hover': {
        transform: 'scale(1.1)',
        ...theme.defaults.castShadow.heavy,
      },
      '&:active': {
        transform: 'scale(1)',
        boxShadow: 'none',
      },
    },
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      bottom: 0,
      transition: 'all 0.1s linear',
      '&:not([disabled])': {
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
  }
});