import React, { FC, Fragment, useCallback, useState } from 'react';
import { Picture } from 'store/rxdb/schemas/picture';
import ImageWrapper from './ImageWrapper';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import FullScreenImage from './FullScreenImage';
import EditPictureDescription from './EditPictureDescription';
import useModal from '../../../../../hooks/useModal';
import { useLoadedDB } from '../../../../../hooks/useDB';
import Close from '@material-ui/icons/Close';
import Wallpaper from '@material-ui/icons/Wallpaper';
import { pictures as pictureActions } from '../../../../../actions/index';

interface ImagesProps {
  classes: any;
  relatedPictures: Picture[];
  loaded: boolean;
  deleteImage: (id: string) => () => Promise<any>;
}

export const Images: FC<ImagesProps> = ({ classes, relatedPictures, loaded, deleteImage }) => {
  const [fullScreenImage, setFullScreenImage] = useState<Picture>(null);
  const [openModal, closeModal] = useModal();
  const db = useLoadedDB();
  const [showDestructiveActions, setShowDestructiveActions] = useState<boolean>(false);

  const handleClickImage = (idx: number) => () => {
    const picture = relatedPictures[idx];
    setFullScreenImage(picture);
  };

  const handleCloseFullScreenImage = useCallback(() => {
    setFullScreenImage(null);
  }, []);

  const handleClickEditDescription = (picture: Picture) => () => {
    openModal(<EditPictureDescription onClose={closeModal} picture={picture}/>);
  };

  const pinImage = (picture: Picture) => async () => {
    const pinned: Picture = {
      ...picture,
      pinned: true,
    };
    const prevPinned = relatedPictures.find(prev => prev.pinned === true);

    if (prevPinned) {
      const unpinned: Picture = {
        ...prevPinned,
        pinned: false,
      };
      
      pictureActions.editPicture(db, unpinned);
    }
    
    pictureActions.editPicture(db, pinned);
  };

  const unpinImage = (picture: Picture) => () => {
    const unpinned: Picture = {
      ...picture,
      pinned: false,
    };
    pictureActions.editPicture(db, unpinned);
  }

  return (
    <Fragment>
      <button className={classes.toggleDestructiveIcons} onClick={() => setShowDestructiveActions(prev => !prev)}>
        {showDestructiveActions ? (
          <Close/>
        ) : (
          <Edit/>
        )}
      </button>
      {relatedPictures.length > 0 && (<div className={classes.imageList}>
        {relatedPictures.map((picture, idx) => {
          return (
            <ImageWrapper key={`${picture.id}`} className={classes.pictureItem} loaded={loaded}>
              {/* 
              // @ts-ignore */}
              <img src={picture.localUrl || picture.imgurUrl} className={classes.image} loading="lazy" onClick={handleClickImage(idx)}/>
              {showDestructiveActions && (<div className={classes.uploadOptions}>
                {picture.pinned ? (
                  <button className={classes.unpinButton} onClick={unpinImage(picture)}><Wallpaper/></button>
                ) : (
                  <button className={classes.pinButton} onClick={pinImage(picture)}><Wallpaper/></button>
                )}
                <button className={classes.deleteButton} onClick={deleteImage(picture.id)}><Delete/></button>
              </div>)}
              {picture.description ?
                (
                  <div className={classes.pictureDescription}>
                    <span className={classes.pictureDescriptionText}>{picture.description}</span>
                    <button
                      className={classes.editPictureDescriptionButton}
                       onClick={handleClickEditDescription(picture)}
                    >
                      <Edit/>
                    </button>
                  </div>
                ) :
                showDestructiveActions ?
                  (<button className={classes.pictureDescriptionButton} onClick={handleClickEditDescription(picture)}>Write Description</button>) :
                  null
              }
            </ImageWrapper>
          );
        })}
      </div>)}
      {fullScreenImage && (
        <FullScreenImage onClose={handleCloseFullScreenImage} image={fullScreenImage.localUrl || fullScreenImage.imgurUrl}/>
      )}
    </Fragment>
  )
};

export default Images;
