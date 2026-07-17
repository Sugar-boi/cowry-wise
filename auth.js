// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-sUp6Z-ySSQu8y68MvXXPzmfxSWx3zXs",
    authDomain: "level1-project-cowry-wise.firebaseapp.com",
    projectId: "level1-project-cowry-wise",
    storageBucket: "level1-project-cowry-wise.firebasestorage.app",
    messagingSenderId: "104220736652",
    appId: "1:104220736652:web:f5ea8f03db4ba3b9870fa9",
    measurementId: "G-8W74RJJQHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function showToast(message, type = "info") {
    const colors = {
        success: "linear-gradient(135deg, #16a34a, #22c55e)",
        error: "linear-gradient(135deg, #dc2626, #f97316)",
        info: "linear-gradient(135deg, #0066ff, #38bdf8)"
    };

    if (typeof Toastify === "function") {
        Toastify({
            text: message,
            duration: 3500,
            gravity: "top",
            position: "right",
            close: true,
            stopOnFocus: true,
            style: {
                background: colors[type] || colors.info,
                borderRadius: "8px",
                color: "#ffffff",
                fontWeight: "800",
                padding: "14px 16px"
            }
        }).showToast();
        return;
    }

    console.log(message);
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userEmail', userData.email);
}

// Get user data from localStorage
function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

// Check if user has completed profile
function hasCompletedProfile() {
    const userData = getUserData();
    return userData && userData.firstName && userData.lastName && userData.username && userData.phone && userData.password;
}

// Check if user has created PIN
function hasPIN() {
    return localStorage.getItem('userPin') !== null;
}

// Google Sign In for Signup
async function googleSignUpFlow() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Store Google user data
        const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            isGoogleAuth: true
        };
        
        saveUserData(userData);
        
        // Redirect to complete profile
        setTimeout(() => {
            window.location.href = 'complete-profile.html';
        }, 500);
    } catch (error) {
        console.error("Google Sign Up Error:", error);
        showToast("Sign up failed: " + error.message, "error");
    }
}

// Google Sign In for Login
async function googleSignInFlow() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if user has completed setup
        const userData = getUserData();
        
        if (userData && hasCompletedProfile() && hasPIN()) {
            // User has completed all steps, go to dashboard
            localStorage.setItem('userData', JSON.stringify({
                ...userData,
                email: user.email,
                uid: user.uid,
                isGoogleAuth: true
            }));
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            // User needs to complete profile
            localStorage.setItem('userData', JSON.stringify({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid,
                isGoogleAuth: true
            }));
            setTimeout(() => {
                window.location.href = 'complete-profile.html';
            }, 500);
        }
    } catch (error) {
        console.error("Google Sign In Error:", error);
        showToast("Sign in failed: " + error.message, "error");
    }
}

// Email/Password Login
async function emailPasswordLogin(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        const userData = {
            email: user.email,
            uid: user.uid,
            isGoogleAuth: false
        };
        
        saveUserData(userData);
        
        // Go to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

// Export functions
window.googleSignUpFlow = googleSignUpFlow;
window.googleSignInFlow = googleSignInFlow;
window.emailPasswordLogin = emailPasswordLogin;
window.getUserData = getUserData;
window.saveUserData = saveUserData;
window.hasCompletedProfile = hasCompletedProfile;
window.hasPIN = hasPIN;
