import { useState, useEffect } from "react";
import { getAuth, signInWithPopup, onAuthStateChanged, signOut, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, getIdToken } from 'firebase/auth';
import initializeAuthentication from "../components/Pages/Login/Login/Firebase/firebase.init";

initializeAuthentication();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [photoID, setphotoID] = useState('');
    const [phone, setPhone] = useState('');
    const [accountType, setAccountType] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    const [token, setToken] = useState('');
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();


    // checking if initial state is getting user from useAuth(). if not then loading forever untill getting value
    const [isLoading, setIsLoading] = useState(true);

    const getGoogleSignIn = () => {
        const signInG = signInWithPopup(auth, googleProvider);
        saveUser(user.email, user.name, 'PUT');
        return signInG;
    }
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, userInfo => {
            if (userInfo && userInfo.emailVerified) {
                setUser(userInfo);
                getIdToken(userInfo)
                    .then(idToken => {
                        setToken(idToken);
                    })
            }
            else {
                setUser({});
            }
            setIsLoading(false);
        });
        return () => unsubscribed;

    }, [auth]);

    const logOut = () => {
        signOut(auth)
            .then(() => {
                setUser({});
                setSuccess('Signed-Out successfully!');
                setError('');
            })
            .catch(err => {
                setError(err.code);
                setSuccess('');
            })
    }

    const getName = (e) => {
        setName(e.target.value);
    }
    const getIdNumber = (e) => {
        setIdNumber(e.target.value);
    }
    const getaccountType = (e) => {
        setAccountType(e.target.value);
    }
    const getPhotoID = (e) => {
        setphotoID(e.target.value);
    }
    const getPhone = (e) => {
        setPhone(e.target.value);
    }
    const getReTypePassword = (e) => {
        setRetypePassword(e.target.value);
    }
    const getEmail = (e) => {
        setEmail(e.target.value);
    }
    const getPassword = (e) => {
        setPassword(e.target.value);
    }
    const getEmailSignUp = () => {

        const newUser = createUserWithEmailAndPassword(auth, email, password);
        saveUser(email, name, 'POST');
        return newUser;
    }
    const getEmailSignIn = () => {
        return signInWithEmailAndPassword(auth, email, password);
    }
    const getUpdateProfile = () => {
        return updateProfile(auth.currentUser, {
            displayName: name
        });
    }
    const getVerifyEmail = () => {
        return sendEmailVerification(auth.currentUser);
    }
    const getResetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccess('Password Reset confirmation sent to your email successfully!');
                setError('');
            })
            .catch(err => {
                setError(err.code);
                setSuccess('');
            })
    }
    useEffect(() => {
        fetch(`http://localhost:5000/users/${user.email}`)
            .then(res => res.json())
            .then(data => setAdmin(data.admin))
    }, [user.email]);

    const saveUser = (email, displayName, method) => {
        // const totalInfo = { phone, photoID, accountType };
        const user = { email, displayName, phone, photoID, accountType, idNumber };
        fetch('http://localhost:5000/users', {
            method: method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then()
    }


    return {
        user,
        admin,
        error,
        success,
        token,
        setUser,
        setError,
        setSuccess,
        getGoogleSignIn,
        logOut,
        name,
        email,
        password,
        idNumber,
        phone,
        photoID,
        accountType,
        retypePassword,
        getaccountType,
        getReTypePassword,
        getPhotoID,
        getPhone,
        getIdNumber,
        getName,
        getEmail,
        getPassword,
        getEmailSignUp,
        getEmailSignIn,
        getVerifyEmail,
        getUpdateProfile,
        getResetPassword,
        isLoading,
        setIsLoading,
    }
}

export default useFirebase;