/**
 * Esta función muestra un formulario de login
 * LLamando a la  función doLogin
 * Modifica el tag div con id main en el html
 */
function showLogin() {

    let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
    html += `
    <form class="formulario">
        <label for="user">Usuario:</label>
        <input type="text" id="user" name="user" required>
        <br><br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required>
        <br><br>
        <input type="button" onclick="doLogin()" value="Iniciar Sesión" class='boton-log'>
    </form>`;
    document.getElementById('main').innerHTML = html;
}
/**
 * Esta función recolecta los valores ingresados login.pl
 * La respuesta del CGI es procesada por la función loginResponse
 */
function doLogin(){
    console.log('dologin esta ejecutando');

    let user = document.getElementById('user').value;
    let password = document.getElementById('password').value;
    // Realizar una solicitud Fetch al servidor
    fetch('login.pl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'user=' + encodeURIComponent(user) + '&password=' + encodeURIComponent(password),
    })
    .then(response => response.text())
    .then(data => {
         var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
         console.log('Respuesta del servidor:', xml);
         loginResponse(xml);
    })
    .catch(error => console.error('Error:', error));
}

/**
 * Se inicializa la variable userFullName y userKey (e usuario)
 * termina invocando a la funcion sesionIniciada.
 */
function loginResponse(xml) {
    
    console.log('loginResponse esta ejecutando');
    const userElement = xml.querySelector('user');

    if (userElement) {
        const ownerElement = userElement.querySelector('owner');
        const firstNameElement = userElement.querySelector('firstName');
        const lastNameElement = userElement.querySelector('lastName');

        if (ownerElement && firstNameElement && lastNameElement) {
          console.log('datos correctos');
            // Inicializa las variables globales
            userFullName = `${firstNameElement.textContent} ${lastNameElement.textContent}`;
            userKey = ownerElement.textContent;
            // Llama a la función sesionIniciada con los datos del usuario
           sesionIniciada(userFullName, userKey);
            return;
        }
        console.log('Datos incorrectos');
        alert('Los datos son incorrectos o el usuario no existe.');
    }
}
/**
 * Actualizar el tag con id userName en el HTML
 * termina invocando a las functiones showWelcome y showMenuUserLogged
 */
function sesionIniciada(userFullName, userKey){
    console.log('showLoggedIn');
  // Actualiza el tag con id userName en el HTML con el nombre del usuario
    document.getElementById('userName').textContent = userFullName;

    // Llama a las funciones showWelcome y showMenuUserLogged
    showWelcome();
    showMenuUserLogged();
}
/**
 * Esta función crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la
 * función doCreateAccount
 * */
function showCreateAccount(){
    let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
    html += `
      <form class='formulario' >
      <label for="user">Usuario:</label>
      <input type="text" id="user" name="user" required>
      <br><br>
      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password" required>
      <br><br>
      <label for="lastName">Apellido:</label>
      <input type="text" id="lastName" name="lastName" required>
      <br><br>
      <label for="firstName">Nombre:</label>
      <input type="text" id="firstName" name="firstName" required>
      <br><br>
      <button type="button" onclick="doCreateAccount()"class='boton-log'>Enviar</button>
     </form>`;
    document.getElementById('main').innerHTML = html;
}

/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function doCreateAccount(){
  const user = document.getElementById('user').value;
  const password = document.getElementById('password').value;
  const lastName = document.getElementById('lastName').value;
  const firstName = document.getElementById('firstName').value;

  // Enviar la información al servidor
  fetch('register.pl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}&lastName=${encodeURIComponent(lastName)}&firstName=${encodeURIComponent(firstName)}`,
  })
    .then(response => response.text())
    .then(data => {
      console.log('Registrarse datos',data);
      // Procesar la respuesta del servidor
      showLogin();
    })
}

/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
function doList(){
  const userName = userKey;
  console.log('doList');

    fetch('list.pl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'usuario=' + encodeURIComponent(userName),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
        showList(xmlDoc);
    })
    .catch(error => console.error('Error:', error));


}

/**
 * Esta función recibe un objeto XML con la lista de artículos de un usuario
 * y la muestra incluyendo:
 * - Un botón para ver su contenido, que invoca a doView.
 * - Un botón para borrarla, que invoca a doDelete.
 * - Un botón para editarla, que invoca a doEdit.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function showList(xml){
  console.log('showList');

  const articles = xml.querySelectorAll('article');
  const listContainer = document.getElementById('main'); // Assuming you have a container element in your HTML to display the list

  if (articles.length === 0) {
    listContainer.innerHTML = '<p>No hay articulos.</p>';
    return;
  }

  listContainer.innerHTML = '';

  articles.forEach(article => {
    const owner = article.querySelector('owner').textContent;
    const title = article.querySelector('title').textContent;

    const articleContainer = document.createElement('div');
    articleContainer.classList.add('article-item');

    articleContainer.innerHTML = `
      <p><strong>Titulo:</strong> ${title}</p>
      <button onclick="doView('${owner}', '${title}')"class='boton-Op'>Ver</button>
      <button onclick="doDelete('${owner}', '${title}')"class='boton-Op'>Eliminar</button>
      <button onclick="doEdit('${owner}', '${title}')"class='boton-Op'>Editar</button>
    `;

    listContainer.appendChild(articleContainer);
  });
}

/**
 * Esta función deberá generar un formulario para la creación de un nuevo
 * artículo, el formulario deberá tener dos botones
 * - Enviar, que invoca a doNew
 * - Cancelar, que invoca doList
 */
