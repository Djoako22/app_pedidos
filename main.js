const comidas = [
    {
        comida: "Milanesa",
        precio: 500,
        img: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Weekend_in_Buenos_Aires.jpg",
    },
    {
        comida: "Sandwich Milanesa",
        precio: 400,
        img: "https://www.mdzol.com/u/fotografias/m/2021/9/1/f608x342-1102803_1132526_0.png",
    },
    {
        comida: "Sandwich Fiambre Jamón",
        precio: 150,
        img: "https://p2.piqsels.com/preview/38/903/690/sandwich-food-bread-lunch-thumbnail.jpg",
    },
    {
        comida: "Sandwich Fiambre Salame",
        precio: 150,
        img: "https://p2.piqsels.com/preview/38/903/690/sandwich-food-bread-lunch-thumbnail.jpg",
    },
    {
        comida: "Bandeja Papa Grande",
        precio: 300,
        img: "https://p2.piqsels.com/preview/763/623/737/french-fries-eating-fastfood-food-thumbnail.jpg",
    },
    {
        comida: "Bandeja Papa Chica",
        precio: 200,
        img: "https://p2.piqsels.com/preview/763/623/737/french-fries-eating-fastfood-food-thumbnail.jpg",
    },
    {
        comida: "Cono Papa",
        precio: 100,
        img: "https://p2.piqsels.com/preview/763/623/737/french-fries-eating-fastfood-food-thumbnail.jpg",
    },
];

const menus = document.querySelector(".menus");

const nombre = document.querySelector(`input[placeholder='Nombre']`);
const pedido = document.querySelector(".pedido");
const precioFinal = document.querySelector(`input[placeholder='Precio final']`);

const cliente = document.querySelector(".cliente");

const btn_pedidos = document.querySelector(".btn_pedidos");
const btn_telefono = document.querySelector(".btn_telefono");
const ventana_pedidos = document.querySelector(".ped");
const ventana_telefono = document.querySelector(".tel");
const offcanvas = document.querySelector(".offcanvas");
const temporizador = document.querySelector("temporizador");

let p;
let pedidos = [];

let duracion = 0;

cliente.addEventListener("submit", enviar);

const hora = () => {
    let hoy = new Date();
    let h = hoy.getHours();
    let m = hoy.getMinutes();
    return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
};
const estaraEn = (d) => {
    let hoy = new Date();
    let h =
        parseInt(hoy.getHours()) +
        Math.trunc((parseInt(hoy.getMinutes()) + d) / 60);
    let m = (parseInt(hoy.getMinutes()) + (d % 60)) % 60;
    return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
};

function uuid() {
    return crypto.randomUUID();
}

function contarPedidos(a) {
    let r = [];
    for (let i = 0; i < a.length; i++) {
        let x = 0;
        for (let j = 0; j < a.length + 1; j++) {
            if (a[i] == a[j]) {
                x++;
            }
        }
        r.push(`${x}x${a[i]} <br>`);
    }
    r = [...new Set(r)].reduce((p, c) => p + c);
    return r;
}

function pedir(comida) {
    const n = parseInt(precioFinal.value) ? parseInt(precioFinal.value) : 0;
    precioFinal.value = n + comida.precio;
    p.push(comida.comida);
    pedido.innerHTML =
        contarPedidos(p) +
        "Estara a las " +
        estaraEn([...new Set(p)].length * 10);
}

async function enviar(e) {
    e.preventDefault();
    if (precioFinal.value != "") {
        const telefono = document.querySelector(".telefono").value;
        const msj = `
        ${nombre.value}
        ${contarPedidos(p).replace("<br>", "")} 
        ${hora()}hs → ${estaraEn([...new Set(p)].length * 10)}hs
        `;
        const datos = JSON.stringify({ telefono, msj });
        await fetch("/datos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: datos,
        });

        pedidos.push({
            id: uuid(),
            nombre: nombre.value,
            pedido: contarPedidos(p),
            hora: hora(),
            duracion: [...new Set(p)].length * 10,
        });
        render();
    }
}

function borrar(id) {
    pedidos = pedidos.filter((pd) => pd.id != id);
    render();
}

function render() {
    nombre.value = "";
    p = [];
    nombre.innerHTML = pedido.innerHTML = precioFinal.value = "";
    menus.innerHTML = "";
    ventana_pedidos.innerHTML = `
        <div>
            <div style="display: flex;justify-content: space-between;">
                <p>Nombre</p> 
                <p>Pedido</p> 
                <p>Duracion</p>
            </div>
            <hr>
        </div>
        `;
    comidas.forEach((c) => {
        menus.innerHTML += `
        <div class="comidas" onclick='pedir(${JSON.stringify(c)})'>
            <h3>${c.comida}</h3>
            <img
                src="${c.img}"
            />
            <h3>$${c.precio}</h3>
        </div>`;
    });
    pedidos.forEach((pd) => {
        ventana_pedidos.innerHTML += `
        <div>
            <div class="pd" onclick='borrar("${pd.id}")'>
                <b>${pd.nombre}</b> 
                <p>${pd.pedido}</p> 
                <p>${pd.hora}hs<br>${estaraEn(pd.duracion)}hs</p>
            </div>
            <hr>
        </div>`;
    });
}

render();
