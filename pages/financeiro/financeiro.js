
function verifyAuthentication() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // Se o usuário estiver autenticado, faça alguma coisa (ex: redirecione para a página de home)
        carregarNomes();
        carregarPsi();
      } else {
        // Se o usuário não estiver autenticado, redirecione para a página de login ou tome outra ação
        console.log('Usuário não autenticado');
        // Redirecionar para a página de login, por exemplo
        window.location.replace("../../index.html");
      }
    });
  }
  
  verifyAuthentication();
// inserir sistema de verificação de autenticação em cima
function showMenu() {
  document.getElementById("show-menu").querySelector("ul").style.display =
    "block";
}
function hideMenu() {
  document.getElementById("show-menu").querySelector("ul").style.display =
    "none";
}


  function GoToPacientes() {
    window.location.href = "../pacientes/pacientes.html";
  }
  function goToHorario() {
    window.location.href = "../home/home.html";
  }
  
  function goToDocumentos(){
    window.location.href="documentos.html"
  }
  function goToAlunos(){
    window.location.href='../alunos/alunos.html'
  }
  function goToCadastrar(){
    window.location.href='../cadastro/cadastro.html'
  
  }
  function goToFinanceiro(){
    window.location.href='../financeiro/financeiro.html'
  }


function carregarPsi(){
    const db = firebase.firestore();
    const nomesPsi = [];
    
  
    return db.collection("responsavel").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Verifica se a chave "nome" existe no documento antes de adicioná-la à array
          if (doc.data().apelido) {
            nomesPsi.push(doc.data().apelido);
          }
        });
  
        return selectPsi(nomesPsi);
      })
      .catch((error) => {
        console.error("Erro ao buscar documentos na coleção 'responsavel':", error);
        throw error; // Você pode escolher lidar com o erro de outra forma se preferir
      });
      
  }

  
 function selectPsi(nomesPsi){
    let selectPsi=document.getElementById("responsavel");


    selectPsi.innerHTML="";


     // Adiciona uma opção padrão
     const defaultOption = document.createElement("option");
     defaultOption.value = "Todos";
     defaultOption.text = "Responsável";
     selectPsi.appendChild(defaultOption);

      // Adiciona as opções dos nomes ao select
    nomesPsi.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.text = nome;
      selectPsi.appendChild(option);
  });

}

function ordenarArrayAlfabeticamente(arr) {
    // Cria uma cópia da array para evitar modificar a original
    const copiaArr = [...arr];
  
    // Usa o método sort() para ordenar a array
    copiaArr.sort((a, b) => a.localeCompare(b));
  
    return copiaArr;
  }


  
  function carregarNomes() {
    let nomes = [];

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
  
    // Busca os documentos da coleção 'agendamentos'
    return db.collection("agendamentos").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Verifica se o nome já existe no array antes de adicioná-lo
        if (!nomes.includes(doc.data().nome)) {
          nomes.push(doc.data().nome);
        }
      });
  
      // Uma vez que os nomes são buscados, popular o select
      nomes=ordenarArrayAlfabeticamente(nomes);
      popularSelect(nomes);
    });
  }
  
  // Verifique se a função já foi executada
  if (!localStorage.getItem('funcaoExecutada')) {
    // Se não tiver sido executada, execute a função e marque no localStorage
    carregarNomes().then(() => {
      localStorage.setItem('funcaoExecutada', 'true');
    });
  }

  
function popularSelect(nomes) {
    const selectNome = document.getElementById("name");
  
    // Limpa as opções existentes
    selectNome.innerHTML = "";
  
    // Adiciona uma opção padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = "Todos";
    defaultOption.text = "Todos";
    selectNome.appendChild(defaultOption);
  
    // Adiciona as opções dos nomes ao select
    nomes.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.text = nome;
        selectNome.appendChild(option);
    });
  }

  
  function FormatDate(dataToConvert) {
    let dataBrasil = dataToConvert.split("-").reverse().join("/");
  
    return dataBrasil;
}


