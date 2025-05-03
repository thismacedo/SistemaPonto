const apiUrl = "http://localhost:5086/api";

async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Por favor, preencha o email e a senha.");
    return;
  }

  console.log("Tentando login com:", { email, senha });
  try {
    const response = await fetch(`${apiUrl}/Usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    console.log("Resposta:", response.status, response.statusText);

    if (response.ok) {
      const usuario = await response.json();
      console.log("Usuário logado:", usuario);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      mostrarTelaUsuario(usuario);
    } else {
      const error = await response.json();
      console.warn("Falha no login:", response.status, error.message);
      alert(error.message || "Email ou senha incorretos. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert(
      "Erro ao conectar com o servidor. Verifique sua conexão e tente novamente."
    );
  }
}

function mostrarTelaUsuario(usuario) {
  document.getElementById("login").style.display = "none";
  document.getElementById("nomeUsuario").textContent = usuario.Nome;
  if (usuario.IsAdmin) {
    document.getElementById("admin").style.display = "block";
    carregarMarcacoesAdmin();
  } else {
    document.getElementById("usuario").style.display = "block";
    carregarMarcacoesUsuario(usuario.Id);
  }
}

/* thismacedo - verificando a entrada, retornando erro.
async function registrarEntrada() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const response = await fetch(`${apiUrl}/MarcacoesPonto/entrada`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario.Id),
  });
  if (response.ok) {
    carregarMarcacoesUsuario(usuario.Id);
  }
}
*/

async function registrarEntrada() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  console.log("Usuário:", usuario);
  const usuarioId = usuario.id || usuario.Id;
  if (!usuarioId) {
    console.error("usuarioId não encontrado");
    alert("Erro: ID do usuário não encontrado");
    return;
  }
  const response = await fetch(`${apiUrl}/MarcacoesPonto/entrada`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId }), // Envia como objeto
  });
  if (response.ok) {
    carregarMarcacoesUsuario(usuarioId);
  } else {
    console.error("Erro ao registrar entrada:", await response.text());
    alert("Erro ao registrar entrada: " + (await response.text()));
  }
}

async function registrarSaida() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  console.log("Usuário:", usuario);
  const usuarioId = usuario.id || usuario.Id;
  if (!usuarioId) {
    console.error("usuarioId não encontrado");
    alert("Erro: ID do usuário não encontrado");
    return;
  }
  try {
    const response = await fetch(
      `${apiUrl}/MarcacoesPonto/usuario/${usuarioId}`
    );
    if (!response.ok) {
      console.error("Erro ao buscar marcações:", await response.text());
      alert("Erro ao buscar marcações");
      return;
    }
    const marcacoes = await response.json();
    console.log("Marcações para saída:", marcacoes);
    const ultimaMarcacao = marcacoes.find((m) => !m.dataHoraSaida);
    if (ultimaMarcacao) {
      const marcacaoId = ultimaMarcacao.id || ultimaMarcacao.Id;
      if (!marcacaoId) {
        console.error("ID da marcação não encontrado:", ultimaMarcacao);
        alert("Erro: ID da marcação não encontrado");
        return;
      }
      const saidaResponse = await fetch(
        `${apiUrl}/MarcacoesPonto/saida/${marcacaoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (saidaResponse.ok) {
        carregarMarcacoesUsuario(usuarioId);
      } else {
        console.error("Erro ao registrar saída:", await saidaResponse.text());
        alert("Erro ao registrar saída");
      }
    } else {
      alert("Nenhuma entrada registrada para marcar saída");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor: " + error.message);
  }
}

/* thismacedo - marcações apresentando problema no front nos milesegundos, apesar no banco estar funcionando.

async function carregarMarcacoesUsuario(usuarioId) {
  console.log("Carregando marcações para usuarioId:", usuarioId); // Debug
  const response = await fetch(`${apiUrl}/MarcacoesPonto/usuario/${usuarioId}`);
  if (response.ok) {
    const marcacoes = await response.json();
    console.log("Marcações recebidas:", marcacoes); // Debug
    const lista = document.getElementById("marcacoes");
    lista.innerHTML = "";
    marcacoes.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = `Entrada: ${new Date(
        m.DataHoraEntrada
      ).toLocaleString()} - Saída: ${
        m.DataHoraSaida
          ? new Date(m.DataHoraSaida).toLocaleString()
          : "Pendente"
      }`;
      lista.appendChild(li);
    });
  } else {
    console.error("Erro ao carregar marcações:", await response.text());
  }
}
*/

async function carregarMarcacoesUsuario(usuarioId) {
  console.log("Carregando marcações para usuarioId:", usuarioId);
  const response = await fetch(`${apiUrl}/MarcacoesPonto/usuario/${usuarioId}`);
  if (response.ok) {
    const marcacoes = await response.json();
    console.log("Marcações recebidas:", marcacoes);
    const lista = document.getElementById("marcacoes");
    lista.innerHTML = "";
    marcacoes.forEach((m) => {
      const li = document.createElement("li");
      // Normalizar a data removendo frações de segundos muito precisas
      const entrada = new Date(m.dataHoraEntrada.replace(/(\.\d{3})\d+/, "$1"));
      const saida = m.dataHoraSaida
        ? new Date(m.dataHoraSaida.replace(/(\.\d{3})\d+/, "$1"))
        : "Pendente";
      li.textContent = `Entrada: ${entrada.toLocaleString("pt-BR")} - Saída: ${
        saida.toLocaleString ? saida.toLocaleString("pt-BR") : saida
      }`;
      lista.appendChild(li);
    });
  } else {
    console.error("Erro ao carregar marcações:", await response.text());
  }
}

async function carregarMarcacoesAdmin() {
  const response = await fetch(`${apiUrl}/MarcacoesPonto/admin`);
  const marcacoes = await response.json();
  const lista = document.getElementById("marcacoesAdmin");
  lista.innerHTML = "";
  marcacoes.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = `${m.Usuario.Nome} - Entrada: ${new Date(
      m.DataHoraEntrada
    ).toLocaleString()} - Saída: ${
      m.DataHoraSaida ? new Date(m.DataHoraSaida).toLocaleString() : "Pendente"
    }`;
    lista.appendChild(li);
  });
}

async function exportarExcel() {
  window.location.href = `${apiUrl}/MarcacoesPonto/export`;
}

window.onload = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario) {
    mostrarTelaUsuario(usuario);
  }
};
