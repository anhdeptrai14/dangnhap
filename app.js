import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = { 
    apiKey: "AIzaSyBjvnwBe7TCQPvL0xs4vy9N9UBOKCnEN2Q", 
    authDomain: "dangnhap1-c4cc0.firebaseapp.com", 
    projectId: "dangnhap1-c4cc0" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 1. CON MẮT MẬT KHẨU (Javascript thuần)
const eyeBtn = document.getElementById('eye');
const passwordInput = document.getElementById('password-input');
if (eyeBtn) {
    eyeBtn.onclick = () => {
        const icon = eyeBtn.querySelector('i');
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'fas fa-eye' : 'far fa-eye-slash';
    };
}

// 2. FIX TỰ ĐỘNG ĐĂNG NHẬP
onAuthStateChanged(auth, (user) => {
    if (user && localStorage.getItem('isForceLogout') !== 'true') {
        window.parent.postMessage({ 
            status: 'logged_in', 
            name: user.displayName || user.email.split('@')[0], 
            avatar: user.photoURL || "https://i.imgur.com/3Z0o7v7.png", 
            uid: user.uid 
        }, "*");
    } else if (user && localStorage.getItem('isForceLogout') === 'true') {
        signOut(auth);
    }
});

const unlock = () => localStorage.removeItem('isForceLogout');

document.getElementById('btn-login-google').onclick = () => { unlock(); signInWithPopup(auth, provider); };
document.getElementById('btn-login-email').onclick = () => {
    unlock();
    signInWithEmailAndPassword(auth, document.getElementById('email-input').value, passwordInput.value)
    .catch(() => document.getElementById('error-msg').style.display = 'block');
};

window.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'request_logout') {
        localStorage.setItem('isForceLogout', 'true');
        signOut(auth).then(() => {
            window.parent.postMessage({ status: 'logged_out' }, "*");
            location.reload();
        });
    }
});
