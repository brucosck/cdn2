var progressBar = 0;
var count = 1;
var myDropzone = new Dropzone("div#dzf", {url:"#", addRemoveLinks: true});
Dropzone.autoDiscover = false;


function sendFileToDrive(file, ticket) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var content = reader.result;
    //console.log('Sending ' + file.name);
    //var currFolder = 'Something';
    google.script.run.withSuccessHandler(updateProgressbar).uploadFileToDrive(content, file.name, ticket);
  }
  reader.readAsDataURL(file);
}

function updateProgressbar( idUpdate ){
   if (idUpdate) {count++}
   //numUploads.done++;
   var porc = Math.ceil((count / progressBar)*100);
   $("#pbar").css("width", porc+"%");
   $("#pbarinfo").text(porc+"% / "+idUpdate);
   if( count == progressBar ){
      $("#pbarinfo").text("Complete");
      count = 0;
      registerSuccess("Registrado");
   };
}
function sendFiles(ticket){
  for (f in myDropzone.files) {
    sendFileToDrive(myDropzone.files[f], ticket);
  }
}

// Read the file on form submit
function submitForm() {
  var form = document.forms.namedItem("formTicket");
  progressBar = myDropzone.files.length + 1;
  document.getElementById("pbarm").classList.remove("hidden");

  var data = {idClient: '1', //document.getElementById("idUser").value,
              subject: 'teste',//form.elements.subject.value,
              type: 'incident',//form.elements.type.value,
              status: 'open',
              priority: 'baixa',
              description: 'teste123'};//form.elements.description.value};
  
  if (myDropzone.files.length > 0){
    for(v in data){
      if (data[v] == "" || data[v] == "---"){
      return alert("Todos os campos com * precisam ser preenchidos");
      }
    }
    google.script.run.withSuccessHandler(sendFiles).insertTicket(data);
    return;
  }
  for(v in data){
    if (data[v] == "" || data[v] == "---"){
    return alert("Todos os campos com * precisam ser preenchidos");
    }
  }
  google.script.run.withSuccessHandler(registerSuccess).insertTicket(data);
}

function registerSuccess(e){
  var form = document.forms.namedItem("formTicket");
  form.elements.subject.value = "";
  form.elements.type.value = "";
  form.elements.description.value = "";
  myDropzone.removeAllFiles();
  //alert(e);
  setTimeout(function () {
    document.getElementById("pbarm").classList.add("hidden");
    $("#pbar").css("width", 0+"%");
  }, 10000);
}
