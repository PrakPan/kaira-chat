import { SET_GALLERY_IMAGES } from "./actionsTypes";

export const setGalleryImages = (images) => ({
  type: SET_GALLERY_IMAGES,
  payload: images
});