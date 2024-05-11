import { createContext, useEffect, useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import app from '../firebase/firebase.config';
import PropTypes from 'prop-types';
import axios from 'axios';

const auth = getAuth(app);

export const AuthContext = createContext(null);

// social auth providers
const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const signInWithSocial = socialProvider => {
    setLoading(true);
    return signInWithPopup(auth, socialProvider);
  };

  const updateUserProfile = (userName, userPhotoURL) => {
    
    return updateProfile(auth.currentUser, {
      displayName: userName,
      photoURL: userPhotoURL,
    });
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);




    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, currentUser => {
        const userEmail = currentUser?.email || user?.email;
        const loggedUser = { email: userEmail };
        setUser(currentUser);

        // if user exists then issue a token
        if (currentUser) {
          axios
            .post(`${import.meta.env.VITE_API_URL}/getJwtToken`, loggedUser, {
              withCredentials: true,
            })
            .then(res => {
              if (res.data.success) {
                setLoading(false);
              }
            });
        } else {
          axios
            .post(
              `${import.meta.env.VITE_API_URL}/deleteJwtToken`,
              loggedUser,
              {
                withCredentials: true,
              }
            )
            .then(res => {
              if (res.data.success) {
                setLoading(false);
              }
            });
        }
      });
      return () => unSubscribe();
    }, [user?.email]);

  const authInfo = {
    user,
    loading,
    createUser,
    logIn,
    logOut,
    signInWithSocial,
    googleProvider,

    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};