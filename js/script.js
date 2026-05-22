const formCliente = document.getElementById("formCliente");

const btnCadastro = document.getElementById("btnCadastro");
const btnPainel = document.getElementById("btnPainel");

const areaCadastro = document.getElementById("areaCadastro");
const areaPainel = document.getElementById("areaPainel");

const areaIndicacao = document.getElementById("areaIndicacao");
const nomeIndicacao = document.getElementById("nomeIndicacao");

const listaClientes = document.getElementById("listaClientes");
const buscaCliente = document.getElementById("buscaCliente");
const filtroStatus = document.getElementById("filtroStatus");

let clientes = JSON.parse(localStorage.getItem("clientesUnitedVip")) || [];

btnCadastro.addEventListener("click", () => {
  areaCadastro.classList.remove("hidden");
  areaPainel.classList.add("hidden");
});

btnPainel.addEventListener("click", () => {
  areaCadastro.classList.add("hidden");
  areaPainel.classList.remove("hidden");
  renderizarClientes();
});

document.querySelectorAll("input[name='origem']").forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "Indicação" && radio.checked) {
      areaIndicacao.classList.remove("hidden");
    } else if (radio.checked) {
      areaIndicacao.classList.add("hidden");
      nomeIndicacao.value = "";
    }
  });
});

formCliente.addEventListener("submit", (event) => {
  event.preventDefault();

  const primeiroNome = document.getElementById("primeiroNome");
  const segundoNome = document.getElementById("segundoNome");
  const whatsapp = document.getElementById("whatsapp");
  const idade = document.getElementById("idade");
  const dataAssinatura = document.getElementById("dataAssinatura");
  const plano = document.getElementById("plano");
  const pagamento = document.getElementById("pagamento");
  const origemSelecionada = document.querySelector("input[name='origem']:checked");
  const erroOrigem = document.getElementById("erroOrigem");

  limparErros();

  let valido = true;

  if (primeiroNome.value.trim().length < 2) {
    mostrarErro(primeiroNome, "Digite o primeiro nome.");
    valido = false;
  }

  if (segundoNome.value.trim().length < 2) {
    mostrarErro(segundoNome, "Digite o segundo nome.");
    valido = false;
  }

  if (whatsapp.value.trim().length < 14) {
    mostrarErro(whatsapp, "Digite um WhatsApp válido.");
    valido = false;
  }

  if (!idade.value || Number(idade.value) < 10) {
    mostrarErro(idade, "Digite uma idade válida.");
    valido = false;
  }

  if (!dataAssinatura.value) {
    mostrarErro(dataAssinatura, "Informe o dia da assinatura.");
    valido = false;
  }

  if (!plano.value) {
    mostrarErro(plano, "Selecione um plano.");
    valido = false;
  }

  if (!pagamento.value) {
    mostrarErro(pagamento, "Selecione a forma de pagamento.");
    valido = false;
  }

  if (!origemSelecionada) {
    erroOrigem.textContent = "Selecione onde o cliente achou a UnitedVip.";
    valido = false;
  }

  if (
    origemSelecionada &&
    origemSelecionada.value === "Indicação" &&
    nomeIndicacao.value.trim().length < 2
  ) {
    mostrarErro(nomeIndicacao, "Informe o nome de quem indicou.");
    valido = false;
  }

  if (!valido) return;

  const novoCliente = {
    id: Date.now(),
    primeiroNome: primeiroNome.value.trim(),
    segundoNome: segundoNome.value.trim(),
    whatsapp: whatsapp.value.trim(),
    idade: idade.value,
    dataAssinatura: dataAssinatura.value,
    plano: plano.value,
    pagamento: pagamento.value,
    origem: origemSelecionada.value,
    indicadoPor:
      origemSelecionada.value === "Indicação"
        ? nomeIndicacao.value.trim()
        : "Não informado",
    status: "Ativo"
  };

  clientes.push(novoCliente);
  salvarClientes();

  alert("Cliente cadastrado com sucesso!");

  formCliente.reset();
  areaIndicacao.classList.add("hidden");

  areaCadastro.classList.add("hidden");
  areaPainel.classList.remove("hidden");

  renderizarClientes();
});

