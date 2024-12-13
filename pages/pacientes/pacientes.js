function verifyAuthentication() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Se o usuário estiver autenticado, faça alguma coisa (ex: redirecione para a página de home)
      
      addTohtml();
    } else {
      // Se o usuário não estiver autenticado, redirecione para a página de login ou tome outra ação
      
      
      window.location.replace("../../index.html");
    }
  });
}

verifyAuthentication();

firebase.initializeApp(firebaseConfig);



addTohtml(); 
//prepara para add os pacientes no html
function addTohtml() {

  findPacientes().then((pacientes) => {
    const divPaciente = document.getElementById("pacientes");

    if (pacientes) {
      divPaciente.innerHTML = "";
      for (var pacienteId in pacientes) {
        if (pacientes.hasOwnProperty(pacienteId)) {
          var paciente = pacientes[pacienteId];

          var boxPaciente = document.createElement("div");
          boxPaciente.setAttribute("class", "boxpaciente");
          boxPaciente.setAttribute("id", pacienteId);
          boxPaciente.setAttribute("onclick","showFicha(this)")

          divNome = document.createElement("div");
          divNome.setAttribute("class", "nome");
          divNome.innerHTML = "<span>Nome: </span>" + paciente.nome;
          divSexo = document.createElement("div");
          divSexo.setAttribute("class", "sexo");
          divSexo.innerHTML = "<span>Sexo: </span>" + paciente.sexo;
          divIdade=document.createElement("div");
          divIdade.setAttribute("class","idade");
          const idade=converterIdade(paciente.data)
          
          divIdade.innerHTML="<span>Idade: </span>"+ idade +" Anos";
//botão para apagar do registro
          const inputButton = document.createElement("button");
          inputButton.setAttribute("onclick", "dellPaciente(this);");
          inputButton.setAttribute("id", "cancelar");
          inputButton.innerHTML = "X";

          boxPaciente.appendChild(divNome);
          boxPaciente.appendChild(divSexo);
          boxPaciente.appendChild(divIdade);
          boxPaciente.appendChild(inputButton);


          divPaciente.appendChild(boxPaciente);
        }
      }
    }
  });
}



function fecharInfo(){
  document.querySelector(".show").style.display="none"; /// mexer nisso

  document.getElementById("nome-show").value ="";
  document.getElementById("mae-show").value = "";
  document.getElementById("pai-show").value = "";
  document.getElementById("data-show").value ="";
  document.getElementById("endereco-show").value ="";
  document.getElementById("sexo-show").value = "";
  document.getElementById("telefone-show").value ="";
  document.getElementById("telefone-sec-show").value =""; 
  document.getElementById("cpf-show").value = "";
  document.getElementById("obs-show").value = "";

}

function showFicha(elemento){
  
  const fichaId=elemento.id;
  const colecao=firebase.firestore().collection("pacientes");
  let ficha=document.querySelector(".show");
  ficha.setAttribute("id",fichaId);

  document.getElementById("nome-show").value ="";
  document.getElementById("mae-show").value = "";
  document.getElementById("pai-show").value = "";
  document.getElementById("data-show").value ="";
  document.getElementById("endereco-show").value ="";
  document.getElementById("sexo-show").value = "";
  document.getElementById("telefone-show").value ="";
  document.getElementById("telefone-sec-show").value =""; 
  document.getElementById("cpf-show").value = "";
  document.getElementById("obs-show").value = "";

  colecao.doc(fichaId).get().then((doc)=>{
    if(doc.exists){
      const dados=doc.data();
      document.querySelector(".show").style.display="block";

      document.getElementById("nome-show").value = dados.nome || "";
      document.getElementById("mae-show").value = dados.mae || "";
      document.getElementById("pai-show").value = dados.pai || "";
      document.getElementById("data-show").value = dados.data || ""; // Considerando que "nascimento" no Firestore é uma string no formato "YYYY-MM-DD"
      document.getElementById("endereco-show").value = dados.add || "";
      document.getElementById("sexo-show").value = dados.sexo || "";
      document.getElementById("telefone-show").value = dados.tell1 || "";
      document.getElementById("telefone-sec-show").value = dados.tell2 || ""; // Usando notação de colchetes para chaves com hífen
      document.getElementById("cpf-show").value = dados.cpf || "";
      document.getElementById("obs-show").value = dados.obs || "";
      
    }else{
      alert("nenhum documento com o id: " + fichaId)
    }
  }).catch((error)=>{
    alert("error ao buscar documento")
  });

}

