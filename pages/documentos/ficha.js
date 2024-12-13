 
document.getElementById("backgroundImage").style.opacity = "0.15"; // Altera a opacidade para 50%

 document.addEventListener('DOMContentLoaded', function(){

    setTimeout(function(){
        addRodape();

    }, 3000);
 })
const arrayInfos=JSON.parse(localStorage.getItem("arrayInfos"));

       //cabecario

       const divCabecario = document.querySelector(".cabecario");

       // Lista de informações dinâmicas
       const infos = [
           { label: "Nome do paciente:", value: arrayInfos[0] },
           { label: "Nome do profissional:", value: arrayInfos[3] },
           { label: "Tipo de atendimento:", value: "Acompanhamento psicologico" },
           { label: "Período:", value: `${formateDate(arrayInfos[1])} até ${formateDate(arrayInfos[2])}` }
        ];
       
       // Loop para adicionar as informações aos spans e inserir dentro da div
       infos.forEach(info => {
           const span = document.createElement("span");
           const strong = document.createElement("strong");
           strong.textContent = `${info.label} `;
       
           const text = document.createTextNode(info.value);
           
           span.appendChild(strong);
           span.appendChild(text);
           
           divCabecario.appendChild(span);
       });
         
       
 function addRodape(){


     const divRodape = document.getElementById("rodape");
     
     // Criando os elementos
     const linhasAss = document.createElement("strong");
     linhasAss.innerHTML = "_______________________________________";
     
     const nomePsi = document.createElement("span");
     nomePsi.className = "psicologa";
     nomePsi.innerHTML = arrayInfos[3];
     
     const funcaoPsi = document.createElement("span");
     funcaoPsi.className = "psicologa";
     funcaoPsi.innerHTML = "Psicóloga";
     
     const crpPsi = document.createElement("span");
     crpPsi.className = "psicologa";
     crpPsi.innerHTML = "CRP: " + arrayInfos[4];
     
     // Adicionando os elementos à divRodape
     divRodape.appendChild(linhasAss);
     divRodape.appendChild(nomePsi);
     divRodape.appendChild(funcaoPsi);
     divRodape.appendChild(crpPsi);
    }

    function formateDate(formatoISO) {
        // Divide a data pelo hífen
        const [ano, mes, dia] = formatoISO.split("-");
      
        // Retorna a data no formato DD-MM-AAAA
        return `${dia}/${mes}/${ano}`;
      }