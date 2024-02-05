var userFullName = '';
var userKey = '';

function showMenuUserLogged() {
  console.log('showMenuUserLogged está siendo llamada');
  let html = "<div id='menu'>"+
      "<div class='usuario'>"+
        "<div class ='icon-usuario'>"+
            "<i class='bx bxs-user'></i>"+
        "</div>"+
        "<h4 class ='nombre-usuario'>"+ userFullName + "</h4><hr>"+
      "</div>"+
      "<p id = 'listaPaginas' class='menu' onclick='lista()'>Lista de Páginas</p>\n"+
      "<p id = 'paginaNueva' class='menu' onclick='formNuevoArticulo()'>Página Nueva</p>\n<hr>"+

    "</div>"+
    "<div class='menuOp'>"+
      "<details>"+
          "<summary> Ajustes </summary>"+
            "<button class= 'switch'  id='switch'>"+
              "<span><i class='bx bx-sun'></i></span>"+
              "<span><i class='bx bx-moon'></i></span>"+

            "</button >"+
            "<p id='seleccionTema' onclick='seleccionTema()'>Seleccion de tema </p>"+
        "</details>"+
    "</div>";
  let inicioElem = document.getElementById('inicio');
  inicioElem.innerHTML = html;
  inicioElem.style.display = 'block';
  let formContainerElem = document.querySelector('.form-container');
  formContainerElem.style.width = '1500px'; //  ancho
  formContainerElem.style.height = '680px';
  formContainerElem.style.marginTop = '10px';
  let mainElem2 =document.querySelector('.main');
  mainElem2.style.width='80%';
  let switchButton = document.querySelector('#switch');

  switchButton.addEventListener('click', () => {
    //document.body.classList.toggle('modo-dark');
    document.getElementById('inicio').classList.toggle('modo-dark');
    document.getElementById('main').classList.toggle('modo-dark');

    switchButton.classList.toggle('active');
  });

}

