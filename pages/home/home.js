function verifyAuthentication() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      // Se o usuário estiver autenticado, redirecione para a página de home
      window.location.href = "../../index.html"; // Redireciona para a página de login
    } else {
      document.body.style.visibility = "visible";
    }
  });
}
firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function () {
  verifyAuthentication();
});

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
function goToDocumentos(){
  window.location.href="../documentos/documentos.html"
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

function logout() {
  showLoading();
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Logout bem-sucedido
      window.location.href = "../../index.html";
      // Redirecione ou execute outras ações após o logout, se necessário
    })
    .catch(function (error) {
      // Ocorreu um erro durante o logout
      console.error("Erro durante o logout:", error);
    });
}
function ordenarArrayAlfabeticamente(arr) {
  // Cria uma cópia da array para evitar modificar a original
  const copiaArr = [...arr];

  // Usa o método sort() para ordenar a array
  copiaArr.sort((a, b) => a.localeCompare(b));

  return copiaArr;
}

function createNew() {
  document.getElementById("novo-agendamento").style.display = "flex";

  const db = firebase.firestore();
  let nomes = [];

  // Busca os documentos da coleção 'pacientes'
  db.collection("pacientes").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // Adiciona o nome do paciente ao array
          nomes.push(doc.data().nome);
      });

      // Uma vez que os nomes são buscados, popular o select
      nomes=ordenarArrayAlfabeticamente(nomes);
      popularSelect(nomes);
  }).catch((error) => {
      console.log("Erro ao buscar pacientes:", error);
  });
}

function frequenciaAgendar(){

  const selectBox=document.getElementById("recorrente").checked
  

  if(selectBox){

    document.getElementById("recorrente-content").style.display="flex"
    

  }else{
    document.getElementById("recorrente-content").style.display="none"

    
  }
}

function hideEdit(){

  
  document.querySelector(".editar-agendamento").style.display="none"
}

function formatarMoeda(campo) {
  let valor = campo.value;

  // Remove qualquer caractere que não seja número
  valor = valor.replace(/\D/g, '');

  // Converte para número e divide por 100 para considerar os centavos
  valor = (valor / 100).toFixed(2);

  // Formata o valor como moeda brasileira
  valor = valor.replace(".", ",");

  // Adiciona o símbolo de real
  valor = 'R$ ' + valor;

  // Define o valor formatado de volta ao campo de input
  campo.value = valor;
}


