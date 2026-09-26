// ============================================================
// VARIÁVEIS PRINCIPAIS DO APLICATIVO
// ============================================================

// Guarda a palavra ou frase que o usuário selecionou.
let textoSelecionado = "";

// Guarda a tradução da palavra ou frase selecionada.
let textoTraduzido = "";

// Define a velocidade inicial da fala.
// 0.8 significa 80% da velocidade normal.
let velocidadeFala = 0.8;

// Guarda o identificador do intervalo usado pela repetição.
let intervaloRepeticao = null;

// VÁRIAVEIS DO BUTTON MINHAS PALAVRAS SALVAS.

// CONTROLE DOS BOTÕES DE FAVORITOS

// Guarda qual botão de favorito está falando.
let botaoFavoritoFalando = null;

// Guarda a fala atual do favorito.
let falaFavoritoAtual = null;

// ============================================================
// FUNÇÃO PARA PEGAR O TEXTO SELECIONADO
// ============================================================

function pegarSelecao() {
  // Pega o elemento textarea pelo seu ID.
  const texto = document.getElementById("textoUsuario");

  // Pega a posição inicial da seleção dentro do textarea.
  const inicio = texto.selectionStart;

  // Pega a posição final da seleção dentro do textarea.
  const fim = texto.selectionEnd;

  // Pega somente o trecho que foi selecionado.
  textoSelecionado = texto.value.substring(inicio, fim).trim();

  // Verifica se o usuário realmente selecionou alguma coisa.
  if (!textoSelecionado) {
    // Mostra um aviso caso nada tenha sido selecionado.
    alert("Selecione uma palavra ou frase primeiro.");

    // Informa que não foi possível pegar uma seleção.
    return false;
  }

  // Mostra o texto selecionado na área de resultado.
  document.getElementById("selecionado").innerText = textoSelecionado;

  // Informa que a seleção foi encontrada corretamente.
  return true;
}

// ============================================================
// DIMINUIR A VELOCIDADE DA FALA
// ============================================================

function diminuirVelocidade() {
  // Verifica se a velocidade ainda pode diminuir.
  if (velocidadeFala > 0.5) {
    // Diminui a velocidade em 0.1.
    velocidadeFala -= 0.1;

    // Atualiza o número mostrado na tela.
    atualizarVelocidade();
  }
}

// ============================================================
// AUMENTAR A VELOCIDADE DA FALA
// ============================================================

function aumentarVelocidade() {
  // Verifica se a velocidade ainda pode aumentar.
  if (velocidadeFala < 2.0) {
    // Aumenta a velocidade em 0.1.
    velocidadeFala += 0.1;

    // Atualiza o número mostrado na tela.
    atualizarVelocidade();
  }
}

// ============================================================
// ATUALIZA O VALOR DA VELOCIDADE NA TELA
// ============================================================

function atualizarVelocidade() {
  // Procura o elemento que mostra a velocidade.
  document.getElementById("velocidade").textContent =
    // Converte a velocidade para uma casa decimal
    // e acrescenta a letra "x".
    velocidadeFala.toFixed(1) + "x";
}

// ============================================================
// SELECIONAR TODO O TEXTO
// ============================================================

function selecionarTexto() {
  // Pega o textarea pelo ID.
  const texto = document.getElementById("textoUsuario");

  // Coloca o cursor dentro do textarea.
  texto.focus();

  // Seleciona todo o conteúdo do textarea.
  texto.select();
}

// ============================================================
// LIMPAR O TEXTO
// ============================================================

function limparTexto() {
  // Pega o textarea e apaga todo o seu conteúdo.
  document.getElementById("textoUsuario").value = "";

  // Limpa também a variável que guarda a seleção.
  textoSelecionado = "";

  // Limpa a tradução que estava armazenada.
  textoTraduzido = "";

  // Volta a mensagem da área de texto selecionado.
  document.getElementById("selecionado").textContent =
    "Nenhum texto selecionado";

  // Volta a mensagem inicial da tradução.
  document.getElementById("traducao").textContent = "A tradução aparecerá aqui";
}

// ============================================================
// COLAR TEXTO
// ============================================================

