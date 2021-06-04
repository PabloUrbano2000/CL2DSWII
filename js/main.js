// EVENTOS DEL FORMULARIO REGISTRAR
var registrarseForm = document.querySelector('#registrarse-form');

// DETECTANDO BOTONES DE SIGN UP Y SIGN IN
var signInLink = document.getElementById('#linkSignIn');

var signUpLink = document.getElementById('#linkSignUp');

var emailGlobal = '';

registrarseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    var nombres = document.querySelector('#registrarse-nombre').value;
    var email = document.querySelector('#registrarse-email').value;    
    var password = document.querySelector('#registrarse-password').value;
    
    // metodo para registrarse

    auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {

      userCredential.user.updateProfile({
        displayName : nombres
      });
      const configuration = {
        url : 'https://localhost/CL2DSWIIPabloUrbano/public/'
      };
      userCredential.user.sendEmailVerification(configuration)
      .then(result => {
        console.log('Verifique su correo :)');
      })
      .catch(error =>{    
        console.error(error);
        });
        // llamamos a los servicios de firebase para desloguearse
        firebase.auth().signOut();
        registrarseForm.reset();

        //cerramos el modal
        $('#registrarseModal').modal('hide')

        console.log('correctamente registrado')

    })
    .catch(err => {
        console.error(err.message)
        //cerramos el modal
        $('#registrarseModal').modal('hide')
    })
});

// EVENTOS DE INGRESAR
const ingresarForm = document.querySelector('#ingresar-form')

ingresarForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#ingresar-email').value;
    const password = document.querySelector('#ingresar-password').value;

    auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {

        registrarseForm.reset();

        //cerramos el modal
        $('#ingresarModal').modal('hide')
        console.log('logueado correctamente por correo y contraseña')
    })
    .catch(err => {
      console.error(err.message);
    })
});


const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('sign out');
        emailGlobal = '';
        listaTareas.innerHTML ='';
    })
});


// google Login
const  googleBtn = document.querySelector('#googleSignIn')
googleBtn.addEventListener('click', e => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .then(result => {
        registrarseForm.reset();

        //cerramos el modal
        $('#ingresarModal').modal('hide')
        console.log('logueado correctamente')
    })
    .catch(err =>{
        console.error(err)
    })
    //cerramos el modal
    $('#ingresarModal').modal('hide')
})

// facebook login
const facebookBtn = document.querySelector('#facebookSignIn')
facebookBtn.addEventListener('click', e => {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
    .then(result => {
        console.log(result);
        console.log('sign in with facebook');
    })
    .catch(err => {
        console.error(err)
    })

    //cerramos el modal
    $('#ingresarModal').modal('hide')
})


// twitter login
const twitterBtn = document.querySelector('#twitterSignIn')
twitterBtn.addEventListener('click', e => {
    e.preventDefault();
    firebase.auth().languageCode = 'es';
    auth.useDeviceLanguage();
    const provider = new firebase.auth.TwitterAuthProvider();
    provider.setCustomParameters({
      'lang': 'es'
    });
    auth.signInWithPopup(provider)
    .then(result => {
        console.log(result);
        console.log('sign in with twitter');
    })
    .catch(err => {
        console.error(err)
    })
        
    //cerramos el modal
    $('#ingresarModal').modal('hide')
})



// metodo para que se obtenga todas las tareas
const obtenerTasks = (email) => db.collection('tasks').where('email', '==', email).get();

const obtenerTask = (id) => db.collection('tasks').doc(id).get();

const cuandoObtengaTareas = (callback) => db.collection('tasks').onSnapshot(callback);

const eliminarTarea = id => db.collection('tasks').doc(id).delete();

const actualizarTarea = (id, updatedTarea) => db.collection('tasks').doc(id).update(updatedTarea);



// Tareas por usuario
const listaTareas = document.querySelector('#tasks-contenedor');

