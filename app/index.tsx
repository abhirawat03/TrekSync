import { Text, View } from "react-native";
import { useEffect} from 'react';
import Login from "./Screen/Login";
import { auth } from "./../config/FirebaseConfig";
import { Redirect,useNavigation} from "expo-router";

export default function Index() {
  const user = auth.currentUser
  const navigation = useNavigation();
  useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
      });
    }, [navigation]);
  console.log('user',user)
  return (
    <View
      style={{flex: 1}}
    >
       {user ? <Redirect href="/home" /> : <Login />}
      
    </View>
  );
}