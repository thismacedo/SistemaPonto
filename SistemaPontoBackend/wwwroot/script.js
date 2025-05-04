const apiUrl = "http://localhost:5086/api";

// Função auxiliar para obter o ID do usuário logado
function getUsuarioId() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  return usuario.id || usuario.Id;
}

// Função para limpar as marcações visualmente
function limparVisualizacao(elementId) {
  const lista = document.getElementById(elementId);
  if (lista) {
    // Verificamos se tem itens para limpar
    if (lista.children.length > 0) {
      lista.innerHTML = "";
      const li = document.createElement("li");
      li.className = "info-message";
      li.textContent =
        "Visualização limpa. Clique em 'Atualizar' para ver novamente as marcações.";
      lista.appendChild(li);
      alert("Visualização limpa com sucesso!");
    } else {
      alert("Não há marcações para limpar.");
    }
  }
}

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
  document.getElementById("nomeUsuario").textContent =
    usuario.Nome || usuario.nome;

  // Normalizar o campo isAdmin para tratar maiúsculas/minúsculas
  const isAdmin = usuario.IsAdmin || usuario.isAdmin;

  if (isAdmin) {
    document.getElementById("admin").style.display = "block";
    carregarMarcacoesAdmin();
  } else {
    document.getElementById("usuario").style.display = "block";
  }

  // Carregamos as marcações independentemente de ser admin ou não
  const usuarioId = usuario.Id || usuario.id;
  carregarMarcacoesUsuario(usuarioId);
}

async function registrarEntrada() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  console.log("Usuário:", usuario);
  const usuarioId = usuario.id || usuario.Id;
  if (!usuarioId) {
    console.error("usuarioId não encontrado");
    alert("Erro: ID do usuário não encontrado");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/MarcacoesPonto/entrada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId }), // Envia como objeto
    });

    if (response.ok) {
      alert("Entrada registrada com sucesso!");
      carregarMarcacoesUsuario(usuarioId);
    } else {
      console.error("Erro ao registrar entrada:", await response.text());
      alert("Erro ao registrar entrada: " + (await response.text()));
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor: " + error.message);
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
        alert("Saída registrada com sucesso!");
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

async function carregarMarcacoesUsuario(usuarioId) {
  console.log("Carregando marcações para usuarioId:", usuarioId);

  try {
    const response = await fetch(
      `${apiUrl}/MarcacoesPonto/usuario/${usuarioId}`
    );

    if (response.ok) {
      const marcacoes = await response.json();
      console.log("Marcações recebidas:", marcacoes);

      const lista = document.getElementById("marcacoes");
      lista.innerHTML = "";

      if (marcacoes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhuma marcação encontrada";
        lista.appendChild(li);
        return;
      }

      marcacoes.forEach((m) => {
        const li = document.createElement("li");
        // Normalizar a data removendo frações de segundos muito precisas
        const entrada = new Date(m.dataHoraEntrada || m.DataHoraEntrada);

        let saida = "Pendente";
        if (m.dataHoraSaida || m.DataHoraSaida) {
          saida = new Date(m.dataHoraSaida || m.DataHoraSaida);
          saida = saida.toLocaleString("pt-BR");
        }

        li.textContent = `Entrada: ${entrada.toLocaleString(
          "pt-BR"
        )} - Saída: ${saida}`;
        lista.appendChild(li);
      });
    } else {
      console.error("Erro ao carregar marcações:", await response.text());
      alert("Erro ao carregar marcações do usuário");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor: " + error.message);
  }
}

async function carregarMarcacoesAdmin() {
  try {
    const response = await fetch(`${apiUrl}/MarcacoesPonto/admin`);

    if (response.ok) {
      const marcacoes = await response.json();
      console.log("Marcações admin recebidas:", marcacoes);

      const lista = document.getElementById("marcacoesAdmin");
      lista.innerHTML = "";

      if (marcacoes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhuma marcação encontrada";
        lista.appendChild(li);
        return;
      }

      marcacoes.forEach((m) => {
        const li = document.createElement("li");
        const usuario = m.Usuario || m.usuario;
        const entrada = new Date(m.DataHoraEntrada || m.dataHoraEntrada);

        let saida = "Pendente";
        if (m.DataHoraSaida || m.dataHoraSaida) {
          saida = new Date(m.DataHoraSaida || m.dataHoraSaida);
          saida = saida.toLocaleString("pt-BR");
        }

        li.textContent = `${
          usuario.Nome || usuario.nome
        } - Entrada: ${entrada.toLocaleString("pt-BR")} - Saída: ${saida}`;
        lista.appendChild(li);
      });
    } else {
      console.error("Erro ao carregar marcações admin:", await response.text());
      alert("Erro ao carregar todas as marcações");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor: " + error.message);
  }
}

async function exportarRelatorio() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  // Normalizar o campo isAdmin para tratar maiúsculas/minúsculas
  const isAdmin = usuario.IsAdmin || usuario.isAdmin;

  if (!usuario || !isAdmin) {
    alert("Acesso negado. Apenas administradores podem exportar relatórios.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/MarcacoesPonto/export`, {
      method: "GET",
      headers: { Accept: "application/octet-stream" },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio_marcacoes.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      alert("Relatório exportado com sucesso!");
    } else {
      console.error("Erro ao exportar relatório:", await response.text());
      alert("Erro ao exportar relatório.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao conectar com o servidor.");
  }
}

window.onload = () => {
  const usuarioString = localStorage.getItem("usuario");
  if (usuarioString) {
    try {
      const usuario = JSON.parse(usuarioString);
      mostrarTelaUsuario(usuario);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      localStorage.removeItem("usuario");
    }
  }
};
