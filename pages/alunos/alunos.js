function verifyAuthentication() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // Se o usuário estiver autenticado, faça alguma coisa (ex: redirecione para a página de home)
      console.log('Usuário autenticado:', user.uid);
      
    } else {
      // Se o usuário não estiver autenticado, redirecione para a página de login ou tome outra ação
      console.log('Usuário não autenticado');
      // Redirecionar para a página de login, por exemplo
      window.location.replace("../../index.html");
    }
  });
}
// inserir funções do menu

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



function showCadastro(){
  document.getElementById('container').style.display="block";
}

function hideCadastro(){
  document.getElementById('container').style.display="none";
}

function cadastrarNew(){
  let newName = document.getElementById("nome").value;
  let newData = document.getElementById("dataNascimento").value;
  let newAdd=document.getElementById("endereco").value;
  let newCpf = document.getElementById("cpf").value;
  let newSexo = document.getElementById("sexo").value;
  let newServico = document.getElementById("servico").value;
  let newTell = document.getElementById("telefone1").value;
  let newObs = document.getElementById("observacao").value;

  data=FormatDate(newData);

  if(!newName|| !newData || !newAdd || !newCpf || !newSexo || !newServico || !newTell){
    alert("Todos os campos obrigatórios devem ser preenchidos")
  }else{
    const db=firebase.firestore();
    const colecao=db.collection("alunos");
    colecao.add({
      nome: newName,
      data: data,
      add: newAdd,
      cpf: newCpf,
      sexo: newSexo,
      tell: newTell,
      obs: newObs,
      servico: newServico,
    })
    addTohtml();
    hideCadastro();
  }
}

function FormatDate(dataToConvert) {
  let dataBrasil = dataToConvert.split("-").reverse().join("/");

  return dataBrasil;
}

function showFicha(div) {
  const colecao=firebase.firestore().collection("alunos");
  let fichaId = div.id;
  let ficha=document.querySelector('.show');
  ficha.setAttribute('id', fichaId);
  console.log(fichaId);
  document.getElementById('nome-show').value="";
  document.getElementById('data-show').value="";
  document.getElementById('endereco-show').value="";
  document.getElementById('cpf-show').value="";
  document.getElementById('sexo-show').value="";
  document.getElementById('servico-show').value="";
  document.getElementById('tell-show').value="";
  document.getElementById('obs-show').value="";

  colecao.doc(fichaId).get().then((doc)=>{
    if(doc.exists){
      const dados=doc.data();
      document.querySelector(".show").style.display="block";

  document.getElementById('nome-show').value=dados.nome || "";
  document.getElementById('data-show').value= dados.data||"";
  document.getElementById('endereco-show').value=dados.add ||"";
  document.getElementById('cpf-show').value=dados.cpf || "";
  document.getElementById('sexo-show').value=dados.sexo || "";
  document.getElementById('servico-show').value=dados.servico ||"";
  document.getElementById('tell-show').value= dados.tell || "";
  document.getElementById('obs-show').value=dados.obs || "";
      


    }else{
      alert("nenhum documento com o id:" + fichaId)
    }
  }).catch((error)=>
  alert(error.message))

}

