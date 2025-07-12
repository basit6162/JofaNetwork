// Initialize Firebase
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

const user = firebase.auth().currentUser;
const userRef = db.collection('users').doc(user.uid);

// Save or update profile details in Firestore
function saveProfile() {
    const username = document.getElementById('username').value;
    const walletAddress = document.getElementById('walletAddress').value;

    userRef.set({
        username: username,
        walletAddress: walletAddress || null
    }, { merge: true }).then(() => {
        alert('Profile updated successfully!');
    }).catch((error) => {
        alert(error.message);
    });
}

// Fetch and display user details, including referral code
userRef.get().then((doc) => {
    if (doc.exists) {
        document.getElementById('username').value = doc.data().username;
        document.getElementById('walletAddress').value = doc.data().walletAddress || '';
        document.getElementById('referralCode').innerText = doc.id;  // Referral code is the user document ID
    }
});

// Share referral code via different platforms
function shareReferral(platform) {
    const referralCode = document.getElementById('referralCode').innerText;
    let url;

    switch (platform) {
        case 'whatsapp':
            url = `https://wa.me/?text=Join%20the%20mining%20platform%20and%20earn%20tokens.%20Referral%20code%3A%20${referralCode}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=https://your-app-link.com&quote=Join%20the%20mining%20platform%20using%20this%20referral%20code%3A%20${referralCode}`;
            break;
        case 'telegram':
            url = `https://t.me/share/url?url=https://your-app-link.com&text=Join%20the%20mining%20platform%20with%20this%20referral%20code%3A%20${referralCode}`;
            break;
        default:
            break;
    }

    if (url) {
        window.open(url, '_blank');
    }
}
