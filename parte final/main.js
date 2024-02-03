var userFullName = '';
var userKey = '';

function showWelcome(){
  let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
  document.getElementById('main').innerHTML = html;
}

function showMenuUserLogged() {
  console.log('showMenuUserLogged está siendo llamada');
  let html = "<div id='menu'>"+
      "<div class='usuario'>"+
        "<div class ='icon-usuario'>"+
            "<i class='bx bxs-user'></i>"+
        "</div>"+
        "<p class ='nombre-usuario'>"+ userFullName + "</p>"+
      "</div>"+
      "<p class='menu' onclick='lista()'>Lista de Páginas</p>\n"+
      "<p class='menu' onclick='formNuevoArticulo()'>Página Nueva</p>\n"+
    "</div>";
  let inicioElem = document.getElementById('inicio');
  inicioElem.innerHTML = html;
  let formContainerElem = document.querySelector('.form-container');
  formContainerElem.style.width = '1500px'; //  ancho
  formContainerElem.style.height = '680px';
  formContainerElem.style.marginTop = '10px';
  let mainElem2 =document.querySelector('.main');
  mainElem2.style.width='80%';

}


