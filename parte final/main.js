var userFullName = '';
var userKey = '';

window.addEventListener('load', showWelcome);
function showWelcome(){
  let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
  html += `
          <p>Este sistema fue desarrollado por alumnos del primer año de la Escuela Profesional de Ingeniería de Sistemas, de la Universidad Nacional de San Agustín de Arequipa</p>
          <p>Integrantes:</p>
          <ul>
            <li>Huacani Jara Denise Andrea</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>`;
  document.getElementById('main').innerHTML = html;
}

function showMenuUserLogged(){
  console.log('showMenuUserLogged está siendo llamada');
  let html = "<p onclick='showWelcome()'>Inicio</p>\n"+
    "<p onclick='doList()'>Lista de Páginas</p>\n"+
    "<p onclick='showNew()'>Página Nueva</p>\n"
  document.getElementById('menu').innerHTML = html;
}

