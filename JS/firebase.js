// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfyR7YQl0iVK91RkXnbfSzVpuQ_gpPMmk",
  authDomain: "unitedvip-clientes.firebaseapp.com",
  projectId: "unitedvip-clientes",
  storageBucket: "unitedvip-clientes.firebasestorage.app",
  messagingSenderId: "886929350933",
  appId: "1:886929350933:web:73b14fdc47b6e925f4c91c",
  measurementId: "G-04PD9991GX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);