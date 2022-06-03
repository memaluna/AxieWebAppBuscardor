//Variables
const selectorEquipo = document.querySelector("#titulo");
const datosEquipo = document.querySelector("#DetallesTeam");
const tpl = document.createDocumentFragment();
const tplDatosEquipo = document.createDocumentFragment();
let precioTotalProm = 0;
let precioTotal = document.createElement("div");
precioTotal.setAttribute("id", "precioT");
const options = {
  method: "GET",
};

fetch(
  "https://api-axie-fb255-default-rtdb.firebaseio.com/equipos.json",
  options
)
  .then((response) => response.json())
  .then(function (response) {
    //console.log(response);
    for (let key in response) {
      let elem = document.createElement("h2");
      elem.setAttribute("id", key);
      elem.setAttribute("onclick", `ExtraerDatosEquipo(this)`);
      elem.setAttribute("class", "btn btn-outline-dark");
      elem.appendChild(document.createTextNode(response[key].nombre));
      tpl.appendChild(elem);
    }
    selectorEquipo.appendChild(tpl);
  })
  .catch((err) => console.error(err));

function ExtraerDatosEquipo(id) {
  datosEquipo.innerHTML = "";
  fetch(
    "https://api-axie-fb255-default-rtdb.firebaseio.com/equipos.json",
    options
  )
    .then((responses) => responses.json())
    .then(function (responses) {
      //console.log(responses);
      let titulo = document.createElement("h1");
      titulo.setAttribute("id", "textCentrado");
      titulo.appendChild(document.createTextNode(responses[id.id].nombre));
      tplDatosEquipo.appendChild(titulo);
      let desc = document.createElement("p");
      desc.setAttribute("id", "textCentP");
      desc.appendChild(document.createTextNode(responses[id.id].descripcion));
      tplDatosEquipo.appendChild(desc);
      //let copas = document.createElement("p");
      //copas.appendChild(
        //document.createTextNode(
          //`Rango de copas: ${responses[id.id].rangoCopas}`
        //)
      //);
      //copas.setAttribute("id", "textCentP");
      //tplDatosEquipo.appendChild(copas);
      let videosTit = document.createElement("p");
      videosTit.setAttribute("id", "textCentP");
      videosTit.appendChild(document.createTextNode("Videos:"));
      let videos = document.createElement("p");
      videos.setAttribute("id", "textCentP");
      for (let key in responses[id.id].videos) {
        let enlace = document.createElement("a");
        enlace.setAttribute("href", responses[id.id].videos[key].link);
        enlace.appendChild(
          document.createTextNode(responses[id.id].videos[key].desc)
        );
        enlace.setAttribute("id", "textCentP");
        videos.appendChild(enlace);
        videos.appendChild(document.createElement("br"));
      }
      tplDatosEquipo.appendChild(videosTit);
      precioTotal.appendChild(
        document.createTextNode(`Precio Promedio Total: ${precioTotalProm}`)
      );
      tplDatosEquipo.appendChild(videos);
      tplDatosEquipo.appendChild(precioTotal);

      //axies

      let divFrontAxie = document.createElement("div");
      divFrontAxie.setAttribute("id", "DivResultado");

      ExtraerFrontAxie(
        responses[id.id].axies.frontline.criteria,
        divFrontAxie,
        "Frontline Axie"
      );
      ExtraerFrontAxie(
        responses[id.id].axies.midline.criteria,
        divFrontAxie,
        "Midline Axie"
      );
      ExtraerFrontAxie(
        responses[id.id].axies.backline.criteria,
        divFrontAxie,
        "Backline Axie"
      );
      precioTotalProm = 0;
      //apli al div
      tplDatosEquipo.appendChild(divFrontAxie);
      //apli final
      datosEquipo.appendChild(tplDatosEquipo);
    })
    .catch((err) => console.error(err));
}

function ExtraerFrontAxie(criterio, divFrontAxie, titulo) {
  fetch("https://graphql-gateway.axieinfinity.com/graphql?", {
    method: "POST",
    body: JSON.stringify({
      operationName: "GetAxieBriefList",
      variables: {
        from: 0,
        size: 10,
        sort: "PriceAsc",
        auctionType: "Sale",
        criteria: criterio,
      },
      query:
        "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n",
    }),
    headers: {
      "content-type": "application/json",
    },
    credentials: "same-origin",
  })
    .then(function (response) {
      return response.json().then((data) => {
        let tituloFront = document.createElement("h3");
        tituloFront.setAttribute("id", "tituloAxie");
        tituloFront.appendChild(document.createTextNode(titulo));
        divFrontAxie.appendChild(tituloFront);
        let sumatoria = 0;
        let divAxie = document.createElement("div");
        divAxie.setAttribute("id", "frontAxie");
        
        //console.log(data.data.axies.results);
        //console.log(Object.keys(data.data.axies.results).length);
        let limiteAxie = Object.keys(data.data.axies.results).length;
        let divisorColumnas = 5;
        if(limiteAxie <= 5){
          divisorColumnas = limiteAxie;
        }
        divAxie.setAttribute("class", `row row-cols-${divisorColumnas}`);
        if(limiteAxie >= 10){
          limiteAxie = 10;
          console.log(limiteAxie);
        }
        for (let step = 0; step < limiteAxie; step++) {
          let tarjeta = document.createElement("div");
          tarjeta.setAttribute("id", "tarjetaAxie");
          let linkedImg = document.createElement("a");
          linkedImg.setAttribute(
            "href",
            `https://marketplace.axieinfinity.com/axie/${data.data.axies.results[step].id}/`
          );
          let imagenAxie = document.createElement("img");
          imagenAxie.setAttribute("src", data.data.axies.results[step].image);
          imagenAxie.setAttribute("class", "img-fluid");
          imagenAxie.setAttribute("height", "150px");
          //linkedImg.appendChild(imagenAxie);
          //tarjeta.appendChild(linkedImg);
          tarjeta.appendChild(imagenAxie);
          let precio = document.createElement("h4");
          precio.setAttribute("id", "centrado");
          precio.appendChild(
            document.createTextNode(
              data.data.axies.results[step].auction.currentPriceUSD + " USD"
            )
          );
          sumatoria =
            sumatoria +
            Number(data.data.axies.results[step].auction.currentPriceUSD);
          tarjeta.appendChild(precio);
          linkedImg.appendChild(tarjeta);
          divAxie.appendChild(linkedImg);
        }
        let precioPromedio = document.createElement("div");
        precioPromedio.setAttribute("id","precioCU");
        precioPromedio.appendChild(
          document.createTextNode(
            `Precio promedio: ${(sumatoria / limiteAxie).toFixed(2)} USD`
          )
        );
        precioTotalProm = precioTotalProm + (sumatoria/limiteAxie);
        document.getElementById("precioT").innerHTML = "Precio Promedio Total: " + precioTotalProm.toFixed(2);
        divFrontAxie.appendChild(precioPromedio);
        divFrontAxie.appendChild(divAxie);
      });
    })
    .catch(function (e) {
      console.error(e);
    });
}
