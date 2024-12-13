let user; // Variável global para armazenar o usuário autenticado

// Verifica se o usuário está autenticado
function verifyAuthentication() {
    firebase.auth().onAuthStateChanged(function (currentUser) {
        user = currentUser;
        if (!user) {
            window.location.href = "../../index.html"; // Redireciona para login
        } else {
            document.body.style.visibility = "visible";
            carregarPacientes(); // Carrega pacientes
        }
    });
}
verifyAuthentication();

// Carrega pacientes do Firestore
function carregarPacientes() {
    const db = firebase.firestore();
    const pacientes = [];

    db.collection("pacientes").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                pacientes.push({ id: doc.id, ...doc.data() });
            });
            popularSelect(pacientes);
        })
        .catch((error) => console.log("Erro ao buscar pacientes:", error));
}

// Preenche selects com nomes dos pacientes
function popularSelect(pacientes) {
    const selects = ["paciente-anaminese", "name", "nameToShowAna","paciente-anaminese-edit"];

    selects.forEach((selectId) => {
        const select = document.getElementById(selectId);
        select.innerHTML = ""; // Limpa opções

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Selecione um paciente";
        select.appendChild(defaultOption);

        pacientes.forEach((paciente) => {
            const option = document.createElement("option");
            option.value = paciente.nome;
            option.text = paciente.nome;
            select.appendChild(option.cloneNode(true)); // Clona a opção para outros selects
        });
    });
}

// Abre o formulário de prontuário
function newAnaminese() {
    document.getElementById("newAnaminese").style.display = "block";
    let todayDate = new Date().toISOString().split('T')[0];
    document.getElementById("dataAtendimento").value = todayDate;

    const fields = ["paciente-anaminese", "obj-ana", "rel-ana", "inter-ana", "evo-ana", "obs-ana"];
    fields.forEach(field => document.getElementById(field).value = "");
}

// Salva um novo prontuário no Firestore
function salvarAna() {
    if (!user) {
        alert("Usuário não autenticado. Não é possível salvar a anamnese.");
        return;
    }

    const anamneseData = {
        nome: document.getElementById("paciente-anaminese").value,
        dataAtendimento: document.getElementById("dataAtendimento").value,
        objetivo: document.getElementById("obj-ana").value,
        relato: document.getElementById("rel-ana").value,
        intervencao: document.getElementById("inter-ana").value,
        evolucao: document.getElementById("evo-ana").value,
        observacoes: document.getElementById("obs-ana").value,
    };

    firebase.firestore().collection(`usuarios/${user.uid}/prontuarios`).add(anamneseData)
        .then(() => {
            alert("Prontuário salvo com sucesso!");
            carregarPacientes();
            cancelAna();
        })
        .catch((error) => {
            console.error("Erro ao salvar o prontuário: ", error);
            alert("Erro ao salvar o Prontuário. Tente novamente.");
        });
}

// Cancela o formulário de prontuário
function cancelAna() {
    document.getElementById("newAnaminese").style.display = "none";
}

// Busca prontuário pelo nome e data
function buscarProntuario() {
    if (!user) {
        alert("Usuário não autenticado. Não é possível buscar a anamnese.");
        return;
    }

    const nomePaciente = document.getElementById("nameToShowAna").value;
    const dataAtendimento = document.getElementById("dateToFind").value;

    if (!nomePaciente || !dataAtendimento) {
        alert("Por favor, selecione um paciente e informe a data.");
        return;
    }

    const db = firebase.firestore();
    db.collection(`usuarios/${user.uid}/prontuarios`)
        .where("nome", "==", nomePaciente)
        .where("dataAtendimento", "==", dataAtendimento)
        .get()
        .then((querySnapshot) => {
            const container = document.getElementById("divContainer");
            container.innerHTML = "";

            if (querySnapshot.empty) {
                alert("Nenhum prontuário encontrado.");
                return;
            }

            querySnapshot.forEach((doc) => criarDivProntuarios(doc.id, doc.data()));
        })
        .catch((error) => {
            console.error("Erro ao buscar Prontuário:", error);
            alert("Erro ao buscar Prontuário. Tente novamente.");
        });
}

