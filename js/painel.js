import { db, auth } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const listaClientes = document.getElementById("listaClientes");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  carregarClientes();
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

async function carregarClientes() {
  listaClientes.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "clientes"));

  if (querySnapshot.empty) {
    listaClientes.innerHTML = `<p class="subtitle">Nenhum cliente cadastrado.</p>`;
    return;
  }

  querySnapshot.forEach((documento) => {
    const cliente = documento.data();
    const idCliente = documento.id;

    listaClientes.innerHTML += `
      <div class="cliente">
        <div class="cliente-topo">
          <div>
            <h2>${cliente.primeiroNome} ${cliente.segundoNome}</h2>

            <p><strong>WhatsApp:</strong> ${cliente.whatsapp}</p>
            <p><strong>Idade:</strong> ${cliente.idade}</p>
            <p><strong>Plano:</strong> ${cliente.plano}</p>
            <p><strong>Pagamento:</strong> ${cliente.pagamento}</p>
            <p><strong>Origem:</strong> ${cliente.origem}</p>
            <p><strong>Indicação:</strong> ${cliente.indicadoPor}</p>
            <p><strong>Status:</strong> ${cliente.status}</p>
          </div>
        </div>

        <div class="acoes">
          <button class="btn-excluir" data-id="${idCliente}">
            Excluir cadastro
          </button>
        </div>
      </div>
    `;
  });

  ativarBotoesExcluir();
}

function ativarBotoesExcluir() {
  const botoesExcluir = document.querySelectorAll(".btn-excluir");

  botoesExcluir.forEach((botao) => {
    botao.addEventListener("click", async () => {
      const idCliente = botao.getAttribute("data-id");

      const confirmar = confirm(
        "Tem certeza que deseja apagar este cadastro? Essa ação não poderá ser desfeita."
      );

      if (!confirmar) return;

      try {
        await deleteDoc(doc(db, "clientes", idCliente));

        alert("Cadastro apagado com sucesso!");

        carregarClientes();
      } catch (error) {
        console.log(error);
        alert("Erro ao apagar cadastro.");
      }
    });
  });
}