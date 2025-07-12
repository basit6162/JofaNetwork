// Initialize Firebase (only once)
const firebaseConfig = {
  apiKey: "AIzaSyC7f9y43FTWklNNYVE5TrEKoqlSMt3Nv8U",
  authDomain: "simulatedminingapp.firebaseapp.com",
  projectId: "simulatedminingapp",
  storageBucket: "simulatedminingapp.appspot.com",
  messagingSenderId: "1075873844477",
  appId: "1:1075873844477:web:4b16da1ccb420ccb25c294"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const referralCodeInput = document.getElementById("referralCode").value.trim().toLowerCase();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    // Create user
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Send verification email
    await user.sendEmailVerification();

    let referredByUID = null;
    let referredByCode = "";

    // If referral code provided, resolve to UID and increment referrals
    if (referralCodeInput) {
      const refDoc = await db.collection("usernames").doc(referralCodeInput).get();
      if (refDoc.exists) {
        referredByUID = refDoc.data().uid;
        referredByCode = referralCodeInput;

        // Increment inviter's referral count and optionally boost their rate
        const inviterRef = db.collection("users").doc(referredByUID);
        const inviterSnap = await inviterRef.get();

        if (inviterSnap.exists) {
          await inviterRef.update({
            referrals: firebase.firestore.FieldValue.increment(1)
          });
        }
      } else {
        alert("⚠️ Referral code not found. Signing up without referral.");
      }
    }



    // Create user Firestore document
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      referralCode: "",             // will be set later after user picks username
      referredBy: referredByCode,   // store username (not UID)
      referrals: 0,
      totalEarned: 0,
      miningStart: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      solanaWallet: "",
      lastMiningSession: null,
      username: ""                  // to be set in dashboard
    });

    alert("🎉 Signed up successfully! Please verify your email before logging in.");
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Signup Error:", error);
    alert(error.message);
  }

  async function handleSignup() {
    // ... your existing signup logic ...

    // After successful signup, request notification permission
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");
      // Optional: Save permission status to Firestore
      await db.collection("users").doc(user.uid).update({
        hasNotificationPermission: true
      });
    }
  }
});