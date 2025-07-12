// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7f9y43FTWklNNYVE5TrEKoqlSMt3Nv8U",
    authDomain: "simulatedminingapp.firebaseapp.com",
    projectId: "simulatedminingapp",
    storageBucket: "simulatedminingapp.firebasestorage.app",
    messagingSenderId: "1075873844477",
    appId: "1:1075873844477:web:4b16da1ccb420ccb25c294"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const errorMessage = document.getElementById("errorMessage");

// Toggle between sign-up and sign-in forms
function toggleForm() {
    const signUpForm = document.getElementById("signUpForm");
    const signInForm = document.getElementById("signInForm");
    signUpForm.style.display = signUpForm.style.display === "none" ? "block" : "none";
    signInForm.style.display = signInForm.style.display === "none" ? "block" : "none";
}

// Handle Sign In
function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                window.location.href = 'dashboard.html'; // Redirect to dashboard after successful login
            } else {
                errorMessage.textContent = "Please verify your email first.";
            }
        })
        .catch((error) => {
            errorMessage.textContent = error.message; // Show the error message
        });
}

// Handle Sign Up
function signUp() {
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            user.sendEmailVerification().then(() => {
                errorMessage.textContent = "Please check your email to verify your account!";
                toggleForm();
            });
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
}

// Password Reset (Forgot Password)
function forgotPassword() {
    const email = document.getElementById("email").value;
    if (!email) {
        errorMessage.textContent = "Please enter your email address.";
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            errorMessage.textContent = "Password reset email sent. Check your inbox!";
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
}

// Sign In with Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            if (user.emailVerified) {
                window.location.href = 'dashboard.html'; // Redirect to dashboard after successful login
            } else {
                errorMessage.textContent = "Please verify your email first.";
            }
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
}
