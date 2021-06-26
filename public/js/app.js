const db = firebase.firestore();

const piedrasForm = document.querySelector('#piedras-form');
const productoContainer = document.getElementById('producto-container');

let editStatus = false;
let id = '';

const savePiedra = (title, image, description) => 
    db.collection('piedras').doc().set({
        title,
        image,
        description
    });

const getPiedras =  () => db.collection('piedras').get();

const getPiedrasE = (id) => db.collection('piedras').doc(id).get();

const onGetPiedras = (callback) => db.collection('piedras').onSnapshot(callback);

const deletePiedras = id => db.collection('piedras').doc(id).delete();

const updatePiedras = (id, updatePiedras) => 
    db.collection('piedras').doc(id).update(updatePiedras);

window.addEventListener('DOMContentLoaded', async (e) => {
    onGetPiedras((querySnapshot) => {
        productoContainer.innerHTML = '';

        querySnapshot.forEach(doc => {
            
            const piedra = doc.data();
            piedra.id = doc.id;
    
            productoContainer.innerHTML += `
            <div class="col-12 col-md-3 d-flex justify-content-center">
                <div class="card card-piedras mt-2">
                    <img class="img-main" src="${piedra.image}">
                    <h3 class="py-1">${piedra.title}</h3>
                    <p>${piedra.description}</p>
                    <div class="py-2">
                        <button class="btn btn-delete" data-id="${piedra.id}">Eliminar</button>
                        <button class="btn btn-edit" data-id="${piedra.id}">Editar</button>
                    </div>
                </div>
            </div>
            `;
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    await deletePiedras(e.target.dataset.id);
                })
            });
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getPiedrasE(e.target.dataset.id);
                    const piedra = doc.data();

                    editStatus = true;
                    id = doc.id;

                    piedrasForm['piedra-title'].value = piedra.title;
                    piedrasForm['piedra-image'].value = piedra.image;
                    piedrasForm['piedra-description'].value = piedra.description;
                    piedrasForm['btn-piedras-form'].innerText = 'Update';
                })
            })
        })
    })
});

piedrasForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = piedrasForm['piedra-title'];
    const image = piedrasForm['piedra-image'];
    const description = piedrasForm['piedra-description'];
    

    if (!editStatus) {
        await savePiedra(title.value, image.value, description.value);
    } else {
        await updatePiedras(id, {
            title: title.value,
            image: image.value,
            description: description.value
        });

        editStatus = false;
        piedrasForm['btn-piedras-form'].innerText = 'Save';
    }

    await getPiedras();
    piedrasForm.reset();
    title.focus();
})