const setupTareas = data => {
    if(data.length) {
        let html = '';
        cabecera = '<h4>Mis tareas Pendientes...</h4>';
        html += cabecera;
        data.forEach(doc => {
            // obtengo los datos del documento
            const tarea = doc.data();
            tarea.id = doc.id;
            if(tarea.foto!='' && tarea.archivo!=''){
              const div = `<div class="card card-body mt-2 border-primary">
              <h3 class="h4" style="text-align:center">${tarea.titulo}</h3>
              <div style="float:left;">
                <div style="width:50%;float:left; text-align:center">
                  <p class="p">${tarea.descripcion}</p>
                </div>
                <div style="width:50%;float:right; text-align:center">
                  <img style="width: 150px; height:150px;" src="${tarea.foto}" alt="no existe"></img>
                </div>
              </div>
              <div class="text-align:center">
                <a  class="btn btn-dark" href="${tarea.archivo}">Descarga tu archivo guardado</a>  
              </div>
              <div class="row" style="text-align:center;margin-top:10px;">
                <div class="col-6">
                  <button class ="btn btn-danger btn-delete btn-block" data-id="${tarea.id}"> Eliminar </button>
                </div>
                <div class="col-6">
                  <button class ="btn btn-success btn-edit btn-block" data-id="${tarea.id}"> Modificar </button>
                </div>
              </div>
            </div>`;  
            html += div;
            }
            else if(tarea.foto != ''){
              const div = `<div class="card card-body mt-2 border-primary">
              <h3 class="h4" style="text-align:center">${tarea.titulo}</h3>
              <div style="float:left;">
                <div style="width:50%;float:left; text-align:center">
                  <p class="p">${tarea.descripcion}</p>
                </div>
                <div style="width:50%;float:right; text-align:center">
                  <img style="width: 150px; height:150px;" src="${tarea.foto}" alt="no existe"></img>
                </div>
              </div>
              <div class="row" style="text-align:center;margin-top:10px;">
                <div class="col-6">
                  <button class ="btn btn-danger btn-delete btn-block" data-id="${tarea.id}"> Eliminar </button>
                </div>
                <div class="col-6">
                  <button class ="btn btn-success btn-edit btn-block" data-id="${tarea.id}"> Modificar </button>
                </div>
              </div>
            </div>`;  
            html += div;
            }
            else if(tarea.archivo != ''){
              const div = `<div class="card card-body mt-2 border-primary">
              <h3 class="h4" style="text-align:center">${tarea.titulo}</h3>
              <div style="float:left;">
                <div style="width:100%; text-align:center">
                  <p class="p">${tarea.descripcion}</p>
                </div>
                <div style="width:100%;float:right; text-align:center">
                  <a  class="btn btn-dark" href="${tarea.archivo}">Descarga tu archivo guardado</a>
                </div>
              </div>
              <div class="row" style="text-align:center;margin-top:10px;">
                <div class="col-6">
                  <button class ="btn btn-danger btn-delete btn-block" data-id="${tarea.id}"> Eliminar </button>
                </div>
                <div class="col-6">
                  <button class ="btn btn-success btn-edit btn-block" data-id="${tarea.id}"> Modificar </button>
                </div>
              </div>
            </div>`;  
            html += div;
            }else {
              const div = `<div class="card card-body mt-2 border-primary">
              <h3 class="h4" style="text-align:center">${tarea.titulo}</h3>
              <div style="width:100%;text-align:center">
                <p class="p">${tarea.descripcion}</p>
              </div>
              <div class="row" style="text-align:center;margin-top:10px;">
              <div class="col-6">
                <button class ="btn btn-danger btn-delete btn-block" data-id="${tarea.id}"> Eliminar </button>
              </div>
              <div class="col-6">
                <button class ="btn btn-success btn-edit btn-block" data-id="${tarea.id}"> Modificar </button>
              </div>
              </div>
            </div>`;  
            html += div;
            }
        });

        listaTareas.innerHTML = html;

        //  obtenemos todos los botones delete
        const btnsdelete = document.querySelectorAll('.btn-delete');
          
        btnsdelete.forEach( btn => {
          // por cada boton agragale un evento
            btn.addEventListener('click', async (e) => {
              await eliminarTarea(e.target.dataset.id);

              obtenerTasks(emailGlobal)
              .then((snapshot) => {
                setupTareas(snapshot.docs);
              })
              .catch(err =>{
                console.error(err);
              });
            });
        });
         
         //  obtenemos todos los botones delete
       const btnsedit = document.querySelectorAll('.btn-edit');
       
       btnsedit.forEach( btn => {
         // por cada boton agragale un evento
           btn.addEventListener('click', async(e) => {
             const doc = await obtenerTask(e.target.dataset.id);                
             const task = doc.data();
             editStatus = true;
             id = doc.id;
             taskForm['task-titulo'].value = task.titulo;
             taskForm['task-descripcion'].value = task.descripcion;
             taskForm['btn-task-form'].innerText = 'Editar';
         });
       });

    }else {
        listaTareas.innerHTML= '<p class="text-center">Aun no registras una tarea</p>'
    }
}

// eventos
// listar los tareas para los usuarios autenticados
auth.onAuthStateChanged(user => {
    if(user){
        emailGlobal = user.email;
        console.log('auth: signin');
        obtenerTasks(emailGlobal)
        .then((snapshot) => {
            setupTareas(snapshot.docs);
        })
        .catch(err =>{
          console.error(err).message;
        })

    }else{
        console.log('auth: signout')
    }
});




