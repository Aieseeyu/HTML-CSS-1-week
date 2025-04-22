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

  let selectCategoryProduct = document.getElementById("selectCategoryProduct");
  let tbody = document.querySelector("#productTable tbody");

  function showCategoriesModif(categories, product) {
    categories.forEach((category) => {
      if (category.categoryId == product.productCategoryId) {
        selectCategoryProduct.insertAdjacentHTML(
          "beforeend",
          `<option value="${category.categoryId}" selected>${category.name}</option>`
        );
      } else {
        selectCategoryProduct.insertAdjacentHTML(
          "beforeend",
          `<option value="${category.categoryId}" >${category.name}</option>`
        );
      }
    });
  }

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

    //recuperation de tous les buttons necessaires de la page
    let btn = e.target;
    let showModifProd = document.getElementById("showModifProd");
    let sectionModifProd = document.getElementById("sectionModifProd");
    let modifStatActive = document.getElementById("modifStatActive");
    let modifStatInactive = document.getElementById("modifStatInactive");
    let productDescription = document.getElementById("productDescription");
    let productName = document.getElementById("productName");
    let btnBack = document.getElementById("reloadModifProd");
    let buttonModifProd = document.getElementById("buttonModifProd");

    switch (btn.className) {
      case "buttonModif":
        showModifProd.classList.add("hidden");
        sectionModifProd.removeAttribute("hidden");

        products.forEach((product) => {
          if (product.productId == btn.dataset.id) {
            prodModif = product;
          }
        });

        // on remplit les inputs avec les valeurs du produit à modifier
        productName.setAttribute("value", prodModif.productName);
        productDescription.value = prodModif.productDescription;

        if (prodModif.productStatus == "active") {
          modifStatActive.setAttribute("selected", "");
        } else {
          modifStatInactive.setAttribute("selected", "");
        }

        // on affiche la categorie du produit avec l'attribut selected
        showCategoriesModif(categories, prodModif);

        //button pour recharger la page
        btnBack.addEventListener("click", (e) => {
          window.location.reload();
        });

        buttonModifProd.addEventListener("click", (e) => {
          e.preventDefault();

          let formModifProd = document.getElementById("formModifProd");

          const formData = new FormData(formModifProd); // Récupère toutes les données du formulaire

          let data = Object.fromEntries(formData.entries()); // Convertit en objet JS
          data.ProductId = prodModif.productId;
          console.log("🚀 ~ buttonModifProd.addEventListener ~ data:", data);

          fetch("https://localhost:44384/product/modify", {
            method: "PUT",
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
              window.location.reload();
            })
            .catch(function (error) {
              console.log("🚀 ~ error:", error);
            });
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
