import { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  deleteAccount,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, FIREBASE_STORAGE } from "../FirebaseConfig";
import { router } from "expo-router";
import { ActivityIndicator, Alert, Button, Text } from "react-native";
import WelcomeLoading from "../app/index";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);

  // setLoading(true);

  // on AuthStateChanged

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // console.log("got User", user);
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const userData = {
              username: data.username,
              country: data.country,
              age: data.age,
              interest: data.interest,
              name: data.name,
              userId: data.userId,
              profileImage: data.profileImage,
              email: data.email,
              coin: data.coin,
            };
            setUser({
              ...user,
              name: userData.name,
              userId: userData.uid,
              profileImage: userData.profileImage,
              username: userData.username,
              age: userData.age,
              coin: userData.coin,
            });
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
        }

        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsub(); // Unsubscribe from the onAuthStateChanged listener
    };
  }, []);

  if (loading == true) {
    return <WelcomeLoading></WelcomeLoading>;
  }

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("auth/invalid-credential"))
        msg = "Email or Password Wrong";
      if (msg.includes("auth/network-request-failed"))
        msg = "Unable to Login, Please check your internet";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (
    name,
    email,
    username,
    age,
    password,
    interest,
    country,
    profileImage,
    coin
  ) => {
    try {
      // Check if the username is already taken
      const usernameTaken = await isUsernameTaken(username);

      if (usernameTaken) {
        return { error: "auth/username-taken" };
      }
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("response.user:", response?.user);
      // set User(response?.user)
      await setDoc(doc(db, "users", response?.user?.uid), {
        name: name,
        email: email,
        username: username,
        age: age,
        country: country,
        interest: interest,
        profileImage,
        userId: response?.user?.uid,
        coin: coin,
      });
      return { success: true, data: response?.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already exist";
      return { success: false, msg };
    }
  };

  // Function to check if a username already exists
  const isUsernameTaken = async (username) => {
    try {
      // Query the 'users' collection to check if a document with the given username exists
      const docRef = doc(db, "users", username);
      const docSnapshot = await getDoc(docRef);

      // If the document exists, the username is taken
      return docSnapshot.exists();
    } catch (error) {
      console.error("Error checking username:");
      throw error;
    }
  };

  // for the register page
  // const register = async (
  //   email,
  //   password,
  //   displayName,
  //   username,
  //   age,
  //   interest,
  //   country
  // ) => {
  //   try {
  //     // Check if the username is already taken
  //     const usernameTaken = await isUsernameTaken(username);

  //     if (usernameTaken) {
  //       return { error: "auth/username-taken" };
  //     }

  //     const resp = await createUserWithEmailAndPassword(auth, email, password);
  //     await updateProfile(resp.user, { displayName });

  //     AuthStore.update((store) => {
  //       store.user = auth.currentUser;
  //       store.isLoggedIn = true;
  //     });

  //     const name = displayName;

  //     const formData = { email, name, username, name, age, interest, country };
  //     formData.timestamp = serverTimestamp();

  //     await setDoc(doc(db, "users", resp.user.uid), formData);

  //     return { user: auth.currentUser };
  //   } catch (e) {
  //     return { error: e };
  //   }
  // };

  // when user resets password on the forgot password page
  const appResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e) {
      console.log(e);
    }
  };

  const changePassword = async (newPassword) => {
    try {
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (e) {
      console.log(e);
    }
  };

  // for edit profile page when user changes profile image
  const uploadImageToProfile = async (uri, name, onProgress) => {
    const fetchResponse = await fetch(uri);
    const profilePicBlob = await fetchResponse.blob();

    const imageRef = ref(FIREBASE_STORAGE, `images/${name}`);

    const uploadTask = uploadBytesResumable(imageRef, profilePicBlob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress && onProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Get the current user
          const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            const data = docSnap.data();
            const userData = {
              username: data.username,
              country: data.country,
              age: data.age,
              interest: data.interest,
              name: data.name,
              userId: data.userId,
              profileImage: data.profileImage,
              email: data.email,
              coin: data.coin,
            };

            // Check if the 'profileImage' field exists in the user's document
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              // 'profileImage' field exists, update it
              await updateDoc(userDocRef, {
                profileImage: downloadURL,
              });
              setUser({
                ...user,
                name: userData.name,
                userId: userData.uid,
                profileImage: downloadURL,
                username: userData.username,
                age: userData.age,
                coin: userData.coin,
              });
              Alert.alert("Display Picture changed");
              router.navigate("profileScreen");
            } else {
              // 'profileImage' field does not exist, create it
              await setDoc(userDocRef, {
                profileImage: downloadURL,
              });
              setUser({
                ...user,
                name: userData.name,
                userId: userData.uid,
                profileImage: downloadURL,
                username: userData.username,
                age: userData.age,
                coin: userData.coin,
              });
            }
          }

          resolve({
            downloadURL,
            metadata: uploadTask.snapshot.metadata,
          });
        }
      );
    });
  };

  // for edit profile page when user updates details
  const updateProfileDetails = async (name, email, jumpNumber) => {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);

    // Prepare the updated data
    const updatedData = {};

    if (typeof name === "string" && name.trim() !== "") {
      updatedData.name = name;
    }

    if (typeof email === "string" && email.trim() !== "") {
      updatedData.email = email;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const userData = {
        username: data.username,
        country: data.country,
        age: data.age,
        interest: data.interest,
        name: data.name,
        userId: data.userId,
        profileImage: data.profileImage,
        email: data.email,
      };
      await setDoc(userDocRef, updatedData, { merge: true });
      setUser({
        ...user,
        name: updatedData.name,
        userId: userData.uid,
        profileImage: userData.profileImage,
        username: userData.username,
        age: userData.age,
      });
      return updatedData; // Successful update
    } catch (error) {
      console.error("Error updating profile details:");
      throw error;
    } finally {
      router.replace("home");
    }
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      const querySnapshot = await getDocs(collection(db, "news"));
      const newsData = [];
      querySnapshot.forEach((doc) => {
        const newsDetails = doc.data();
        newsData.push(newsDetails);
      });

      const userData = {
        username: data.username,
        country: data.country,
        age: data.age,
        interest: data.interest,
        name: data.name,
        userId: data.userId,
        profileImage: data.profileImage,
        email: data.email,
        coin: data.coin,
      };
      setNews(newsData);
      setUser({
        ...user,
        name: userData.name,
        userId: userData.uid,
        profileImage: userData.profileImage,
        username: userData.username,
        age: userData.age,
        interest: userData.interest,
        email: userData.email,
        country: userData.country,
        coin: userData.coin,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching News:");
      throw error;
    }
  };

  const updateCoin = async (coin) => {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);

    try {
      // Get the current user data
      const docSnap = await getDoc(userDocRef);
      const userData = docSnap.data();

      // Calculate the updated coin value by adding the new coin to the previous coin
      const updatedCoin = userData.coin + coin;

      // Prepare the updated data
      const updatedUserData = {
        ...userData,
        coin: updatedCoin,
      };

      // Update the user document
      await setDoc(userDocRef, updatedUserData);

      // Update the user state
      setUser((user) => ({
        ...user,
        coin: updatedCoin,
      }));

      console.log(updatedCoin);

      return updatedCoin; // Successful update
    } catch (error) {
      console.error("Error updating coin:", error);
      throw error;
    }
  };

  const deleteUserAccount = async () => {
    try {
      // Get the current user
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        // Delete the user's document from the database
        const userDocRef = doc(db, "users", userId);
        await deleteDoc(userDocRef);

        // Delete the user's account from Firebase Authentication
        await deleteAccount(user);

        return { success: true };
      } else {
        return { error: "No authenticated user found" };
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  // Function to add a username to the users collection
  const addUsername = async (username) => {
    const user = auth.currentUser;

    if (!user) {
      // Handle the case where there is no authenticated user
      return { error: "No authenticated user found" };
    }

    // Check if the username is already taken
    const isTaken = await isUsernameTaken(username);
    if (isTaken) {
      return { error: "auth/username-taken" };
    }

    // Update the user's document with the new username
    const userDocRef = doc(db, "users", user.uid);

    try {
      await setDoc(userDocRef, { username }, { merge: true });
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  };

  // toggling location saved
  // toggle save when save button pressed
  const onSaveToggle = async (id, isLoggedIn) => {
    if (!isLoggedIn) {
      console.error("No authenticated user found");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No authenticated user found");
        return;
      }
      const userId = currentUser.uid;

      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      const userDocData = userDocSnap.data();
      const { locationIds = [] } = userDocData || {};

      const numericId = typeof id === "string" ? parseInt(id) : id;

      // checking if ID already exists
      if (locationIds.includes(numericId)) {
        // Remove the location ID from the array
        await updateDoc(userDocRef, { locationIds: arrayRemove(numericId) });
        console.log("Location ID removed from user document");

        return false;
      } else {
        // Add the location ID to the array
        await setDoc(
          userDocRef,
          { locationIds: arrayUnion(numericId) },
          { merge: true }
        );
        console.log("Location ID added to user document");

        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        isUsernameTaken,
        appResetPassword,
        uploadImageToProfile,
        updateProfileDetails,
        deleteUserAccount,
        addUsername,
        updateCoin,
        changePassword,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