function addTohtml() {
  findAlunos().then((alunos) => {
    let divAlunos = document.getElementById("alunos");

    if (alunos) {
      divAlunos.innerHTML = "";

      for (var alunoId in alunos) {
        if (alunos.hasOwnProperty(alunoId)) {
          var aluno = alunos[alunoId];

          var boxAluno = document.createElement('div');
          boxAluno.setAttribute('class', 'boxAluno');
          boxAluno.setAttribute('id', alunoId);
          boxAluno.setAttribute('onclick', 'showFicha(this)');

          var divNome = document.createElement('div');
          divNome.setAttribute('class', "nome");
          divNome.innerHTML = "<span>Nome: </span>" + aluno.nome;

          var divSexo = document.createElement('div');
          divSexo.setAttribute('class', 'sexo');
          divSexo.innerHTML = "<span>Sexo: </span>" + aluno.sexo;

          var divIdade = document.createElement('div');
          divIdade.setAttribute('class', 'idade');
          const idade = converterIdade(aluno.data);
          divIdade.innerHTML = "<span>Idade: </span>" + idade + " anos";
          var divTell=document.createElement('div');
          divTell.setAttribute('class','tell');
          divTell.innerHTML="<span>Telefone: </span>" + aluno.tell;
          divServico=document.createElement('div');
          divServico.setAttribute('class','servico');
          divServico.innerHTML='<span>Serviço: </span>'+aluno.servico;

          // Botão para apagar do registro
          var inputButton = document.createElement('button');
          inputButton.setAttribute("onclick", 'dellAluno(this);');
          inputButton.setAttribute('id', 'cancelar');
          inputButton.innerHTML = "X";

          boxAluno.appendChild(divNome);
          boxAluno.appendChild(divSexo);
          boxAluno.appendChild(divIdade);
          boxAluno.appendChild(divTell);
          boxAluno.appendChild(divServico);
          boxAluno.appendChild(inputButton);

          divAlunos.appendChild(boxAluno);
        }
      }
    }
  })
}

function fecharInfo(){

  document.getElementById('nome-show').value="";
  document.getElementById('data-show').value="";
  document.getElementById('endereco-show').value="";
  document.getElementById('cpf-show').value="";
  document.getElementById('sexo-show').value="";
  document.getElementById('servico-show').value="";
  document.getElementById('tell-show').value="";
  document.getElementById('obs-show').value="";

  document.querySelector(".show").style.display="none";


}

function editInfos(){

  isConfirm = confirm("Manter alterações nos dados?");

  if(isConfirm){

  const editNome=document.getElementById('nome-show').value;
  const editData=document.getElementById('data-show').value;
  const editAdd=document.getElementById('endereco-show').value;
  const editCpf=document.getElementById('cpf-show').value;
  const editSexo=document.getElementById('sexo-show').value;
  const editServico=document.getElementById('servico-show').value;
  const editTell=document.getElementById('tell-show').value;
  const editObs=document.getElementById('obs-show').value;

  const db=firebase.firestore();

  const divId=document.querySelector(".edit").parentElement.id;

  const colecao=db.collection('alunos').doc(divId);

  colecao.update({
    nome: editNome,
    data: editData,
    add: editAdd,
    cpf: editCpf,
    sexo: editSexo,
    servico: editServico,
    tell: editTell,
    obs: editObs,
  }).then(()=>{
    alert('Dados editados com sucesso')

    fecharInfo()
    addTohtml()
  }).catch(error=>{
    alert(error.message)
  })

  alert(divId);

  }


}

async function findAlunos() {
  try {
    const AlunosCollection = firebase.firestore().collection("alunos");
    const snapshot = await AlunosCollection.get();
    let alunos = {}

    snapshot.forEach((doc) => {
      alunos[doc.id] = doc.data();
    });

    alunos = ordenarPorAlfabeto(alunos);
    console.log(alunos);

    return alunos;
  } catch (error) {
    alert(error.message);
  }
}

function ordenarPorAlfabeto(alunos) {
  var ArrayObjetos = Object.entries(alunos);
  
  ArrayObjetos.sort(function(a, b) {
    var nomeA = a[1].nome.toUpperCase();
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
    objetosOrdenados[item[0]] = item[1];
  });

  return objetosOrdenados;
}

function converterIdade(dataNascimentostring) {
  if (dataNascimentostring) {
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
  } else {
    // Caso a data de nascimento seja undefined, retorne uma string vazia ou outra valor padrão
    return "";
  }
}

function dellAluno(button) {
  var docID = button.parentNode.id;
  const db = firebase.firestore();
  var pacienteDell = db.collection("alunos");

  isConfirm = confirm("Tem certeza que deseja deletar esse paciente?");

  if (isConfirm) {
    pacienteDell
      .doc(docID)
      .delete()
      .then(() => {
        alert("Aluno deletado com sucesso");
        addTohtml();
      })
      .catch((error) => {
        alert("Erro ao deletar!");
      });
  }
}


addTohtml();
verifyAuthentication();
