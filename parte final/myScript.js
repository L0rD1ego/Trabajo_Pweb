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
 * indicando que los datos de usuario y contraseña no coinciden.
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
 * Invoca las functiones showWelcome y showMenuUserLogged
 */
function sesionIniciada(userFullName, userKey){
    console.log('sesionIniciada');
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
 * función crearCuenta
 * */
function formCrearCuenta(){
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
      <button type="button" onclick="crearCuenta()"class='boton-log'>Enviar</button>
     </form>`;
    document.getElementById('main').innerHTML = html;
}
/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function crearCuenta(){
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
    .then(response => response.text());
    showLogin();
}

/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por mostrarLista
 */
function lista(){
  const userName = userKey;
  console.log('lista');

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
        //const xml = new DOMParser().parseFromString(data, 'text/xml');
        var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
        mostrarLista(xml);
    })
    .catch(error => console.error('Error:', error));


}

/**
 * - Un botón para ver su contenido, que invoca a verArchivo.
 * - Un botón para borrarla, que invoca a eliminar.
 * - Un botón para editarla, que invoca a editar.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function mostrarLista(xml){
  console.log('mostrarLista');

  const articles = xml.querySelectorAll('article');
  const contenedor = document.getElementById('main');
  if (articles.length === 0) {
    contenedor.innerHTML = '<p>No hay articulos.</p>';
    return;
  }

  contenedor.innerHTML = '';
 articles.forEach(article => {
    const owner = article.querySelector('owner').textContent;
    const title = article.querySelector('title').textContent;

    const articulos = document.createElement('div');
    articulos.classList.add('article-item');

    articulos.innerHTML = `
      <p><strong>Titulo:</strong> ${title}</p>
      <button onclick="verArchivo('${owner}', '${title}')"class='boton-Op'>Ver</button>
      <button onclick="eliminarArchivo('${owner}', '${title}')"class='boton-Op'>Eliminar</button>
      <button onclick="editarArchivo('${owner}', '${title}')"class='boton-Op'>Editar</button>
    `;

    contenedor.appendChild(articulos);
  });
}

/**
 * Dos botones
 * - Enviar, que invoca a nuevoArticulo
 * - Cancelar, que invoca a Lista
 */
function formNuevoArticulo(){
  console.log('nuevoArticulo');
  let html = `
    <form id="newForm">
      <label for="titulo">Título :</label>
      <input type="text" id="titulo" name="titulo">
      <br><br>
      <textarea name="text_intro" rows="5" cols="50"></textarea><br><br>
      <button type="button" onclick="nuevoArticulo()"class='boton-Op'>Enviar</button>
      <button type="button" onclick="lista()"class='boton-Op'>Cancelar</button>
    </form>`;
    document.getElementById('main').innerHTML = html;

}
/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 */
function nuevoArticulo(){
  console.log('nuevoArticulo');
  const titulo = document.getElementById('titulo').value;
  const texto = document.querySelector('textarea[name="text_intro"]').value;

  // Obtén el valor de usuario desde la variable global userKey
  const usuario = userKey;
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
      lista();
    })
    .catch(error => console.error('Error en nuevoArticulo:', error));

  // Devolver false para prevenir la recarga de la página
  return false;
}

/*
 * Esta función invoca al CGI view.pl
 */
function verArchivo(owner, title){

  fetch('view.pl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `usuario=${encodeURIComponent(owner)}&titulo=${encodeURIComponent(title)}`,
    })
    .then(response => response.text())
    .then(data => {
        console.log('verArchivo:', data);
        document.getElementById('main').innerHTML=data;

    })
    .catch(error => {
        console.error('Error en verArchivo:', error);
    });
}

/*
 * Esta función invoca al CGI delete.pl
 */
function eliminarArchivo(owner, title){
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
      console.log('Respuesta del servidor (eliminarArchivo):', data);
      alert('Archivo eliminado');
      lista(); // Actualizar la lista después de eliminar
    })
    .catch(error => console.error('Error en eliminarArchivo:', error));

}
/*
 * Esta función recibe los datos del articulo a editar e invoca al cgi
 * article.pl la respuesta del CGI es procesada por responseEdit
 */
function editarArchivo(owner, title){
  fetch('article.pl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `usuario=${encodeURIComponent(owner)}&titulo=${encodeURIComponent(title)}`,
  })
    .then(response => response.text())
    .then(data => {
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      console.log('Respuesta del servidor(editarArchivo)',xml);
      formEditar(xml);
    })
    .catch(error => console.error('Error en editarArchivo:', error));

}

/*
 * - Actualizar que invoca a actualizarArt
 * - Cancelar que invoca a lista
 */
function formEditar(xml){
  console.log('formEditar');
  const editContainer = document.getElementById('main');

  const articleElement = xml.querySelector('article');

  if (articleElement) {
    const owner = articleElement.querySelector('owner').textContent;
    const title = articleElement.querySelector('title').textContent;
    const text = articleElement.querySelector('text').textContent;

    let html = `
      <form id="editar">
        <input type="hidden" name="titulo" value="${title}">
        <textarea name="text_intro" rows="5" cols="50" >${text}</textarea><br>
        <button type="button" onclick="actualizarArt('${title}')"class='boton-Op'>Enviar</button>
        <button type="button" onclick="lista()"class='boton-Op'>Cancelar</button>
      </form>`;

    editContainer.innerHTML = html;
  }
}
/*
 * Invoca a update.pl
 */
function actualizarArt(title){
  console.log('actualizarArt');
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
         lista();
      })
      .catch(error => console.error('Error en actualizarArt:', error));
  } else {
    console.error('Las variables userFullName y userKey no están definidas.');
  }
}