// Cria uma div para exibir prontuários encontrados
function criarDivProntuarios(docId, prontuarioData) {
    const container = document.getElementById("divContainer");

    const novaDiv = document.createElement("div");
    novaDiv.id = docId;
    novaDiv.className = "showing";

    novaDiv.innerHTML = `
        <span>Nome: ${prontuarioData.nome || 'Nome não disponível'} </span>
        <span>Data: ${prontuarioData.dataAtendimento || 'Data não disponível'}</span>
        <input type="button" value="Deletar" id="delete-${docId}" class="delete-btn">
    `;

    container.appendChild(novaDiv);

    novaDiv.addEventListener("click", () => editProntuario(prontuarioData,docId));

    document.getElementById(`delete-${docId}`).addEventListener("click", (event) => {
        event.stopPropagation(); // Impede que o clique na div dispare também
        deletarAnamnese(docId);
    });
}

function cancelEdit() {
    
    document.getElementsByClassName("editAna")[0].style.display = "none";
    const fields = [
        "paciente-anaminese-edit", "dataAtendimento-edit", "obj-ana-edit",
        "rel-ana-edit", "inter-ana-edit", "evo-ana-edit", "obs-ana-edit"
    ];
    fields.forEach(field =>{
        document.getElementById(field).value='';
    })
}

// Edita prontuário
function editProntuario(prontuarioData,docId) {

    document.getElementsByClassName("editAna")[0].style.display="block";
    document.getElementsByClassName("editAna")[0].id=docId;
    

    const selectElement = document.getElementById("paciente-anaminese-edit");
    const optionExists = Array.from(selectElement.options).some(
        (option) => option.value === prontuarioData.nome
    );

    if (optionExists) {
        selectElement.value = prontuarioData.nome;
        
    document.getElementById("dataAtendimento-edit").value=prontuarioData.dataAtendimento;
    document.getElementById("obj-ana-edit").value=prontuarioData.objetivo;
    document.getElementById("rel-ana-edit").value=prontuarioData.relato;
    document.getElementById("inter-ana-edit").value=prontuarioData.intervencao;
    document.getElementById("evo-ana-edit").value=prontuarioData.evolucao;
    document.getElementById("obs-ana-edit").value=prontuarioData.observacoes;

    } else {
        console.warn(`Paciente "${prontuarioData.nome}" não encontrado.`);
    }

    
}
function salvarEdicao(event){

    const prontuarioId=event.target.parentElement.id;

    const protuarioEditData={
        nome: document.getElementById("paciente-anaminese-edit").value,
        dataAtendimento: document.getElementById("dataAtendimento-edit").value,
        objetivo: document.getElementById("obj-ana-edit").value,
        relato: document.getElementById("rel-ana-edit").value,
        intervencao: document.getElementById("inter-ana-edit").value,
        observacoes: document.getElementById("obs-ana-edit").value,

    }

    firebase.firestore().collection(`usuarios/${user.uid}/prontuarios`).doc(prontuarioId).update(protuarioEditData).then(()=>{
        alert("Prontuário atualizado com sucesso!");
        carregarPacientes();
        cancelEdit();
        buscarProntuario();
    })


}
// Deleta um prontuário do Firestore
function deletarAnamnese(docId) {
    const confirmacao = confirm("Tem certeza de que deseja deletar este prontuário?");
    
    if (!confirmacao) {
        return; // Se o usuário cancelar, interrompe a função
    }

    const db = firebase.firestore();
    db.collection(`usuarios/${user.uid}/prontuarios`).doc(docId).delete()
        .then(() => {
            console.log("Prontuário deletado com sucesso!");
            document.getElementById(docId).remove();
            alert("Prontuário deletado com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao deletar a anamnese: ", error);
            alert("Erro ao deletar a anamnese. Tente novamente.");
        });
}
