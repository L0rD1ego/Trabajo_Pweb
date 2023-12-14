/**
 * Esta función muestra un formulario de login 
 * Modifica el tag div con id main en el html
 */
function showLogin() {

    let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
    html += `
    <form action="#" onsubmit="doLogin(); return false;">
        <label for="user">Usuario:</label>
        <input type="text" id="user" name="user" required>
        <br><br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required>
        <br><br>
        <input type="submit" value="Iniciar Sesión" class="boton-log">
    </form>`;
    document.getElementById('main').innerHTML = html;
}
/**
 * Esta función recolecta los valores del login.pl
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
   .then(response => response.text())// Convertir la respuesta a texto
   //Maneja los datos de la respuesta
   .then(data => {
        console.log('Respuesta del servidor:', data);
        // Parsear la respuesta como un documento XML utilizando DOMParser
        loginResponse(new DOMParser().parseFromString(data, 'text/xml'));
        document.getElementById('main').innerHTML = data;
   })
   .catch(error => console.error('Error:', error));
}
/**
* Esta función recibe una respuesta en un objeto XML
* Si la respuesta es correcta, recolecta los datos del objeto XML
* e inicializa la variable userFullName y userKey (e usuario)
* termina invocando a la funcion showLoggedIn.
* Si la respuesta es incorrecta indica que tiene mal los datos.
*/
function loginResponse(xml) {
    console.log('loginResponse esta ejecutando');
 
   const userElement = xml.querySelector('user');
 
     if (userElement) {
         const ownerElement = userElement.querySelector('owner');
         const firstNameElement = userElement.querySelector('firstName');
         const lastNameElement = userElement.querySelector('lastName');
 
         if (ownerElement && firstNameElement && lastNameElement) {
             // Inicializa las variables globales
             userFullName = `${firstNameElement.textContent} ${lastNameElement.textContent}`;
             userKey = ownerElement.textContent;
 
             // Llama a la función showLoggedIn con los datos del usuario
             showLoggedIn(userFullName, userKey);
             return;
         }
            console.log('Datos incorrectos');
            alert('Los datos son incorrectos o el usuario no existe.');
        }
 
 }
 /**
  * esta función usa la variable userFullName, para actualizar el id userName en el HTML
  * termina invocando a las functiones showWelcome y showMenuUserLogged
  */
 function showLoggedIn(userFullName, userKey){
     console.log('showLoggedIn');
   // Actualiza el tag con id userName en el HTML con el nombre del usuario
     document.getElementById('userName').textContent = userFullName;
 
     // Llama a las funciones showWelcome y showMenuUserLogged
     showWelcome();
     showMenuUserLogged();
 }
/**
 * Crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la
 * función doCreateAccount
 * */
function showCreateAccount(){
    let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
    html += `
    <form >
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
      <button type="button" onclick="doCreateAccount()"class="boton-log">Enviar</button>
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
    /*realizamos la solicitud*/
        fetch('list.pl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'usuario=' + encodeURIComponent(userName),
        })
        /*manejamos los datos de la respuesta*/
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
   * y la muestra con 
   * - Un botón ver : doView.
   * - Un botón eliminar : doDelete.
   * - Un botón editar: doEdit.
   * Si esta vacio, mostrara un mensaje.
   */
  function showList(xml){
    console.log('showList');
  
    const articles = xml.querySelectorAll('article');
    const listContainer = document.getElementById('main'); 
  
    if (articles.length === 0) {
      listContainer.innerHTML = '<p>No hay articulos.</p>';
      return;
    }
  
    listContainer.innerHTML = '';
    /*Iterando sobre un conjunto de elementos articles 
    Creando un nuevo contenedor <div> con la clase 'article-item'. 
    .Luego configura el  contenido interno de ese contenedor con información específica del artículo y botones*/ 
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
   * Formulario para la creación de un nuevo tiene dos botones
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
        <button type="button" onclick="doNew()">Enviar</button>
        <button type="button" onclick="doList()">Cancelar</button>
      </form>`;
      document.getElementById('main').innerHTML = html;
  
  }
  /*
   * Invocará new.pl para resgitrar un nuevo artículo
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
        showList();
      })
      .catch(error => console.error('Error en doNew:', error));
  
    // Para prevenir la recarga de la página
    return false;
  }
  
  /*
   * Invoca al CGI view.pl, la respuesta del CGI debe ser
   * atendida por responseView
   */
  function doView(owner, title){
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
          responseView(data);
      })
      .catch(error => {
          console.error('Error en doView:', error);
          responseView('Error al obtener la vista.');
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
 * Invoca al CGI delete.pl recibe los datos del artículo a
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
       // Procesar la respuesta del servidor 
       console.log('Respuesta del servidor (doDelete):', data);
       // Mensaje de alerta
       alert('Archivo Eliminado');
 
       doList(); // Actualizar la lista después de eliminar
     })
     .catch(error => console.error('Error en doDelete:', error));
 
 }
 
 /*
  * Invoca al cgi article.pl la respuesta del CGI es procesada por responseEdit
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
   * Recibe la respuesta y muestra el formulario
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

  
      // Agregamos un evento onsubmit al formulario para prevenir la recarga de la página
      document.getElementById('updateForm').onsubmit = function(event) {
        event.preventDefault();
      };
    }
  }
  /*
   * Esta función recibe el título del artículo y con la variable userKey y
   * lo llenado en el formulario, invoca a update.pl
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
          //invocar al dolist()
           doList();
        })
        .catch(error => console.error('Error en doUpdate:', error));
    } else {
      console.error('Las variables userFullName y userKey no están definidas.');
    }
  }
  
  
           
       