import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );

    alert("Login realizado!");

    window.location.href = "painel.html";

  } catch (error) {

    alert("Email ou senha inválidos.");

    console.log(error);

  }

});