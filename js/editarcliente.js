(function () {
  let DB;

  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");

  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    // Actualiza el regitro
    formulario.addEventListener("submit", actualizarCliente);

    // Verificar el ID de la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const idCliente = parametrosURL.get("id");
    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 100);
    }
  });

  function obtenerCliente(id) {
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");

    const cliente = objectStore.openCursor();
    cliente.onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value);
        }
        cursor.continue();
      }
    };
  }

  function llenarFormulario(datosCliente) {
    const { nombre, email, telefono, empresa } = datosCliente;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }

  function actualizarCliente(e) {
    e.preventDefault();

    // Antes de actualizar el clinte, debemos validarlo
    if (
      nombreInput.value === "" ||
      emailInput === "" ||
      telefonoInput === "" ||
      empresaInput === ""
    ) {
      imprimirAlerta("Todos los campos son obligatorios", "error");

      return;
    }
  }

  function conectarDB() {
    const abrirConecxion = window.indexedDB.open("crm", 1);

    abrirConecxion.onerror = function () {
      console.log("Hubo un error");
    };
    abrirConecxion.onsuccess = function () {
      DB = abrirConecxion.result;
    };
  }
})();
