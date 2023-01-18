import ImageCropPicker from 'react-native-image-crop-picker';


export function photoPicker(options) {
  return new Promise(async resolve => {
    ImageCropPicker.openPicker({
      cropping: true,
      width: 500,
      height: 500,
      forceJpg: true,
      mediaType: 'photo',
      compressImageQuality: 0.6,
      ...options,
    })
      .then(response => {
        const dataObj = {
          uri: response.path,
          name: 'file' + new Date().getTime() + '.jpg',
          type: response.mime,
        };
        resolve({ status: true, data: dataObj });
      })
      .catch(e => {
        console.log(e);
        resolve({ status: false, message: e.message });
      });
  });
}

export function cameraPicker(options) {
  return new Promise(async resolve => {
    ImageCropPicker.openCamera({
      cropping: true,
      width: 500,
      height: 500,
      forceJpg: true,
      mediaType: 'photo',
      compressImageQuality: 1,
      ...options,
    })
      .then(response => {
        const dataObj = {
          uri: response.path,
          name: 'file' + new Date().getTime() + '.jpg',
          type: response.mime,
        };
        resolve({ status: true, data: dataObj });
      })
      .catch(e => {
        console.log(e);
        resolve({ status: false, message: e.message });
      });
  });
}