async function colarTexto() {
  // Tenta acessar a área de transferência do computador/celular.
  try {
    // Lê o texto que está copiado.
    const texto = await navigator.clipboard.readText();

    // Coloca o texto copiado dentro do textarea.
    document.getElementById("textoUsuario").value = texto;
  } catch (erro) {
    // Caso aconteça algum problema...
    // Mostra uma mensagem para o usuário.
    alert("Não foi possível acessar a área de transferência.");
  }
}

// ============================================================
// FUNÇÃO DE TRADUÇÃO
// ============================================================

async function traduzir() {
  // Tenta pegar a palavra ou frase selecionada.
  if (!pegarSelecao()) {
    // Para a função caso nada tenha sido selecionado.
    return;
  }

  // Mostra "Traduzindo..." enquanto aguardamos a resposta.
  document.getElementById("traducao").innerText = "Traduzindo...";

  // Tenta fazer a tradução.
  try {
    // Monta o endereço da API de tradução.
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(textoSelecionado) +
      "&langpair=en|pt";

    // Envia uma solicitação para a API.
    const resposta = await fetch(url);

    // Converte a resposta para JSON.
    const dados = await resposta.json();

    // Guarda a tradução na variável.
    textoTraduzido = dados.responseData.translatedText;

    // Mostra a tradução na tela.
    document.getElementById("traducao").innerText = textoTraduzido;
  } catch (erro) {
    // Caso aconteça algum erro...
    // Mostra o erro no console do navegador.
    console.error(erro);

    // Mostra uma mensagem para o usuário.
    document.getElementById("traducao").innerText =
      "Erro ao realizar a tradução.";
  }
}

// ============================================================
// OUVIR EM INGLÊS
// ============================================================

function ouvirIngles() {
  // Verifica se existe uma seleção.
  if (!textoSelecionado) {
    // Tenta pegar a seleção atual.
    if (!pegarSelecao()) {
      // Para a função se não houver seleção.
      return;
    }
  }

  // Cria um objeto responsável pela fala.
  const fala = new SpeechSynthesisUtterance(textoSelecionado);

  // Define o idioma como inglês americano.
  fala.lang = "en-US";

  // Usa a velocidade escolhida pelo usuário.
  fala.rate = velocidadeFala;

  // Cancela qualquer fala anterior.
  speechSynthesis.cancel();

  // Inicia a fala.
  speechSynthesis.speak(fala);
}

// ============================================================
// OUVIR EM PORTUGUÊS
// ============================================================

function ouvirPortugues() {
  // Verifica se já existe uma tradução.
  if (!textoTraduzido) {
    // Avisa o usuário que precisa traduzir primeiro.
    alert("Primeiro faça a tradução.");

    // Para a função.
    return;
  }

  // Cria o objeto responsável pela fala.
  const fala = new SpeechSynthesisUtterance(textoTraduzido);

  // Define o idioma como português do Brasil.
  fala.lang = "pt-BR";

  // Mantém a velocidade do português em 0.8.
  fala.rate = 0.8;

  // Cancela qualquer fala que esteja acontecendo.
  speechSynthesis.cancel();

  // Inicia a fala em português.
  speechSynthesis.speak(fala);
}

// ============================================================
// FAVORITOS
// ============================================================

function salvarFavorito() {
  // Primeiro tenta pegar exatamente o texto selecionado.
  if (!pegarSelecao()) {
    // Para a função caso não exista seleção.
    return;
  }

  // Busca os favoritos que já estão salvos no navegador.
  let favoritos =
    JSON.parse(localStorage.getItem("favoritosEnglishPractice")) || [];

  // Verifica se essa palavra/frase já está nos favoritos.
  const jaExiste = favoritos.some(function (item) {
    // Compara o texto selecionado com o texto salvo.
    return item.texto === textoSelecionado;
  });

  // Se a palavra/frase já estiver salva...
  if (jaExiste) {
    // Mostra um aviso ao usuário.
    alert("Essa palavra ou frase já está nos favoritos.");

    // Para a função para evitar duplicação.
    return;
  }

  // Cria um novo objeto para representar o favorito.
  const novoFavorito = {
    // Guarda a palavra ou frase selecionada.
    texto: textoSelecionado,

    // Guarda a tradução atual, caso exista.
    traducao: textoTraduzido || "Ainda não traduzido",
  };

  // Adiciona o novo favorito à lista.
  favoritos.push(novoFavorito);

  // Converte a lista para texto JSON
  // e salva no armazenamento do navegador.
  localStorage.setItem("favoritosEnglishPractice", JSON.stringify(favoritos));

  // Atualiza a lista mostrada na tela.
  mostrarFavoritos();

  // Informa que o favorito foi salvo.
  alert("⭐ Salvo em Minhas palavras!");
}