// detecto el boton de subir tarea
const taskForm = document.getElementById("task-form");


// usamos para comprobar el edit
let editStatus = false;
let id = '';

const guardarTask = (email,titulo,descripcion, foto, archivo) =>
  db.collection('tasks').doc().set({
    email,
    titulo,
    descripcion,
    foto,
    archivo
  });

// REGISTRAR  /   EDITAR
taskForm.addEventListener('submit', async (e) => {
  // esto hace que no se refresque la pagina
  e.preventDefault();
  // detecto los datos de los id dentro del form
  if(emailGlobal === ''){
    return ; 
  }
  const email = emailGlobal;
  const titulo = taskForm['task-titulo'];
  const descripcion = taskForm['task-descripcion'];
  const photo = taskForm['task-imagen'].files[0];
  const archivo = taskForm['task-archivo'].files[0];
  if(!editStatus){
    
    if(photo != null && archivo != null){
      const namepho = new Date() + '-'+photo.name; 
      const metadataphoto = {
        contentType : photo.type
      }

      const subirfoto = st.child(namepho).put(photo, metadataphoto);
      const titulo2 = titulo.value;
      const descripcion2 = descripcion.value;
      subirfoto.then(snapshot => snapshot.ref.getDownloadURL())
      .then( urlfoto => {

        const namearc = new Date() + '-'+ archivo.name;
        const metadataarchivo = {
          contentType : archivo.type
        }
        
        const subirarchivo = st.child(namearc).put(archivo, metadataarchivo);
        subirarchivo.then(snapshot => snapshot.ref.getDownloadURL())
        .then( urlarchivo => {

          guardarTask(email, titulo2, descripcion2, urlfoto, urlarchivo);

          obtenerTasks(email)
          .then((snapshot) => {
              setupTareas(snapshot.docs);
              console.log('ejecutando obtenerTareas en onAuthStateChanged');
          })
          .catch(err =>{
            console.error(err.message);
          });
        })
        .catch(err => {
          console.error(`Error en subir archivo ${err.message}`);
        })
      })
      .catch(err => {
        console.error(`Error en subir photo ${err.message}`);
      })
    }
    else
    if(archivo != null){
      const name = new Date() + '-'+archivo.name;
      const metadata = {
        contentType : archivo.type
      }

      const titulo2 = titulo.value;
      const descripcion2 = descripcion.value;

      const subir = st.child(name).put(archivo, metadata);
      subir.then(snapshot => snapshot.ref.getDownloadURL())
      .then( url => {
        console.log(`Ruta del archivo subido : ${url}`);
        guardarTask(email, titulo2, descripcion2, '', url);

        obtenerTasks(email)
        .then((snapshot) => {
            setupTareas(snapshot.docs);
            console.log('ejecutando obtenerTareas en onAuthStateChanged');
        })
        .catch(err =>{
          console.error(err.message);
        });
      })
      .catch(err => {
        console.error(`Error en subir archivo ${err.message}`);
      })

    }else if(photo!= null){
      const name = new Date() + '-'+photo.name;
      const metadata = {
        contentType : photo.type
      }

      const titulo2 = titulo.value;
      const descripcion2 = descripcion.value;

      const subir = st.child(name).put(photo, metadata);
      subir.then(snapshot => snapshot.ref.getDownloadURL())
      .then( url => {
        console.log(`Ruta del archivo subido : ${url}`);
        guardarTask(email, titulo2, descripcion2, url, '');

        obtenerTasks(email)
        .then((snapshot) => {
            setupTareas(snapshot.docs);
            console.log('ejecutando obtenerTareas en onAuthStateChanged');
        })
        .catch(err =>{
          console.error(err.message);
        });
      })
      .catch(err => {
        console.error(`Error en subir archivo ${err.message}`);
      })
    }else{
      await guardarTask(email, titulo.value, descripcion.value, '', '');
      
    }
   
  } else {
    await actualizarTarea(id, {
        email: email,
       titulo: titulo.value,
       descripcion: descripcion.value,
    });

    editStatus = false;
    id = '';
    taskForm['btn-task-form'].innerText = 'Guardar';

  }

  // limpiamos los campos
  taskForm.reset();

  // el cursor se pone encima del titulo
  titulo.focus();

  obtenerTasks(email)
  .then((snapshot) => {
      setupTareas(snapshot.docs);
      console.log('ejecutando obtenerTareas en onAuthStateChanged');
  })
  .catch(err =>{
    console.error(err.message);
  });
});