import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const formCliente = document.getElementById("formCliente");

formCliente.addEventListener("submit", async (e) => {

  e.preventDefault();

  const primeiroNome =
    document.getElementById("primeiroNome").value;

  const segundoNome =
    document.getElementById("segundoNome").value;

  const whatsapp =
    document.getElementById("whatsapp").value;

  const idade =
    document.getElementById("idade").value;

  const dataAssinatura =
    document.getElementById("dataAssinatura").value;

  const plano =
    document.getElementById("plano").value;

  const pagamento =
    document.getElementById("pagamento").value;

  const origemSelecionada =
    document.querySelector("input[name='origem']:checked");

  const nomeIndicacao =
    document.getElementById("nomeIndicacao").value;

  try {

    await addDoc(collection(db, "clientes"), {

      primeiroNome,
      segundoNome,
      whatsapp,
      idade,
      dataAssinatura,
      plano,
      pagamento,

      origem:
        origemSelecionada
        ? origemSelecionada.value
        : "",

      indicadoPor:
        nomeIndicacao || "Não informado",

      status: "Ativo",

      criadoEm: new Date()

    });

    alert("Cliente cadastrado!");

    formCliente.reset();

  } catch (error) {

    console.log(error);

    alert("Erro ao cadastrar.");

  }

});