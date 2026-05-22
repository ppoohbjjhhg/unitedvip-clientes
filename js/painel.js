import { db, auth } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const listaClientes =
  document.getElementById("listaClientes");

const logoutBtn =
  document.getElementById("logoutBtn");

// Verificar login
onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "login.html";

    return;
  }

  carregarClientes();

});

// Logout
logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});

// Buscar clientes
async function carregarClientes() {

  listaClientes.innerHTML = "";

  const querySnapshot =
    await getDocs(collection(db, "clientes"));

  querySnapshot.forEach((doc) => {

    const cliente = doc.data();

    listaClientes.innerHTML += `

      <div class="cliente">

        <h2>
          ${cliente.primeiroNome}
          ${cliente.segundoNome}
        </h2>

        <p>
          WhatsApp:
          ${cliente.whatsapp}
        </p>

        <p>
          Idade:
          ${cliente.idade}
        </p>

        <p>
          Plano:
          ${cliente.plano}
        </p>

        <p>
          Pagamento:
          ${cliente.pagamento}
        </p>

        <p>
          Origem:
          ${cliente.origem}
        </p>

        <p>
          Indicação:
          ${cliente.indicadoPor}
        </p>

        <p>
          Status:
          ${cliente.status}
        </p>

      </div>

    `;

  });

}