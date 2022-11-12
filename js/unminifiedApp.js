const elForm = document.querySelector(".form");
const elFormInput = elForm.querySelector("#countries-input");
const elSelect = elForm.querySelector(".countries-select");
const eList = document.querySelector(".country");
const elTemplatee = document.querySelector("#template").content;
const frag = document.createDocumentFragment();
const url = "https://restcountries.com/v3.1/all"

// MODAL Elements

const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".modal-title");
const elModalImg = elModal.querySelector(".modal_country-img");
const elModalRegion = elModal.querySelector(".modal_content-region-value");
const elModalCurrency = elModal.querySelector(".modal_content-currency-value");
const elModalBorders = elModal.querySelector(".modal_content-borders-value");
const elModalNativeName = elModal.querySelector(".modal_content-native-value");
const elModalLanguages = elModal.querySelector(".modal_content_language-value");
const elModalSubregion = elModal.querySelector(".modal_content-subregion-value");
const elModalMapLink = elModal.querySelector(".modal_content-link");
const elTryBox = document.querySelector(".try-box");
const elChangeThemeBtn = document.querySelector(".header-btn");
const bg = document.querySelector(".hero--active");
const uniqueRegions = new Set();
const elSimpleModal = document.querySelector("#simpleModal");


/* Generate regions Options */
async function generateRegionOptions() {
    const response = await fetch(url);
    const data = await response.json();
    
    data.forEach(item => {
        uniqueRegions.add(item.region); 
    });
    
    uniqueRegions.forEach(reg => {
        const option = document.createElement("option");
        option.textContent = reg;
        option.value = reg;
        frag.appendChild(option)
    })
    elSelect.appendChild(frag)
    
}



/* Change page theme */
elChangeThemeBtn.addEventListener("click" , function(){
    document.body.classList.toggle("theme-dark");
    bg.classList.toggle("bg-white");
});


/* Rendering countries */
async function gett(param) {
    try {
        const response = await fetch(param);
        const dataa = await response.json();
        for (let i = 0; i < dataa.length; i++) {
            
            let arr = [];
            let populationn = dataa[i].population.toString()
            for (const a of populationn) { 
                arr.push(a)
            }
            if (arr.length  == 5) {
                arr.splice(1, 0, ".")     
            }else if (arr.length == 6) {
                arr.splice(3, 0, ".")
            }else if (arr.length == 7) {
                arr.splice(1, 0, ".")
                arr.splice(5, 0, ".")
            }else if (arr.length == 8) {
                arr.splice(2, 0, ".")
                arr.splice(6, 0, ".")
            }else if (arr.length == 9 ) {
                arr.splice(3, 0, ".")
                arr.splice(7, 0, ".")
            }else if (arr.length == 10) {
                arr.splice(1, 0, ".")
                arr.splice(5, 0, ".")
                arr.splice(9, 0, ".")
            } 
            eList.innerHTML = "";
            let clone = elTemplatee.cloneNode(true);
            clone.querySelector(".countryy_image").src = dataa[i].flags.png;
            clone.querySelector(".countryy_title").textContent = dataa[i].name.common;
            clone.querySelector(".countryy_population-value").textContent = arr.join("");
            clone.querySelector(".countryy_region-value").textContent = dataa[i].region;
            clone.querySelector(".countryy_capital-value").textContent = dataa[i].capital;
            clone.querySelector(".countryy_info").dataset.tld = dataa[i].tld
            frag.appendChild(clone)
        };
        
        eList.appendChild(frag);
    } catch (error) {
        console.log(error)
    }
    
}

/* Show search results function */

async function showSearchResults(names) {
    const response = await fetch(url);
    const data = await response.json();
    
    return data.find(item => {
        if (item.name.common == names) return true;
        const result = item.name.common.match(names) && (elSelect.value === "Filter by region" || item.region.includes(elSelect.value)) && (elFormInput.value.trim() === "")
        return result; 
    })
}


/* Debounce function */

function debounce(callback, delay) {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(callback, delay);
    }
}


/* Search with function delay */

function debouncingSearch() {
    
    const inputValue = elFormInput.value.trim();
    
    if (inputValue == "") {
        gett(url)
    }
    
    showSearchResults(inputValue);  
    
    gett(`https://restcountries.com/v3.1/name/${inputValue}`)
    gett(`https://restcountries.com/v3.1/capital/${inputValue}`)
}


/* Form event */
elForm.addEventListener("keyup", debounce(debouncingSearch, 1000))


/* Select event */
elSelect.addEventListener("change", () => {
    console.log("Changed")
    gett(`https://restcountries.com/v3.1/region/${elSelect.value}`)
})


/* Render The Modal Content */

async function showModalInfo(id) {
    try {
        const response = await fetch(url);
        const data = await response.json()
        let found = data.find(function(item) {
            if (item.tld == id) return true;
        });
        let currency = Object.values(found.currencies)
        let nativeNames = Object.values(found.name.nativeName)
        let nativeName = Object.values(nativeNames[0])
        
        elModalTitle.textContent = found.name.common;
        elModalImg.src = found.flags.png;
        elModalRegion.textContent = found.region;
        elModalCurrency.textContent = currency[0].name;
        if (found.borders) {
            elModalBorders.textContent = found.borders;
        }
        else {
            elModalBorders.textContent = "No borders"
        }
        elModalNativeName.textContent = nativeName[0];
        elModalLanguages.textContent = Object.values(found.languages);
        if (found.subregion) {
            elModalSubregion.textContent = found.subregion;
        }
        else {
            elModalSubregion.textContent = "No subregions"
        }
        elModalMapLink.href = found.maps.googleMaps;
        
        console.log(found)
    } catch (error) {
        console.log(error)
    }
}


/* Show The Modal Content */

eList.addEventListener("click", (evt) => {
    if (evt.target.matches(".countryy_info")) {       
        showModalInfo(evt.target.dataset.tld)
    }
});



/* Show next page modal */

function showNextPageModal() {
    
    setTimeout(() => {
        elSimpleModal.classList.add("show");
        elSimpleModal.style.display = "block";
        
    }, 3000);
    
    elSimpleModal.addEventListener("click", (evt) => {
        if (evt.target.classList.contains("simple-close")) {
            elSimpleModal.style.display = "none";
        }
        else if (evt.target.classList.contains("try")) {
            window.location.pathname = "mapCountry.html"
        }
    });
    
}

generateRegionOptions()
gett(url);
showNextPageModal()







