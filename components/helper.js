import * as ImagePicker from "expo-image-picker";

export const galleryPick = async () => {
  try {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const uri = result.uri;

    if (!result.canceled && user) {
      setDisplayPicture(result.assets[0].uri);
      const { uri, fileName } = result.assets[0];
      const uploadResult = await uploadToFirebase(uri, fileName);
      // console.log(uploadResult);
      console.log(result);
    }
  } catch (e) {
    Alert.alert("error Uploading Image" + e.message);
  }
};
export const cameraPick = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  // console.log(result);

  if (!result.canceled) {
    setDisplayPicture(result.assets[0].uri);
    // setDisplayPicture(uploadResult.downloadUrl);
    const { uri } = result.assets[0];
    const fileName = uri.split("/").pop();
    const uploadResult = await uploadToFirebase(uri, fileName, (v) =>
      console.log(v)
    );
    // console.log(uploadResult);
  }
};