function popularSelect(nomes) {
  const selectNome = document.getElementById("nome");

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

function hideCreateNew() {
  document.getElementById("nome").value = "";
  document.getElementById("data").value = "";
  document.getElementById("horario").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("responsavel").value = "";
  document.getElementById("novo-agendamento").style.display = "none";
}
function agendar() {
  let nameAgendar = document.getElementById("nome").value;
  let dataAgendar = document.getElementById("data").value;
  let horarioAgendar = document.getElementById("horario").value;
  let tipoAgendar = document.getElementById("tipo").value;
  let responsavelAgendar = document.getElementById("responsavel").value;
  let valorAgendar=document.getElementById("valor").value;

  if (
    !nameAgendar ||
    !dataAgendar ||
    !horarioAgendar ||
    !tipoAgendar ||
    !responsavelAgendar ||
    !valor
  ) {
    alert("Todos os campos devem ser preenchidos");
  } else {
    
    let frequenciaSemanal=parseInt(document.getElementById("frequencia-n").value)

    let proximosDias=proximosDiasDaSemana(dataAgendar,frequenciaSemanal-1)
    
    const db = firebase.firestore();
    const colecao = db.collection("agendamentos");

    for(let i=0;i<proximosDias.length; i++){

      
      let dataAgendar=proximosDias[i];
      
      // let novaData=FormatDate(dataAgendar);

      let contador = i+1
      
      
      
      colecao
      .add({
        data: dataAgendar,
        horario: horarioAgendar,
        nome: nameAgendar,
        responsavel: responsavelAgendar,
        tipo: tipoAgendar,
        agendamento: "Agendado",
        valor: valorAgendar
      })
      .then((docRef) => alert("Agendamentado " + contador + " vezes"));
    
    }


    hideCreateNew();
    findDados();
  }
}
function proximosDiasDaSemana(dataString, numeroSaidas) {

  let diasPular;

    let frequenciaDesejada = document.getElementById("frequencia").value;
    diasPular = frequenciaDesejada === "semanal" ? 7 : 14;
  

  const parts = dataString.split("-");
  const ano = parseInt(parts[0], 10);
  const mes = parseInt(parts[1], 10) - 1;
  const dia = parseInt(parts[2], 10);

  let listaProximas = [];

  const data = new Date(ano, mes, dia);

  let firstDay = `${ano}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  listaProximas.push(firstDay);

  for (let i = 0; i < numeroSaidas; i++) {
    data.setDate(data.getDate() + diasPular);

    const novoAno = data.getFullYear();
    const novoMes = data.getMonth() + 1;
    const novoDia = data.getDate();

    let strData = `${novoAno}-${novoMes.toString().padStart(2, '0')}-${novoDia.toString().padStart(2, '0')}`;
    listaProximas.push(strData);
  }

  return listaProximas;
}

function filtrarPorResponsavel(dadosFiltrados){


  const arrayDadosFiltrados=Object.entries(dadosFiltrados);
  const responsavelFilter=document.getElementById("responsavel-select").value;

  if(responsavelFilter==="Todos"){
    return dadosFiltrados;
  }

  const dadosFiltradosAposResponsvael = arrayDadosFiltrados.filter(([chave,paciente])=>{
    return paciente.responsavel === responsavelFilter;
  });

  const resultadoFiltradoPorResponsvael = Object.fromEntries(dadosFiltradosAposResponsvael);

return resultadoFiltradoPorResponsvael;

}

function doned(button,event){
  
  event.stopPropagation()

  idPai=button.parentNode.id;

  const db=firebase.firestore();

  const colecao=db.collection("agendamentos").doc(idPai);

  colecao.update({
    agendamento: "Atendido",
  }).then(()=>{
    findDados();
    alert('Agendamento atualizado como "Atendido"!');
  }).catch(error => {
    alert("Erro ao cancelar!", error);
  });

  
}

function confirmed(button,event){
  event.stopPropagation();
  idPai=button.parentNode.id;

  const db=firebase.firestore();

  const colecao=db.collection("agendamentos").doc(idPai);

  colecao.update({
    agendamento: "Confirmado",
  }).then(()=>{
    findDados();
    alert('Agendamento atualizado como "Confirmado"!');
  }).catch(error => {
    alert("Erro ao cancelar!", error);
  });

  
}

function cancel(button,event){
  event.stopPropagation();
  idPai=button.parentNode.id;

  const db=firebase.firestore();

  const colecao=db.collection("agendamentos").doc(idPai);

  colecao.update({
    agendamento: "Cancelado",
  }).then(()=>{
    findDados();
    alert('Agendamento atualizado como "Cancelado"!');
  }).catch(error => {
    alert("Erro ao cancelar!", error);
  });

  
}
function converterData(data) {
  // Dividir a string de data pelo caractere "/"
  let partes = data.split('/');
  // Reorganizar as partes da data para o formato AAAA/MM/DD
  let dataConvertida = partes[2] + '-' + partes[1] + '-' + partes[0];
  return dataConvertida;
}


function showEdit(div){

  const colecao=firebase.firestore().collection("agendamentos");

  let idficha=div.id // pega o id da ficha a ser editada
  let fichaEdit=document.querySelector(".editar-agendamento")
  fichaEdit.setAttribute("id",idficha)

  //Limpando os campos
  document.getElementById("dataEdit").value=""
  document.getElementById("horarioEdit").value=""
  document.getElementById("tipoEdit").value=""
  document.getElementById("responsavelEdit").value=""
  document.getElementById("nomeEdit").value=""
  document.getElementById("valorEdit").value=""

  colecao.doc(idficha).get().then((doc)=>{
    if(doc.exists){
      let dados=doc.data();
      selectResponsavelEdit()

      fichaEdit.style.display="block"
      document.getElementById("nomeEdit").value=dados.nome
      document.getElementById("dataEdit").value=converterData(dados.data)
      document.getElementById("horarioEdit").value=dados.horario
      document.getElementById("tipoEdit").value=dados.tipo
      document.getElementById("responsavelEdit").value=dados.responsavel
      document.getElementById("valorEdit").value=dados.valor

    }else{
      alert("Enhum documento com o id" + idficha)
    }
  }).catch((error)=>
    alert(error.message))
  
  }

  function saveEdit(){

    let ficha = document.querySelector('.editar-agendamento');

    let idficha=ficha.id
    alert(idficha)





    const colecao=firebase.firestore().collection("agendamentos").doc(idficha);

      let newName=document.getElementById("nomeEdit").value
      let newData=document.getElementById("dataEdit").value
      let newHorario=document.getElementById("horarioEdit").value
      let newTipo=document.getElementById("tipoEdit").value
      let newReponsavel=document.getElementById("responsavelEdit").value
      let newvalor=document.getElementById("valorEdit").value
      let novaDataAgendamentoConvertida=FormatDate(newData)

      colecao.update({
        nome: newName,
        data: novaDataAgendamentoConvertida,
        horario: newHorario,
        tipo: newTipo,
        responsavel: newReponsavel,
        valor: newvalor
      }).then(()=>{
        alert("Agendamento atualizado!")
        hideEdit()
        showPacientes()
      }).catch(error=>{
        alert(error.message)
      })

  }

 

function showPacientes(dados) {
  var pacientesDiv = document.getElementById("pacientes");

  if (dados) {
    // Limpar conteúdo existente antes de adicionar novos elementos
    pacientesDiv.innerHTML = "";

    for (var pacienteId in dados) {
      if (dados.hasOwnProperty(pacienteId)) {
        var paciente = dados[pacienteId];



        var divPaciente = document.createElement("div");
        divPaciente.setAttribute("class", "paciente"); // Use "class" para aplicar estilos CSS
        divPaciente.setAttribute("id", pacienteId); // Use "class" para aplicar estilos CSS
        divPaciente.setAttribute("onclick", 'showEdit(this)')

      

        var divInfo = document.createElement("div"); // Esta div engloba as informações do paciente
        divInfo.setAttribute("class", "info");

        var divNome = document.createElement("div");
        divNome.setAttribute("class", "nome");
        divNome.innerHTML = "<span class='infos'>Nome: </span>" + paciente.nome;

        var divHorario = document.createElement("div");
        divHorario.setAttribute("class", "horario");
        divHorario.innerHTML =
          "<span class='infos'>Horário: </span>" + paciente.horario;

        var divTipo = document.createElement("div");
        divTipo.setAttribute("class", "tipo");
        divTipo.innerHTML =
          "<span class='infos'>Tipo de atendimento: </span>" + paciente.tipo;

        var divResponsavel = document.createElement("div");
        divResponsavel.setAttribute("class", "responsavel");
        divResponsavel.innerHTML =
          "<span class='infos'>Responsável: </span>" + paciente.responsavel;
        var divCondicao=document.createElement("div");
        divCondicao.setAttribute("class","condicao");
        divCondicao.innerHTML="<span class='infos'> Estatus:</span> " +paciente.agendamento;

        divInfo.appendChild(divNome);
        divInfo.appendChild(divHorario);
        divInfo.appendChild(divTipo);
        divInfo.appendChild(divResponsavel);
        divInfo.appendChild(divCondicao);
        
        const inputButton = document.createElement("button");
        inputButton.setAttribute("onclick", "cancelar(this,event)");
        inputButton.setAttribute("id", "cancelar");
        inputButton.innerText = "X";



        //botão para marcar como cancelado
          const cancelButton = document.createElement("button");
          cancelButton.setAttribute("onclick", "cancel(this,event);");
          cancelButton.setAttribute("id", "cancel");
          cancelButton.innerHTML = "Cancelado";

          //botão para marcar como confirmado
          const confirmButton = document.createElement("button");
          confirmButton.setAttribute("onclick", "confirmed(this,event);");
          confirmButton.setAttribute("id", "confirm");
          confirmButton.innerHTML = "Confirmado";

          //botão para marcar como atendido
            const atendidoButton = document.createElement("button");
            atendidoButton.setAttribute("onclick", "doned(this, event);");
            atendidoButton.setAttribute("id", "done");
            atendidoButton.innerHTML = "Atendido";


        divPaciente.appendChild(cancelButton);
        divPaciente.appendChild(atendidoButton);
        divPaciente.appendChild(confirmButton);
        divPaciente.appendChild(inputButton);
        divPaciente.appendChild(divInfo);
        pacientesDiv.appendChild(divPaciente);

        switch (paciente.agendamento) {
          case 'Cancelado':
            divPaciente.style.backgroundColor = '#ff3b3b59'; 
            break;
          case 'Confirmado':
            divPaciente.style.backgroundColor = '#5b6bff33'; 
            break;
          case 'Atendido':
            divPaciente.style.backgroundColor = "#00ff081f"	;
            break;
          default:
            // Se não for nenhum dos valores acima, você pode definir uma cor padrão ou não fazer nada
            break;
        }
      }
    }
  } else {
    console.error("O objeto 'dados' não está definido corretamente.");
  }
}

function cancelar(button, event) {
  event.stopPropagation();
  const div = button.parentNode;
  const idDocument = div.id;
  const db = firebase.firestore();
  const colecao = db.collection("agendamentos");

  const confirmacao = confirm(
    "Tem certeza que deseja excluir este atendimento?"
  );

  if (confirmacao) {
    colecao
      .doc(idDocument)
      .delete()
      .then(() => {
        alert("Agendamento excluído com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao deletar documento:" + error);
      });
    findDados();
  }
}
async function findDados() {
  try {
    // Obtém a data diretamente do input
    const data = document.getElementById("dateToShow").value; // formato padrão (AAAA-MM-DD)

    // Obtém a referência para a coleção "agendamentos"
    const agendamentosCollection = firebase
      .firestore()
      .collection("agendamentos");

    // Realiza a consulta filtrando pela data específica no Firestore
    const snapshot = await agendamentosCollection
      .where("data", "==", data) // "data" deve ser armazenado no Firestore no formato AAAA-MM-DD
      .get();

    // Objeto para armazenar os dados filtrados
    const dados = {};

    // Itera sobre os documentos filtrados e armazena no objeto "dados"
    snapshot.forEach((doc) => {
      dados[doc.id] = doc.data();
    });

    // Ordena os dados por horário
    const dadosOrdenados = ordenarPorHorario(dados);

    // Aplica outros filtros, como o filtro por responsável
    const dadosFiltradosAposResponsavel = filtrarPorResponsavel(dadosOrdenados);

    // Exibe os pacientes filtrados e ordenados
    showPacientes(dadosFiltradosAposResponsavel);

    // Retorna os dados (se necessário para outras operações)
    return dados;
  } catch (error) {
    console.error("Erro na execução da função:", error);
    throw error; // Lança o erro novamente para indicar falha
  }
}
function ordenarPorHorario(dados) {
  // Converte o objeto em um array de pares chave-valor
  const arrayDados = Object.entries(dados);

  // Ordena o array com base no atributo 'horario' de cada paciente
  arrayDados.sort((a, b) => {
    const horarioA = a[1].horario.split(":").map(Number); // Converte o horário em um array de números
    const horarioB = b[1].horario.split(":").map(Number); // Converte o horário em um array de números

    // Compara as horas
    if (horarioA[0] < horarioB[0]) {
      return -1;
    } else if (horarioA[0] > horarioB[0]) {
      return 1;
    } else {
      // Se as horas são iguais, compare os minutos
      if (horarioA[1] < horarioB[1]) {
        return -1;
      } else if (horarioA[1] > horarioB[1]) {
        return 1;
      } else {
        return 0; // Horas e minutos são iguais
      }
    }
  });

  // Converte o array ordenado de volta para um objeto
  const dadosOrdenados = Object.fromEntries(arrayDados);

  return dadosOrdenados;
}

function filtrarPorData(dados, dataFiltrar) {
  // Converte o objeto em um array de pares chave-valor
  const arrayDados = Object.entries(dados);

  // Filtra o array para manter apenas os elementos com a data especificada
  const dadosFiltrados = arrayDados.filter(([chave, paciente]) => {
    return paciente.data === dataFiltrar;
  });

  // Converte o array filtrado de volta para um objeto
  const resultadoFiltrado = Object.fromEntries(dadosFiltrados);

  return resultadoFiltrado;
}

function FormatDate(dataToConvert) {
  let dataBrasil = dataToConvert.split("-").reverse().join("/");

  return dataBrasil;
}

// add responsaveis de forma dinamica 

async function selectResponsavel(){
  const responsavel = {};

   //encontra os pacientes no firebase
   try {
    const responsavelCollection = firebase.firestore().collection("responsavel");
    const snapshot = await responsavelCollection.get();


    snapshot.forEach((doc) => {
      responsavel[doc.id] = doc.data();
      
    });
    
  } catch (error) {
    alert("Erro na execução da função", error);
    console.log(error.message);
  }

  const apelidos=[];

  for (const id in responsavel){
    if(responsavel.hasOwnProperty(id) && responsavel[id].hasOwnProperty('apelido') ){
      apelidos.push(responsavel[id].apelido)
    }
    }
  const selectResponsavel=document.getElementById('responsavel-select')
  
  apelidos.forEach(apelido => {
    const option=document.createElement("option")
    option.value=apelido;
    option.text=apelido;
    selectResponsavel.appendChild(option)
  })
  const selectResponsa=document.getElementById('responsavel')
  
  apelidos.forEach(apelido => {
    const option=document.createElement("option")
    option.value=apelido;
    option.text=apelido;
    selectResponsa.appendChild(option)
  })

  
}

selectResponsavel()




async function selectResponsavelEdit() {
  const responsavel = {};

  // Encontra os pacientes no Firebase
  try {
    const responsavelCollection = firebase.firestore().collection("responsavel");
    const snapshot = await responsavelCollection.get();

    snapshot.forEach((doc) => {
      responsavel[doc.id] = doc.data();
    });
  } catch (error) {
    alert("Erro na execução da função: " + error.message);
    console.log(error.message);
  }

  const apelidos = [];
  for (const id in responsavel) {
    if (responsavel.hasOwnProperty(id) && responsavel[id].hasOwnProperty('apelido')) {
      apelidos.push(responsavel[id].apelido);
    }
  }

  const selectResponsavel = document.getElementById('responsavelEdit');
  
  // Limpar opções anteriores
  selectResponsavel.innerHTML = '';
  
  apelidos.forEach(apelido => {
    const option = document.createElement("option");
    option.value = apelido;
    option.text = apelido;
    selectResponsavel.appendChild(option);
  });
}

