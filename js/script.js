//button ajout product
let buttonAddProd = document.getElementById("buttonAddProd");

//
// appels vers api
//
//je ne lance ce code que quand je suis sur la route qui finit par le "view/second.html"
//seconde page
if (window.location.pathname.includes("view/second.html")) {
  let products;
  let ulProducts = document.getElementById("productss");
  let selectCatProd = document.getElementById("selectCategoryProduct");

  //
  // fonctions ajout dans le html
  //

  function showProducts(products) {
    products.forEach((product) => {
      ulProducts.insertAdjacentHTML(
        "beforeend",
        `<li class="product">
                  <img
                    class="productImg"
                    src="../img/product.jpg"
                    alt="image de produit"
                  />
                  <h4 class="titleProduct">${product.productName}</h4>
                </li>`
      );
    });
  }

  fetch("https://localhost:44384/product")
    .then(async (resp) => {
      if (!resp.ok) {
        throw new Error("erreur " + resp.statusText);
      }
      products = await resp.json();
      showProducts(products);
    })
    .catch(function (error) {
      //   console.log("🚀 ~ error:", error);
    });
}

//4eme page
if (window.location.pathname.includes("view/fourth.html")) {
  let products;
  let categories;
  let buttonModif;
  let buttonDel;

  let tbody = document.querySelector("#productTable tbody");

  function showProductsMod(products, categories) {
    tbody.innerHTML = ""; // vide le tableau

    products.forEach((product) => {
      let categoryObj;

      categories.forEach((category) => {
        if (category.categoryId == product.productCategoryId) {
          categoryObj = category;
        }
      });

      let prodLine = `
        <tr>
          <td>${product.productId}</td>
          <td>${product.productName}</td>
          <td>${product.productDescription}</td>
          <td>${product.productStatus}</td>
          <td>${product.productCreatedAt}</td>
          <td>${categoryObj.name}</td>
          <td>
            <button class="buttonModif" data-id="${product.productId}">Modifier</button>
            <button class="buttonDel" data-id="${product.productId}">Supprimer</button>
          </td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", prodLine);

      buttonModif = document.querySelector("buttonModif");
      buttonDel = document.querySelector("buttonDel");
    });
  }

  //requete pour recuperer les produits et categories
  fetch("https://localhost:44384/product")
    .then(async (resp) => {
      if (!resp.ok) {
        throw new Error("erreur " + resp.statusText);
      }
      products = await resp.json();

      fetch("https://localhost:44384/category")
        .then(async (resp) => {
          if (!resp.ok) {
            throw new Error("erreur " + resp.statusText);
          }
          categories = await resp.json();
          showProductsMod(products, categories);
        })
        .catch(function (error) {
          //   console.log("🚀 ~ .then ~ error:", error);
        });
    })
    .catch(function (error) {
      //   console.log("🚀 ~ error:", error);
    });

  //faire eventlistener deleguée sur le tbody pour ne pas avoir a faire sur chaque button
  tbody.addEventListener("click", (e) => {
    //si ce n'est pas un button qui est cliqué:
    if (e.target.tagName !== "BUTTON") {
      return;
    }
    let btn = e.target;
    let showModifProd = document.getElementById("showModifProd");

    switch (btn.className) {
      case "buttonModif":
        console.log(showModifProd);
        showModifProd.setAttribute("hidden", "");

        console.log(btn.dataset.id + btn.className);

        products.forEach((product) => {
          if (product.productId == btn.dataset.id) {
            prodModif = product;
          }
        });
        break;

      case "buttonDel":
        break;
    }
  });
}

//5eme page
if (window.location.pathname.includes("view/fifth.html")) {
  let categories;

  function showCategories(categories) {
    categories.forEach((category) => {
      selectCatProd.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.categoryId}" >${category.name}</option>`
      );
    });
  }

  fetch("https://localhost:44384/category")
    .then(async (resp) => {
      if (!resp.ok) {
        throw new Error("erreur " + resp.statusText);
      }
      categories = await resp.json();
      //   console.log("🚀 ~ .then ~ categories:", categories);
      showCategories(categories);
    })
    .catch(function (error) {
      //   console.log("🚀 ~ error:", error);
    });

  buttonAddProd.addEventListener("click", (event) => {
    event.preventDefault();

    let formAddProd = document.getElementById("formAddProd");
    let sectionAddProd = document.getElementById("sectionFifthPageOne");
    let sectionThanksAdd = document.getElementById("sectionThanksAdd");

    const formData = new FormData(formAddProd); // Récupère toutes les données du formulaire

    let data = Object.fromEntries(formData.entries()); // Convertit en objet JS
    console.log("🚀 ~ buttonAddProd.addEventListener ~ data:", data);

    fetch("https://localhost:44384/product/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (resp) => {
        if (!resp.ok) {
          console.log("🚀 ~ .then ~ resp:", resp);
          // throw new Error("erreur " + resp.statusText);
        }
        //on cache le formulaire
        sectionThanksAdd.removeAttribute("hidden");

        //on affiche le message de merci
        sectionAddProd.setAttribute("hidden", "");
      })
      .catch(function (error) {
        console.log("🚀 ~ error:", error);
      });
  });
}
