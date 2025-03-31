import { StyleSheet, Text, TextInput, View, TouchableOpacity, ToastAndroid, BackHandler } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";

const SignIn = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordInputRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const backAction = () => {
      // Allow the back button to navigate to the previous screen
      router.back(); // This will take the user back to the previous screen
      return true; // Prevent the default back action if you want to customize it
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    // Cleanup the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [navigation, router]);

  const onSignIn = () => {
    if (!email && !password) {
      ToastAndroid.show('Please Enter Email & Password', ToastAndroid.LONG);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/home');
        console.log('user', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorMessage', errorMessage);
        if (errorCode === 'auth/invalid-email') {
          ToastAndroid.show('Invalid Email', ToastAndroid.LONG);
        }
        if (errorCode === 'auth/invalid-credential') {
          ToastAndroid.show('Invalid Credential', ToastAndroid.LONG);
        }
      });
  };

  const onForgotPassword = () => {
    if (!email) {
      ToastAndroid.show('Please enter your email address to reset your password.', ToastAndroid.LONG);
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        ToastAndroid.show('Password reset email sent. Please check your inbox.', ToastAndroid.LONG);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorMessage', errorMessage);
        if (errorCode === 'auth/user-not-found') {
          ToastAndroid.show('No user found with this email address.', ToastAndroid.LONG);
        }
        if (errorCode === 'auth/invalid-email') {
          ToastAndroid.show('Invalid Email Address', ToastAndroid.LONG);
        }
      });
  };

  return (
    <LinearGradient colors={['#000000', '#1c1f2b', '#232323']} style={styles.container}>
      <Svg height="100%" width="100%" style={styles.backgroundSvg}>
        {/* SVG content here */}
        <Circle cx="15%" cy="15%" r="100" fill="rgba(109, 213, 237, 0.4)" />
        <Circle cx="85%" cy="85%" r="150" fill="rgba(59, 89, 152, 0.3)" />
        <Path d="M0,250 Q150,300 300,200 T600,150 L600,0 L0,0 Z" fill="rgba(109, 213, 237, 0.2)" />
        <Path d="M0,350 Q200,450 400,300 T600,250 L600,0 L0,0 Z" fill="rgba(59, 89, 152, 0.15)" />
        <Circle cx="50%" cy="50%" r="200" fill="rgba(109, 213, 237, 0.05)" />
      </Svg>

      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.paragraph}>Let's get you signed in</Text>
        <Text style={[styles.paragraph, styles.paragraphFirst]}>Welcome Back</Text>
        <Text style={[styles.paragraph, styles.paragraphFirst]}>You've been missed!</Text>

        {/* Email and Password input fields */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#7d7d7d"
            returnKeyType="next"
            onChangeText={(value) => setEmail(value)}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordInputRef}
              style={[styles.input, styles.passwordInput]}
              secureTextEntry={!isPasswordVisible}
              placeholder="Enter Password"
              placeholderTextColor="#7d7d7d"
              returnKeyType="done"
              onChangeText={(value) => setPassword(value)}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={isPasswordVisible ? "eye" : "eye-off"}
                size={24}
                color="#7d7d7d"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onSignIn}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonInverter]}
          onPress={() => router.replace('auth/sign-up')}
        >
          <Text style={{ textAlign: 'center', color: '#000' }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  paragraph: {
    fontFamily: 'Outfit',
    fontSize: 30,
    marginTop: 30,
    color: '#fff',
  },
  paragraphFirst: {
    color: '#b0b0b0',
  },
  label: {
    fontFamily: 'Outfit',
    color: '#fff',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#7d7d7d',
    color: '#fff',
    fontFamily: 'Outfit',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  button: {
    padding: 20,
    backgroundColor: '#c24e13',
    borderRadius: 15,
    marginTop: 20,
  },
  buttonInverter: {
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  forgotPassword: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