// Lembrar de optimizar essa merda pq isso vai explodir quando o BD tiver com mais de 20K de dados em agendamentos 
function gerarFicha() {
  // Pega os parâmetros
  let paciente = document.getElementById('name').value;
  let responsavel = document.getElementById('responsavel').value;
  let dataInicio = document.getElementById('dataInicio').value; // Formato AAAA-MM-DD
  let dataFim = document.getElementById('dataFim').value;       // Formato AAAA-MM-DD
  let agendamento = document.getElementById('status').value.trim(); // Remove espaços em branco

  let parametros = [paciente, responsavel, dataInicio, dataFim, agendamento];

  // Referência à coleção "agendamentos"
  let colecao = firebase.firestore().collection("agendamentos");

  // Cria a consulta base
  let consulta = colecao;

  // Aplica o filtro para "paciente" se o parâmetro não for "todos"
  if (paciente.toLowerCase() !== 'todos') {
    consulta = consulta.where("nome", "==", paciente);
  }

  // Aplica o filtro para "responsável" se o parâmetro não for "todos"
  if (responsavel.toLowerCase() !== 'todos') {
    consulta = consulta.where("responsavel", "==", responsavel);
  }

  // Aplica o filtro para "agendamento" (status) se o parâmetro não for "todos"
  if (agendamento.toLowerCase() !== 'todos') {
    consulta = consulta.where("agendamento", "==", agendamento);
  }

  // Aplica os filtros de data (no formato AAAA-MM-DD)
  consulta = consulta
    .where("data", ">=", dataInicio)   // Formato AAAA-MM-DD
    .where("data", "<=", dataFim);     // Formato AAAA-MM-DD

  // Executa a consulta com os filtros aplicados
  consulta.get().then((querySnapshot) => {
    let resultados = []; // Array para armazenar os resultados

    // Adiciona o título das colunas
    resultados.push(["ID", "Nome", "Data", "Horário", "Responsável", "Tipo", "Valor", "Porcentagem da Clínica", "Porcentagem do Colaborador"]);

    let somaClinica = 0;
    let somaColaborador = 0;

    querySnapshot.forEach((doc) => {
      let dados = doc.data(); // Dados do documento

      let valorString = dados.valor ? dados.valor.replace("R$", "").replace(".", "").replace(",", ".").trim() : null;
      let valor = valorString ? parseFloat(valorString) : 0;

      if (!isNaN(valor)) { // Verifica se o valor é um número válido
        let porcentagemClinica = valor * 0.30;
        let porcentagemColaborador = valor * 0.70;

        // Converte a data do formato AAAA-MM-DD para DD-MM-AAAA
        let dataFormatada = formatarData(dados.data);

        let dadosDocumento = [
          doc.id,                                         // ID do documento
          dados.nome,                                     // Nome do paciente
          dataFormatada,                                  // Data no formato DD-MM-AAAA
          dados.horario,                                  // Horário
          dados.responsavel,                              // Responsável
          dados.tipo,                                     // Tipo
          `R$ ${valor.toFixed(2).replace(".", ",")}`,     // Valor, formatado como string com duas casas decimais
          `R$ ${porcentagemClinica.toFixed(2).replace(".", ",")}`, // Porcentagem da Clínica
          `R$ ${porcentagemColaborador.toFixed(2).replace(".", ",")}` // Porcentagem do Colaborador
        ];

        somaClinica += porcentagemClinica;
        somaColaborador += porcentagemColaborador;

        resultados.push(dadosDocumento); // Adiciona o array do documento ao array de resultados
      }
    });

    // Adiciona o somatório no final da planilha
    resultados.push([]);
    resultados.push(["", "", "", "", "", "", "Total", `R$ ${somaClinica.toFixed(2).replace(".", ",")}`, `R$ ${somaColaborador.toFixed(2).replace(".", ",")}`]);

    // Cria um novo workbook (arquivo Excel)
    let wb = XLSX.utils.book_new();

    // Cria uma planilha a partir dos dados
    let ws = XLSX.utils.aoa_to_sheet(resultados);

    // Define a largura das colunas
    ws['!cols'] = [
      { wpx: 200 },  // Largura da coluna "ID"
      { wpx: 200 },  // Largura da coluna "Nome"
      { wpx: 100 },  // Largura da coluna "Data"
      { wpx: 80 },   // Largura da coluna "Horário"
      { wpx: 150 },  // Largura da coluna "Responsável"
      { wpx: 200 },  // Largura da coluna "Tipo"
      { wpx: 100 },  // Largura da coluna "Valor"
      { wpx: 150 },  // Largura da coluna "Porcentagem da Clínica"
      { wpx: 150 }   // Largura da coluna "Porcentagem do Colaborador"
    ];

    // Adiciona a planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos");

    // Gera o arquivo Excel e faz o download
    XLSX.writeFile(wb, 'agendamentos.xlsx');

  }).catch((error) => {
    console.error("Erro ao buscar documentos: ", error);
  });
}

// Função para converter data no formato AAAA-MM-DD para DD-MM-AAAA
function formatarData(data) {
  let [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

