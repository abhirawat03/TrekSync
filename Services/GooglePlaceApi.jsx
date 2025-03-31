import Constants from 'expo-constants';
export const GetPhotoRef=async(placeName)=>{
    const googleMapsApiKey = Constants.expoConfig?.extra?.GOOGLE_API_KEY;
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${googleMapsApiKey}`
    );

  const result=await resp.json();
  console.log(result);
  return result;
}