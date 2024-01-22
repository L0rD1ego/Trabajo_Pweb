var userFullName = '';
var userKey = '';

window.addEventListener('load', showWelcome);
function showWelcome(){
  let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
  html += `
          <p>Integrantes:</p>
          <ul>
            <li>Huacani Jara Denise Andrea</li>
            <li>Carbajal Gonzales Diego Alejandro </li>
            <li>Vilca Flores Johan</li>
            <li>Cahua Soto Franco Jesus</li>
            <li></li>
          </ul>`;
  document.getElementById('main').innerHTML = html;
}

function showMenuUserLogged(){
  console.log('showMenuUserLogged está siendo llamada');
  let html = "<p onclick='showWelcome()'>Inicio</p>\n"+
    "<p onclick='lista()'>Lista de Páginas</p>\n"+
    "<p onclick='formNuevoArticulo()'>Página Nueva</p>\n"
  document.getElementById('menu').innerHTML = html;
}