// ============================================================
// MOSTRAR OS FAVORITOS NA TELA
// ============================================================

function mostrarFavoritos() {
  // Pega a área onde os favoritos serão mostrados.
  const lista = document.getElementById("listaFavoritos");

  // Busca os favoritos salvos no navegador.
  const favoritos =
    JSON.parse(localStorage.getItem("favoritosEnglishPractice")) || [];

  // Limpa o conteúdo atual da lista.
  lista.innerHTML = "";

  // Verifica se ainda não existe nenhum favorito.
  if (favoritos.length === 0) {
    // Mostra a mensagem inicial.
    lista.innerHTML = "<p>Nenhuma palavra salva ainda.</p>";

    // Para a função.
    return;
  }

  // Percorre todos os favoritos salvos.
  favoritos.forEach(function (item, indice) {
    // Cria uma nova div para cada favorito.
    const div = document.createElement("div");

    // Adiciona uma classe CSS à div.
    div.className = "item-favorito";

    // Coloca o texto e a tradução dentro da div.
    div.innerHTML = `

            <strong>🇺🇸 ${item.texto}</strong>

            <p>🇧🇷 ${item.traducao}</p>

            <button class="btn-ouvir-favorito" onclick="ouvirFavorito(${indice}, this)">
                🔊 Ouvir
            </button>

            <button class="btn-ouvir-favorito" onclick="removerFavorito(${indice})">
                🗑️ Remover
            </button>

            <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;"> 
             `; //ESSE CÓDIGO PARA COLOCAR LINHA PARA SEPARAR OS FAVORITOS.

    // Adiciona a div à lista de favoritos.
    lista.appendChild(div);
  });
}

// =======================================================================================
// OUVIR UM FAVORITO
// =======================================================================================

// Função responsável por iniciar ou parar a repetição da fala.
function ouvirFavorito(indice, botao) {
  // Verifica se o botão clicado é o mesmo que já está falando.
  if (botao === botaoFavoritoFalando) {
    // Para a fala atual.
    speechSynthesis.cancel();

    // Volta o botão para "Ouvir".
    botao.innerHTML = "🔊 Ouvir";

    // Limpa o botão que estava falando.
    botaoFavoritoFalando = null;

    // Limpa a fala atual.
    falaFavoritoAtual = null;

    // Para a execução da função.
    return;
  }

  // Verifica se existe outro botão falando.
  if (botaoFavoritoFalando !== null) {
    // Para a fala anterior.
    speechSynthesis.cancel();

    // Faz o botão anterior voltar para "Ouvir".
    botaoFavoritoFalando.innerHTML = "🔊 Ouvir";

    // Limpa o botão anterior.
    botaoFavoritoFalando = null;

    // Limpa a fala anterior.
    falaFavoritoAtual = null;
  }

  // Busca os favoritos salvos no navegador.
  const favoritos =
    JSON.parse(localStorage.getItem("favoritosEnglishPractice")) || [];

  // Pega o favorito correspondente ao índice clicado.
  const favorito = favoritos[indice];

  // Verifica se o favorito existe.
  if (!favorito) {
    // Para a função caso não encontre o favorito.
    return;
  }

  // Pega o texto em inglês.
  const texto = favorito.texto;

  // Guarda qual botão está falando.
  botaoFavoritoFalando = botao;

  // Muda o botão para "Parar".
  botao.innerHTML = "⏹️ Parar";

  // ============================================================
  // FUNÇÃO QUE FAZ A FALA
  // ============================================================

  function falarFavorito() {
    // Verifica se o usuário já apertou o botão "Parar".
    if (botaoFavoritoFalando !== botao) {
      // Não faz uma nova fala.
      return;
    }

    // Cria um novo objeto de fala.
    const fala = new SpeechSynthesisUtterance(texto);

    // Define o idioma como inglês americano.
    fala.lang = "en-US";

    // Usa a velocidade escolhida no aplicativo.
    fala.rate = velocidadeFala;

    // Guarda a fala atual.
    falaFavoritoAtual = fala;

    // ========================================================
    // QUANDO A FALA TERMINAR
    // ========================================================

    fala.onend = function () {
      // Verifica se o botão ainda está ativo.
      if (botaoFavoritoFalando === botao) {
        // Começa a falar novamente.
        falarFavorito();
      }
    };

    // Inicia a fala.
    speechSynthesis.speak(fala);
  }

  // Começa a primeira fala.
  falarFavorito();
}