function editInfos(){


  isConfirm = confirm("Manter alterações nos dados?");

  if(isConfirm){

    
    const editName = document.getElementById("nome-show").value;
  const editMae = document.getElementById("mae-show").value;
  const editPai = document.getElementById("pai-show").value;
  const editData = document.getElementById("data-show").value;
  const editAdd = document.getElementById("endereco-show").value;
  const editSexo = document.getElementById("sexo-show").value;
  const editTell1 = document.getElementById("telefone-show").value;
  const editTell2 = document.getElementById("telefone-sec-show").value;
  const editCpf = document.getElementById("cpf-show").value;
  const editObs = document.getElementById("obs-show").value;
  
  // Obtenha a referência à coleção
  const db = firebase.firestore();
  
  
  
  // Adicione o ouvinte de eventos
  const divId = document.querySelector(".edit").parentElement.id;
  
  
  const colecao = db.collection("pacientes").doc(divId);
  colecao.update({
      nome: editName,
      cpf: editCpf,
      data: editData,
      mae: editMae,
      pai: editPai,
      sexo: editSexo,
      tell1: editTell1,
      tell2: editTell2,
      obs: editObs,
      add: editAdd,
    }).then(() => {
      alert("Dados editados com sucesso!");
      fecharInfo();
      addTohtml();
    }).catch(error => {
      alert("Erro ao editar dados:", error);
    });
  }
  };

  
  function converterIdade(dataNascimentostring){
    // Convertendo a string da data de nascimento para um objeto Date
    var partesData = dataNascimentostring.split("/");
    var dataNascimento = new Date(partesData[2], partesData[1] - 1, partesData[0]); // Ano, Mês, Dia
    
    // Obtendo a data atual
    var dataAtual = new Date();
  
      // Calculando a diferença entre os anos
      var idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
  
      // Verificando se o aniversário ainda não ocorreu neste ano
      if (dataAtual.getMonth() < dataNascimento.getMonth() || 
         (dataAtual.getMonth() === dataNascimento.getMonth() && dataAtual.getDate() < dataNascimento.getDate())) {
          idade--;
      }
  
      // Convertendo a idade para string e retornando
      return idade.toString();

}


function cadastrarNew() {
  let newName = document.getElementById("nome").value;
  let newMae = document.getElementById("nomeMae").value;
  let newPai = document.getElementById("nomePai").value;
  let newData = document.getElementById("dataNascimento").value;
  let newCpf = document.getElementById("cpf").value;
  let newSexo = document.getElementById("sexo").value;
  let newStatus = document.getElementById("status").value;
  let newTell1 = document.getElementById("telefone1").value;
  let newTell2 = document.getElementById("telefone2").value;
  let newObs = document.getElementById("observacao").value;
  let newAdd=document.getElementById("endereco").value;

  data=FormatDate(newData);


  if (
    !newName ||
    !newMae ||
    !newAdd ||
    !newData ||
    !newCpf ||
    !newSexo ||
    !newStatus ||
    !newTell1 ||
    !newTell2
  ) {
    alert("Todos os campos devem ser preenchidos");
  } else {
    const db = firebase.firestore();
    const colecao = db.collection("pacientes");
    colecao.add({
      nome: newName,
      cpf: newCpf,
      data: data,
      mae: newMae,
      pai: newPai,
      sexo: newSexo,
      status: newStatus,
      tell1: newTell1,
      tell2: newTell2,
      obs: newObs,
      add: newAdd,
    });
    addTohtml();
    findPacientes();
    hideCadastro();
  }}

  function FormatDate(dataToConvert) {
    let dataBrasil = dataToConvert.split("-").reverse().join("/");
  
    return dataBrasil;
  }

function hideCadastro() {
  document.getElementById("container").style.display = "none";
  document.getElementById("nome").value="";
  document.getElementById("nomeMae").value="";
  document.getElementById("nomePai").value="";
  document.getElementById("dataNascimento").value="";
  document.getElementById("cpf").value="";
  document.getElementById("sexo").value="";
  document.getElementById("status").value="";
  document.getElementById("telefone1").value="";
  document.getElementById("telefone2").value="";
  document.getElementById("observacao").value="";
}
function showCadastro() {
  document.getElementById("container").style.display = "block";
}

function ordenarPorAlfabeto(pacientes) {
  var ArrayObjetos = Object.entries(pacientes); // Convertendo o objeto em uma matriz de [chave, valor]
  
  
  ArrayObjetos.sort(function(a, b) {
    var nomeA = a[1].nome.toUpperCase(); // Acessando o nome do objeto
    var nomeB = b[1].nome.toUpperCase();

    if (nomeA < nomeB) {
      return -1;
    }
    if (nomeA > nomeB) {
      return 1;
    }
    return 0;
  });

  var objetosOrdenados = {};

  ArrayObjetos.forEach(function(item) {
    objetosOrdenados[item[0]] = item[1]; // Usando a chave original como ID e o valor correspondente como objeto
  });

  return objetosOrdenados;
}

function pesquisar(){

  let pesquisar=document.getElementById("pesquisar").value;
  

  return pesquisar
}

async function findPacientes() {

  //encontra os pacientes no firebase
  try {
    const pacientesCollection = firebase.firestore().collection("pacientes");
    const snapshot = await pacientesCollection.get();

    const pacientes = {};

    snapshot.forEach((doc) => {
      pacientes[doc.id] = doc.data();
    });
    const pacientesOrdenados=ordenarPorAlfabeto(pacientes);
    

    return pacientesOrdenados;
  } catch (error) {
    alert("Erro na execução da função", error);
    console.log(error.message);
  }
}
function showMenu() {
  document.getElementById("show-menu").querySelector("ul").style.display =
    "block";
}
function hideMenu() {
  document.getElementById("show-menu").querySelector("ul").style.display =
    "none";
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
      alert("Erro durante o logout:", error);
    });
}

function goToHorario() {
  window.location.href = "../../pages/home/home.html";
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

function dellPaciente(button) {
  var docID = button.parentNode.id;
  const db = firebase.firestore();
  var pacienteDell = db.collection("pacientes");

  isConfirm = confirm("Tem certeza que deseja deletar esse paciente?");

  if (isConfirm) {
    pacienteDell
      .doc(docID)
      .delete()
      .then(() => {
        alert("Paciente deletado com sucesso");
        addTohtml();
      })
      .catch((error) => {
        alert("Erro ao deletar!");
      });
  }
}