function showNew(){
  console.log('shownew');
  let html = `
    <form id="newForm">
      <label for="titulo">Título :</label>
      <input type="text" id="titulo" name="titulo">
      <br><br>
      <textarea name="text_intro" rows="5" cols="50"></textarea><br><br>
      <button type="button" onclick="doNew()"class='boton-Op'>Enviar</button>
      <button type="button" onclick="doList()"class='boton-Op'>Cancelar</button>
    </form>`;
    document.getElementById('main').innerHTML = html;

}
/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 * los datos deberán ser extraidos del propio formulario
 * La acción de respuesta al CGI deberá ser una llamada a la
 * función responseNew
 */
function doNew(){
  console.log('doNew');
  const titulo = document.getElementById('titulo').value;
  const texto = document.querySelector('textarea[name="text_intro"]').value;

  // Obtén el valor de usuario desde la variable global userKey
  const usuario = userKey;
  console.log('usuario',usuario);
  // Enviar la información al servidor
  fetch('new.pl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `titulo=${encodeURIComponent(titulo)}&text_intro=${encodeURIComponent(texto)}&usuario=${encodeURIComponent(usuario)}`
  })
    .then(response => response.text())
    .then(data => {
      // Procesar la respuesta del servidor
      console.log('respuesta enviada',data);
      doList();
    })
    .catch(error => console.error('Error en doNew:', error));

  // Devolver false para prevenir la recarga de la página
  return false;
}
/*
 * Esta función invoca al CGI view.pl, la respuesta del CGI debe ser
 */
function doView(owner, title){
  const viewContainer=document.getElementById('main');

  console.log('doView');
  fetch('view.pl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `usuario=${encodeURIComponent(owner)}&titulo=${encodeURIComponent(title)}`,
    })
    .then(response => response.text())
    .then(data => {
        console.log('Respuesta del servidor (doView):', data);
        viewContainer.innerHTML=data;

    })
    .catch(error => {
        console.error('Error en doView:', error);
       // responseView('Error al obtener la vista.');
    });



}

/*
 * Esta función muestra la respuesta del cgi view.pl en el HTML o
 * un mensaje de error en caso de algún problema.
 */
function responseView(response){
  const viewContainer = document.getElementById('main');

    if (viewContainer) {
        viewContainer.innerHTML = response;
    } else {
        console.error('Elemento con id "view-container" no encontrado.');
    }
}

/*
 * Esta función invoca al CGI delete.pl recibe los datos del artículo a
 * borrar como argumentos, la respuesta del CGI debe ser atendida por doList
 */
function doDelete(owner, title){
   fetch('delete.pl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `usuario=${encodeURIComponent(owner)}&titulo=${encodeURIComponent(title)}`,
  })
    .then(response => response.text())
    .then(data => {
      // Procesar la respuesta del servidor si es necesario
      console.log('Respuesta del servidor (doDelete):', data);
      alert('Archivo eliminado');
      doList(); // Actualizar la lista después de eliminar
    })
    .catch(error => console.error('Error en doDelete:', error));

}

/*
 * Esta función recibe los datos del articulo a editar e invoca al cgi
 * article.pl la respuesta del CGI es procesada por responseEdit
 */
function doEdit(owner, title){
  fetch('article.pl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `usuario=${encodeURIComponent(owner)}&titulo=${encodeURIComponent(title)}`,
  })
    .then(response => response.text())
    .then(data => {
      console.log('Respuesta del servidor(doEdit)',data);
      responseEdit(data); // Procesar la respuesta de la edición
    })
    .catch(error => console.error('Error en doEdit:', error));

}

/*
 * Esta función recibe la respuesta del CGI data.pl y muestra el formulario
 * de edición con los datos llenos y dos botones:
 * - Actualizar que invoca a doUpdate
 * - Cancelar que invoca a doList
 */
function responseEdit(xmlString){
  console.log('responseEdit');
  const editContainer = document.getElementById('main');

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const articleElement = xmlDoc.querySelector('article');

  if (articleElement) {
    const owner = articleElement.querySelector('owner').textContent;
    const title = articleElement.querySelector('title').textContent;
    const text = articleElement.querySelector('text').textContent;

    let html = `
      <form id="updateForm">
        <input type="hidden" name="titulo" value="${title}">
        <textarea name="text_intro" rows="5" cols="50" >${text}</textarea><br>
        <button type="button" onclick="doUpdate('${title}')"class='boton-Op'>Enviar</button>
        <button type="button" onclick="doList()"class='boton-Op'>Cancelar</button>
      </form>`;

    editContainer.innerHTML = html;

    // Agregar un evento onsubmit al formulario para prevenir la recarga de la página
    document.getElementById('updateForm').onsubmit = function(event) {
      event.preventDefault();
    };
  }
}
/*
 * Esta función recibe el título del artículo y con la variable userKey y
 * lo llenado en el formulario, invoca a update.pl
 * La respuesta del CGI debe ser atendida por responseNew
 */
function doUpdate(title){
  console.log('doUpdate');
  const userFullName = window.userFullName;
  const userKey = window.userKey;

  if (userFullName && userKey) {
    const newText = document.querySelector('textarea[name="text_intro"]').value;

    // Enviar la información al servidor
    fetch('update.pl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `usuario=${encodeURIComponent(userKey)}&titulo=${encodeURIComponent(title)}&texto=${encodeURIComponent(newText)}`,

    })
      .then(response => response.text())
      .then(data => {
        console.log('Respuesta',data);
        // Procesar la respuesta del servidor
         doList();
        //responseNew(data);
      })
      .catch(error => console.error('Error en doUpdate:', error));
  } else {
    console.error('Las variables userFullName y userKey no están definidas.');
  }
}