// ============================================================
// REMOVER UM FAVORITO
// ============================================================

function removerFavorito(indice) {
  // Busca os favoritos salvos no navegador.
  const favoritos =
    JSON.parse(localStorage.getItem("favoritosEnglishPractice")) || [];

  // Remove somente o favorito escolhido.
  favoritos.splice(indice, 1);

  // Salva novamente a lista atualizada.
  localStorage.setItem("favoritosEnglishPractice", JSON.stringify(favoritos));

  // Atualiza a lista mostrada na tela.
  mostrarFavoritos();
}

// ============================================================
// REPETIR A FALA
// ============================================================

// Pega o botão "Repetir" pelo ID.
document.getElementById("btn-repetir").addEventListener("click", () => {
  // Pega o texto que está selecionado no textarea.
  const texto = document.getElementById("textoUsuario");

  // Descobre onde começa a seleção.
  const inicio = texto.selectionStart;

  // Descobre onde termina a seleção.
  const fim = texto.selectionEnd;

  // Pega somente o texto selecionado.
  const textoParaRepetir = texto.value.substring(inicio, fim).trim();

  // Verifica se existe uma seleção.
  if (!textoParaRepetir) {
    // Mostra um aviso.
    alert("Por favor, selecione/grife uma palavra antes de clicar!");

    // Para a execução.
    return;
  }

  // Para qualquer repetição anterior.
  pararLeitura();

  // Cria a função responsável por falar.
  function falar() {
    // Cria um novo objeto de fala.
    const som = new SpeechSynthesisUtterance(textoParaRepetir);

    // Define o idioma como inglês americano.
    som.lang = "en-US";

    // Usa a velocidade escolhida.
    som.rate = velocidadeFala;

    // Executa a fala.
    window.speechSynthesis.speak(som);
  }

  // Fala imediatamente uma primeira vez.
  falar();

  // Repete a fala a cada 1 segundo.
  intervaloRepeticao = setInterval(falar, 1000);
});

// ============================================================
// PARAR A REPETIÇÃO
// ============================================================

function pararLeitura() {
  // Cancela o intervalo de repetição.
  clearInterval(intervaloRepeticao);

  // Cancela qualquer fala que esteja acontecendo.
  window.speechSynthesis.cancel();

  // Informa que não existe mais intervalo ativo.
  intervaloRepeticao = null;
}

// ============================================================
// BOTÃO PARAR
// ============================================================

// Procura o botão "Parar".
document.getElementById("btn-parar").addEventListener("click", pararLeitura);

// ============================================================
// CARREGAR OS FAVORITOS QUANDO A PÁGINA ABRIR
// ============================================================

// Executa a função assim que o JavaScript termina de carregar.
mostrarFavoritos();

// ============================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================================================

// Função responsável por mostrar uma página e esconder as outras.
function mostrarPagina(pagina) {

  // Pega a página inicial.
  const inicio = document.getElementById("pagina-inicio");

  // Pega a página de palavras salvas.
  const palavras = document.getElementById("cartao-palavra");

  // Pega a página de revisão.
  const revisao = document.getElementById("pagina-revisao");

  // Pega a página do quiz.
  const quiz = document.getElementById("pagina-quiz");

  // Primeiro esconde todas as páginas.
  inicio.classList.add("escondido");
  palavras.classList.add("escondido");
  revisao.classList.add("escondido");
  quiz.classList.add("escondido");

  // Verifica qual página o usuário escolheu.
  if (pagina === "inicio") {

    // Mostra a página inicial.
    inicio.classList.remove("escondido");

  } else if (pagina === "palavras") {

    // Mostra a página de palavras salvas.
    palavras.classList.remove("escondido");

    // Atualiza a lista de favoritos.
    mostrarFavoritos();
  } else if (pagina === "revisao") {

    // Mostra a página de revisão.
    revisao.classList.remove("escondido");
  } else if (pagina === "quiz") {

    // Mostra a página do Quiz.
    quiz.classList.remove("escondido");
  }
}
