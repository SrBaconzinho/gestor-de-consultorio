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

  function validateEmail(email) {
    // Regexp simples para validar email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function cadastrar() {
    let nomeCompleto = document.getElementById("nomeCompleto").value;
    let apelido = document.getElementById("apelido").value;
    let crp = document.getElementById("crp").value;
    let email = document.getElementById("email").value;
    let senha1 = document.getElementById("senha1").value;
    let senha2 = document.getElementById("senha2").value;

    if (!nomeCompleto || !apelido || !crp || !email || !senha1 || !senha2) {
        alert("Todos os campos devem ser preenchidos");
    } else if (senha1 !== senha2) {
        alert("As senhas devem coincidir");
    } else if (senha1.length < 6) {
        alert("A senha precisa ter pelo menos 6 dígitos");
    } else if (!validateEmail(email)) {
        alert("O E-mail não é válido!");
    } else {
        const db = firebase.firestore();
        const colecao = db.collection("responsavel");

        colecao.add({
            apelido: apelido,
            crp: crp,
            nome: nomeCompleto,
        }).then(() => {
            // Cadastro no Firestore bem-sucedido
            firebase.auth().createUserWithEmailAndPassword(email, senha1).then((userCredential) => {
                // Cadastro no Firebase Authentication bem-sucedido
                alert("Novo usuário cadastrado com sucesso!");
                // Limpar os campos do formulário
                document.getElementById("nomeCompleto").value = '';
                document.getElementById("apelido").value = '';
                document.getElementById("crp").value = '';
                document.getElementById("email").value = '';
                document.getElementById("senha1").value = '';
                document.getElementById("senha2").value = '';
            }).catch((error) => {
                // Tratar erros do Firebase Authentication
                let errorCode = error.code;
                let errorMessage = error.message;
                alert(`Erro ao criar usuário: ${errorMessage}`);
            });
        }).catch((error) => {
            // Tratar erros do Firestore
            console.error("Erro ao adicionar documento: ", error);
            alert("Erro ao cadastrar no Firestore");
        });
    }
}

verifyAuthentication()