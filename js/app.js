const elForm=document.querySelector(".form"),elFormInput=elForm.querySelector("#countries-input"),elSelect=elForm.querySelector(".countries-select"),eList=document.querySelector(".country"),elTemplatee=document.querySelector("#template").content,frag=document.createDocumentFragment(),url="https://restcountries.com/v3.1/all",elModal=document.querySelector(".modal"),elModalTitle=elModal.querySelector(".modal-title"),elModalImg=elModal.querySelector(".modal_country-img"),elModalRegion=elModal.querySelector(".modal_content-region-value"),elModalCurrency=elModal.querySelector(".modal_content-currency-value"),elModalBorders=elModal.querySelector(".modal_content-borders-value"),elModalNativeName=elModal.querySelector(".modal_content-native-value"),elModalLanguages=elModal.querySelector(".modal_content_language-value"),elModalSubregion=elModal.querySelector(".modal_content-subregion-value"),elModalMapLink=elModal.querySelector(".modal_content-link"),elTryBox=document.querySelector(".try-box"),elChangeThemeBtn=document.querySelector(".header-btn"),bg=document.querySelector(".hero--active"),uniqueRegions=new Set,elSimpleModal=document.querySelector("#simpleModal");async function generateRegionOptions(){let e=await fetch(url),t=await e.json();t.forEach(e=>{uniqueRegions.add(e.region)}),uniqueRegions.forEach(e=>{let t=document.createElement("option");t.textContent=e,t.value=e,frag.appendChild(t)}),elSelect.appendChild(frag)}async function renderCountries(e){try{let t=await fetch(e),l=await t.json();for(let o=0;o<l.length;o++){let n=[],r=l[o].population.toString();for(let a of r)n.push(a);5==n.length?n.splice(1,0,"."):6==n.length?n.splice(3,0,"."):7==n.length?(n.splice(1,0,"."),n.splice(5,0,".")):8==n.length?(n.splice(2,0,"."),n.splice(6,0,".")):9==n.length?(n.splice(3,0,"."),n.splice(7,0,".")):10==n.length&&(n.splice(1,0,"."),n.splice(5,0,"."),n.splice(9,0,".")),eList.innerHTML="";let c=elTemplatee.cloneNode(!0);c.querySelector(".countryy_image").src=l[o].flags.png,c.querySelector(".countryy_title").textContent=l[o].name.common,c.querySelector(".countryy_population-value").textContent=n.join(""),c.querySelector(".countryy_region-value").textContent=l[o].region,c.querySelector(".countryy_capital-value").textContent=l[o].capital,c.querySelector(".countryy_info").dataset.tld=l[o].tld,frag.appendChild(c)}eList.appendChild(frag)}catch(i){console.log(i)}}async function showSearchResults(e){let t=await fetch(url),l=await t.json();return l.find(t=>{if(t.name.common==e)return!0;let l=t.name.common.match(e)&&("Filter by region"===elSelect.value||t.region.includes(elSelect.value))&&""===elFormInput.value.trim();return l})}function debounce(e,t){let l;return()=>{clearTimeout(l),l=setTimeout(e,t)}}function debouncingSearch(){let e=elFormInput.value.trim();""==e&&renderCountries(url),showSearchResults(e),renderCountries(`https://restcountries.com/v3.1/name/${e}`),renderCountries(`https://restcountries.com/v3.1/capital/${e}`)}async function showModalInfo(e){try{let t=await fetch(url),l=await t.json(),o=l.find(function(t){if(t.tld==e)return!0}),n=Object.values(o.currencies),r=Object.values(o.name.nativeName),a=Object.values(r[0]);elModalTitle.textContent=o.name.common,elModalImg.src=o.flags.png,elModalRegion.textContent=o.region,elModalCurrency.textContent=n[0].name,o.borders?elModalBorders.textContent=o.borders:elModalBorders.textContent="No borders",elModalNativeName.textContent=a[0],elModalLanguages.textContent=Object.values(o.languages),o.subregion?elModalSubregion.textContent=o.subregion:elModalSubregion.textContent="No subregions",elModalMapLink.href=o.maps.googleMaps,console.log(o)}catch(c){console.log(c)}}function showNextPageModal(){setTimeout(()=>{elSimpleModal.classList.add("show"),elSimpleModal.style.display="block"},3e3),elSimpleModal.addEventListener("click",e=>{e.target.classList.contains("simple-close")?elSimpleModal.style.display="none":e.target.classList.contains("try")&&(window.location.pathname="mapCountry.html")})}elChangeThemeBtn.addEventListener("click",function(){document.body.classList.toggle("theme-dark"),bg.classList.toggle("bg-white")}),elForm.addEventListener("keyup",debounce(debouncingSearch,1e3)),elSelect.addEventListener("change",()=>{console.log("Changed"),renderCountries(`https://restcountries.com/v3.1/region/${elSelect.value}`)}),eList.addEventListener("click",e=>{e.target.matches(".countryy_info")&&showModalInfo(e.target.dataset.tld)}),generateRegionOptions(),renderCountries(url),showNextPageModal();