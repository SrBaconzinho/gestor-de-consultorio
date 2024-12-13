function verifyAuthentication() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Se o usuário estiver autenticado, faça alguma coisa (ex: redirecione para a página de home)
      console.log('Usuário autenticado:', user.uid);
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
          if (doc.data().nome) {
            nomesPsi.push(doc.data().nome);
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
     defaultOption.value = "";
     defaultOption.text = "Selecione um nome";
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
    defaultOption.value = "";
    defaultOption.text = "Selecione um nome";
    selectNome.appendChild(defaultOption);
  
    // Adiciona as opções dos nomes ao select
    nomes.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.text = nome;
        selectNome.appendChild(option);
    });
  }

  function gerarDocumento() {
    const nome = document.getElementById("name").value;
    const dataInicio = document.getElementById("dataInicio").value; // formato AAAA-MM-DD
    const dataFim = document.getElementById("dataFim").value;       // formato AAAA-MM-DD
    const nomePsi = document.getElementById("responsavel").value;
    const db = firebase.firestore();
    let crp;
  
    // Busca o CRP do responsável
    db.collection("responsavel").where('nome', '==', nomePsi).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Se houver um documento correspondente, atualize o valor de crp com o valor do campo crp desse documento
        crp = querySnapshot.docs[0].data().crp;
      }
      
      // Armazenando as informações no localStorage
      const arrayInfos = [nome, dataInicio, dataFim, nomePsi, crp];
      localStorage.setItem("arrayInfos", JSON.stringify(arrayInfos));
      
    }).catch((error) => {
      console.error("Erro ao buscar o documento:", error);
    });
  
    // Validação dos campos
    if (!nome || !dataInicio || !dataFim) {
      alert("Todos os campos precisam ser preenchidos!");
      return;
    }
  
    // Consulta no Firebase com filtros diretos
    db.collection("agendamentos")
      .where('nome', '==', nome)                             // Filtra pelo nome do paciente
      .where('data', '>=', dataInicio)                       // Filtra pela data de início
      .where('data', '<=', dataFim)                          // Filtra pela data de fim
      .where('agendamento', '==', 'Atendido')                // Filtra por agendamentos atendidos
      .get()
      .then((querySnapshot) => {
        let datasOrdenadas = [];
  
        // Armazena e formata as datas dos agendamentos atendidos
        querySnapshot.forEach((doc) => {
          const data = doc.data().data;
          datasOrdenadas.push(data);  // Não precisa formatar aqui, a data já está no formato AAAA-MM-DD
        });
  
        // Ordena as datas
        datasOrdenadas.sort((a, b) => new Date(a) - new Date(b));
  
        // Gera as fichas com as datas ordenadas
        gerarFichas(datasOrdenadas);
        console.log(datasOrdenadas);
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamentos:", error);
      });
  }
  
  function gerarFichas(datasOrdenadas) {
    // Abre um novo documento em branco
    const fichaWindow = window.open('ficha.html', '_blank');
  
    // Espera que a nova página seja carregada antes de adicionar as fichas
    fichaWindow.addEventListener('load', function() {
      const fichaDocument = fichaWindow.document;
  
      datasOrdenadas.forEach(data => {
        const ficha = fichaDocument.createElement('div');
        ficha.className = 'ficha';
  
        const colunaData = fichaDocument.createElement('div');
        colunaData.className = 'coluna';
        colunaData.innerText = formateDate(data); // As datas já estão no formato ISO AAAA-MM-DD
  
        const colunaPaciente = fichaDocument.createElement('div');
        colunaPaciente.className = 'coluna';
  
        const colunaProfissional = fichaDocument.createElement('div');
        colunaProfissional.className = 'coluna';
  
        ficha.appendChild(colunaData);
        ficha.appendChild(colunaPaciente);
        ficha.appendChild(colunaProfissional);
  
        fichaDocument.body.appendChild(ficha); // Adicionando a ficha ao documento
      });
    });
  }

  function formateDate(formatoISO) {
    // Divide a data pelo hífen
    const [ano, mes, dia] = formatoISO.split("-");
  
    // Retorna a data no formato DD-MM-AAAA
    return `${dia}/${mes}/${ano}`;
  }