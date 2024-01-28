var userFullName = '';
var userKey = '';

//window.addEventListener('load',showWelcome);
function showWelcome(){
  let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
  document.getElementById('main').innerHTML = html;
}

function showMenuUserLogged() {
  console.log('showMenuUserLogged está siendo llamada');
  let html = "<div id='menu'>"+
    "<p class='menu' onclick='lista()'>Lista de Páginas</p>\n"+
    "<p class='menu' onclick='formNuevoArticulo()'>Página Nueva</p>\n"+
    "</div>";
  let inicioElem = document.getElementById('inicio');
  inicioElem.innerHTML = html;
  inicioElem.style.width = '200px'; // Cambia el ancho
}
