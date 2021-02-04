var localizacao = {}
var coordenada = []
var map

window.onload = async function loadListLocations() {
    let json = sessionStorage.getItem("location");
    localizacao = JSON.parse(json);
    coordenada = JSON.parse(localizacao.coordenadas)
    document.getElementById('local').innerHTML = localizacao.nome
    let suitable_products = await $.ajax({
        url: "/api/locations/"+localizacao.id+"/products",
        method: 'get',
        dataType: 'json'
    })            
    let locations = await $.ajax({
        url: "/api/locations",
        method: 'get',
        dataType: 'json'
    })
    autocomplete(document.getElementById('search-location'),locations)
    listProducts(suitable_products[0]);

    mapboxgl.accessToken = 'pk.eyJ1IjoiaXZhbnBnIiwiYSI6ImNraGwybDczMzFnOXcyeHA2MnM0ZWF4aDQifQ.dbfnIhEI5JJf-TV1LyEQQw';
    map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ivanpg/ckhp1ckfr2dbd19o0op09umzk', 
    center: coordenada[0], 
    zoom: 8
});

    var draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
            polygon: true,
            trash: true
            }
            });
    map.addControl(draw);

    map.on('draw.create',updateArea);
}



     
function updateArea(e) {
    var data = draw.getAll();

    if (data.features.length > 0) {
        var area = turf.area(data);
        return data.features[0].geometry.coordinates;
    } 
    else {
        if (e.type !== 'draw.delete')
        alert('Use the draw tools to draw a polygon!');
        }
}



function listProducts(products) {
    let elemHortlist = document.getElementById("products-list-section");
    let html ="";
    for (let product of products) {
        html += 
        '<section id="product-result">'+
            '<div id="productID-'+product.Produto_ID+'">'+
                '<section id= "hortalica-result">'+
                    '<section id="image-product-section">'+
                        '<img id="image-icon" src="'+product.Produto_Photo+'">'+
                    '</section>'+
                    '<section id="title-section">'+
                        '<h3 id="title-result">'+product.Produto_Nome+'</h3>'+
                    '</section>'+
                    '<section id="product-description-section">'+
                        '<p id="description-result"><b>Tipo Solo: </b>'+product.Produto_TipoSoloDescricao+'</p>'+
                        '<p id="description-result"><b>Epoca Semear: </b>'+product.Produto_EpocaSemearDescricao+'</p>'+
                        '<p id="description-result"><b>Epoca Colheita: </b>'+product.Produto_EpocaColheitaDescricao+'</p>'+
                        '<p id="description-result"><b>Exposição: </b>'+product.Produto_ExposicaoDescricao+'</p>'+
                    '</section>'+
                    '<section id="separation">'+
                        '<hr style= "width: 90%; margin-bottom:20px;">'+
                    '</section>'+
                '</section>'+
            '</div>'+
        '</section>';
    }
    elemHortlist.innerHTML = html;
}



function autocomplete (inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "search-container-list");
        a.setAttribute("class", "search-container-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for(i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].Freguesia_Nome.substr(0, val.length).toUpperCase() == val.toUpperCase()){
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].Freguesia_Nome.substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].Freguesia_Nome.substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i].Freguesia_Nome + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "search-container-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("search-container-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("search-container-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("search-container-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }