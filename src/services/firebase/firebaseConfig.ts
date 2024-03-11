import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAmkfbCwQb2GfD5RD-y04-utN-FQ1qy2OA",
  authDomain: "tickets-register.firebaseapp.com",
  projectId: "tickets-register",
  storageBucket: "tickets-register.appspot.com",
  messagingSenderId: "578162268580",
  appId: "1:578162268580:web:b18f5c4291da6580880931"
};


export const app = initializeApp(firebaseConfig);