function renderizarClientes() {
  listaClientes.innerHTML = "";

  const termo = buscaCliente.value.toLowerCase();
  const statusFiltro = filtroStatus.value;

  const clientesFiltrados = clientes.filter((cliente) => {
    const nomeCompleto = `${cliente.primeiroNome} ${cliente.segundoNome}`.toLowerCase();

    const combinaNome = nomeCompleto.includes(termo);
    const combinaStatus =
      statusFiltro === "todos" || cliente.status === statusFiltro;

    return combinaNome && combinaStatus;
  });

  atualizarEstatisticas();

  if (clientesFiltrados.length === 0) {
    listaClientes.innerHTML = `<p class="subtitle">Nenhum cliente encontrado.</p>`;
    return;
  }

  clientesFiltrados.forEach((cliente) => {
    const card = document.createElement("div");
    card.classList.add("cliente");

    card.innerHTML = `
      <div class="cliente-topo">
        <div>
          <h3>${cliente.primeiroNome} ${cliente.segundoNome}</h3>
          <p><strong>WhatsApp:</strong> ${cliente.whatsapp}</p>
          <p><strong>Idade:</strong> ${cliente.idade} anos</p>
          <p><strong>Assinou em:</strong> ${formatarData(cliente.dataAssinatura)}</p>
          <p><strong>Plano:</strong> ${cliente.plano}</p>
          <p><strong>Pagamento:</strong> ${cliente.pagamento}</p>
          <p><strong>Origem:</strong> ${cliente.origem}</p>
          <p><strong>Indicado por:</strong> ${cliente.indicadoPor}</p>
        </div>

        <span class="status ${cliente.status === "Ativo" ? "ativo" : "inativo"}">
          ${cliente.status}
        </span>
      </div>

      <div class="acoes">
        <button class="btn-status" onclick="alterarStatus(${cliente.id})">
          Alterar status
        </button>

        <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">
          Excluir
        </button>
      </div>
    `;

    listaClientes.appendChild(card);
  });
}

function alterarStatus(id) {
  clientes = clientes.map((cliente) => {
    if (cliente.id === id) {
      cliente.status = cliente.status === "Ativo" ? "Inativo" : "Ativo";
    }

    return cliente;
  });

  salvarClientes();
  renderizarClientes();
}

function excluirCliente(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este cliente?");

  if (!confirmar) return;

  clientes = clientes.filter((cliente) => cliente.id !== id);

  salvarClientes();
  renderizarClientes();
}

function atualizarEstatisticas() {
  const total = clientes.length;
  const ativos = clientes.filter((cliente) => cliente.status === "Ativo").length;
  const inativos = clientes.filter((cliente) => cliente.status === "Inativo").length;

  document.getElementById("totalClientes").textContent = total;
  document.getElementById("clientesAtivos").textContent = ativos;
  document.getElementById("clientesInativos").textContent = inativos;
}

function salvarClientes() {
  localStorage.setItem("clientesUnitedVip", JSON.stringify(clientes));
}

function mostrarErro(input, mensagem) {
  input.classList.add("erro");

  const small = input.parentElement.querySelector("small");
  if (small) {
    small.textContent = mensagem;
  }
}

function limparErros() {
  document.querySelectorAll("input, select").forEach((campo) => {
    campo.classList.remove("erro");
  });

  document.querySelectorAll("small").forEach((small) => {
    small.textContent = "";
  });
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

buscaCliente.addEventListener("input", renderizarClientes);
filtroStatus.addEventListener("change", renderizarClientes);

const whatsappInput = document.getElementById("whatsapp");

whatsappInput.addEventListener("input", () => {
  let valor = whatsappInput.value.replace(/\D/g, "");

  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  if (valor.length > 6) {
    whatsappInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  } else if (valor.length > 2) {
    whatsappInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else {
    whatsappInput.value = valor;
  }
});

renderizarClientes();