const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded",()=>{
  setupNav(); setupFavorites(); setupBackTop(); setupToasts(); setupForms(); setupHomeSearch();
  renderFeatured(); renderLatest(); renderCategories();
  if($("#propertyGrid")) initPropertiesPage();
  if($("#propertyDetails")) initDetailsPage();
  if($("#listingForm")) initListingForm();
  if($("#dashboardTable")) initDashboard();
  if($("#agentGrid")) renderAgents();
});

function setupNav(){
 const toggle=$("#menuToggle"), links=$("#navLinks");
 if(toggle) toggle.addEventListener("click",()=>{links.classList.toggle("open"); toggle.setAttribute("aria-expanded",links.classList.contains("open"));});
 $$("#navLinks a").forEach(a=>a.addEventListener("click",()=>links?.classList.remove("open")));
}
function toast(msg){const t=$("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove("show"),2800)}
function setupToasts(){ $$(".toast-trigger").forEach(b=>b.addEventListener("click",()=>toast(b.dataset.message||"Demo action completed."))); }
function setupBackTop(){const b=$("#backTop");if(!b)return;addEventListener("scroll",()=>b.classList.toggle("show",scrollY>500));b.onclick=()=>scrollTo({top:0,behavior:"smooth"});}
function setupFavorites(){
 document.addEventListener("click",e=>{const b=e.target.closest(".favorite");if(!b)return;const id=b.dataset.id;let saved=JSON.parse(localStorage.getItem("favorites")||"[]");saved=saved.includes(Number(id))?saved.filter(x=>x!==Number(id)):[...saved,Number(id)];localStorage.setItem("favorites",JSON.stringify(saved));b.classList.toggle("active",saved.includes(Number(id)));b.innerHTML=saved.includes(Number(id))?"♥":"♡";toast(saved.includes(Number(id))?"Property saved.":"Property removed from saved.");});
}
function isFav(id){return JSON.parse(localStorage.getItem("favorites")||"[]").includes(Number(id))}
function card(p){
 return `<article class="property-card">
 <div class="card-image"><img src="${propertyImage(p)}" alt="${p.title} — demo property image"><span class="badge ${p.listingType==="For Sale"?"sale":""}">${p.listingType}</span><button class="favorite ${isFav(p.id)?"active":""}" data-id="${p.id}" aria-label="Save ${p.title}">${isFav(p.id)?"♥":"♡"}</button></div>
 <div class="card-body"><div class="price">${p.priceLabel}</div><div class="card-title">${p.title}</div><div class="location">⌖ ${p.location}</div>
 <div class="meta"><span>🛏 ${p.bedrooms} beds</span><span>🛁 ${p.bathrooms} baths</span><span>▦ ${p.size}</span></div>
 <div class="card-footer"><small class="muted">${p.propertyType} · ${p.agent}</small><a class="btn btn-outline" href="property-details.html?id=${p.id}">View Property</a></div></div></article>`;
}
function renderFeatured(){
 const el=$("#featuredGrid"); if(!el)return;el.innerHTML=properties.slice(0,6).map(card).join("");
}
function renderLatest(){
 const el=$("#latestGrid"); if(!el)return;el.innerHTML=[...properties].reverse().slice(0,4).map(card).join("");
}
function renderCategories(){
 const el=$("#categoryGrid");if(!el)return;
 const cats=[["Apartment","🏢"],["House","🏠"],["Duplex","🏡"],["Land","◈"],["Commercial Property","▣"],["Office","▤"],["Shop","▥"]];
 el.innerHTML=cats.map(([name,icon])=>`<a class="category" href="properties.html?type=${encodeURIComponent(name)}"><div class="category-icon">${icon}</div><strong>${name}</strong></a>`).join("");
}
function setupHomeSearch(){
 const f=$("#homeSearch");if(!f)return;
 f.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(f);const params=new URLSearchParams();for(const [k,v] of fd)if(v)params.set(k,v);location.href="properties.html?"+params.toString();});
 $$(".search-tabs button").forEach(b=>b.addEventListener("click",()=>{$$(".search-tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#listingType").value=b.dataset.type;}));
}
function initPropertiesPage(){
 const grid=$("#propertyGrid"), resultCount=$("#resultCount"), params=new URLSearchParams(location.search);
 const form=$("#filterForm"); ["listingType","location","propertyType","minPrice","maxPrice","bedrooms","bathrooms","furnished","status"].forEach(k=>{if(form.elements[k]&&params.get(k))form.elements[k].value=params.get(k)});
 let mode="grid";
 function render(){
  let list=[...properties];const fd=new FormData(form);
  list=list.filter(p=>!fd.get("listingType")||p.listingType===fd.get("listingType"))
   .filter(p=>!fd.get("location")||p.location.toLowerCase().includes(fd.get("location").toLowerCase()))
   .filter(p=>!fd.get("propertyType")||p.propertyType===fd.get("propertyType"))
   .filter(p=>!fd.get("minPrice")||p.price>=Number(fd.get("minPrice")))
   .filter(p=>!fd.get("maxPrice")||p.price<=Number(fd.get("maxPrice")))
   .filter(p=>!fd.get("bedrooms")||p.bedrooms>=Number(fd.get("bedrooms")))
   .filter(p=>!fd.get("bathrooms")||p.bathrooms>=Number(fd.get("bathrooms")))
   .filter(p=>!fd.get("furnished")||String(p.furnished)===fd.get("furnished"));
  const sort=$("#sort")?.value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="popular")list.sort((a,b)=>b.popular-a.popular);
  grid.innerHTML=list.length?list.map(card).join(""):`<div class="empty">No demo properties match these filters. Try a broader search.</div>`;
  resultCount.textContent=`${list.length} demo ${list.length===1?"property":"properties"}`;
 }
 form.addEventListener("submit",e=>{e.preventDefault();render()});$("#sort")?.addEventListener("change",render);
 $("#clearFilters")?.addEventListener("click",()=>{form.reset();render()});
 $$(".view-btn").forEach(b=>b.addEventListener("click",()=>{$$(".view-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");mode=b.dataset.view;grid.classList.toggle("list-mode",mode==="list");}));
 render();
}
function initDetailsPage(){
 const p=getProperty(new URLSearchParams(location.search).get("id"))||properties[0], root=$("#propertyDetails");
 root.innerHTML=`<div class="detail-layout"><div><div class="gallery-main"><img id="mainImage" src="${propertyImage(p)}" alt="${p.title}"></div><div class="thumbs">${p.images.map((im,i)=>`<button class="thumb ${i===0?"active":""}" data-img="${im}"><img src="${im}" alt="Demo thumbnail ${i+1}"></button>`).join("")}</div>
 <div class="section-head" style="margin-top:35px"><div><h2>${p.title}</h2><p>⌖ ${p.location} · ${p.propertyType}</p></div></div>
 <p>${p.description}</p><h3>Features & amenities</h3><div class="amenities">${p.amenities.map(x=>`<div class="amenity">✓ ${x}</div>`).join("")}</div>
 <h3 style="margin-top:30px">Location</h3><div class="map-placeholder">Map integration placeholder — no exact address is fabricated.</div></div>
 <aside><div class="detail-card"><div class="detail-price">${p.priceLabel}</div><p class="muted">${p.listingType} · Demo listing</p><div class="detail-grid"><div class="detail-stat"><strong>${p.bedrooms}</strong><small>Bedrooms</small></div><div class="detail-stat"><strong>${p.bathrooms}</strong><small>Bathrooms</small></div><div class="detail-stat"><strong>${p.toilets}</strong><small>Toilets</small></div><div class="detail-stat"><strong>${p.size}</strong><small>Size</small></div></div><p><strong>Property ID:</strong> DEMO-${String(p.id).padStart(4,"0")}</p><p><strong>Agent:</strong> ${p.agent}</p><p><strong>Date listed:</strong> ${p.dateListed}</p><button class="btn btn-primary" style="width:100%" id="openEnquiry">Send Enquiry</button><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><button class="btn btn-outline toast-trigger" data-message="Phone action is a demo.">☎ Phone</button><button class="btn btn-outline toast-trigger" data-message="WhatsApp action is a demo.">◉ WhatsApp</button></div></div></aside></div>`;
 $$(".thumb",root).forEach(b=>b.onclick=()=>{$$(".thumb",root).forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#mainImage",root).src=b.dataset.img});
 $("#openEnquiry")?.addEventListener("click",()=>$("#enquiryModal")?.classList.add("open"));
 setupToasts(); setupEnquiry();
}
function setupEnquiry(){
 const f=$("#enquiryForm");if(!f)return;f.addEventListener("submit",e=>{e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}$("#enquirySuccess").classList.remove("hidden");f.reset();toast("Demo enquiry validated successfully.");});
 $$(".modal-close").forEach(b=>b.onclick=()=>b.closest(".modal").classList.remove("open"));
 $$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
}
function initListingForm(){
 const f=$("#listingForm"), input=$("#images"), previews=$("#previews"), files=[];
 if(input)input.addEventListener("change",()=>{[...input.files].forEach(file=>{if(files.length>=8)return;files.push(file)});renderPreviews();});
 function renderPreviews(){previews.innerHTML="";files.forEach((file,i)=>{const u=URL.createObjectURL(file);previews.insertAdjacentHTML("beforeend",`<div class="preview"><img src="${u}" alt="Selected property image"><button type="button" data-i="${i}">×</button></div>`)});$$(".preview button",previews).forEach(b=>b.onclick=()=>{files.splice(Number(b.dataset.i),1);renderPreviews()})}
 f?.addEventListener("submit",e=>{e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}localStorage.setItem("demoListing",JSON.stringify(Object.fromEntries(new FormData(f))));toast("Demo property listing submitted locally.");$("#listingSuccess").classList.remove("hidden");});
 $("#previewListing")?.addEventListener("click",()=>{if(!f.checkValidity()){f.reportValidity();return}const d=Object.fromEntries(new FormData(f));$("#previewContent").innerHTML=`<div class="property-card"><div class="card-body"><div class="price">${d.price||"Demo price"}</div><div class="card-title">${d.title}</div><div class="location">${d.location||"Demo location"}, ${d.city||""}, ${d.state||""}</div><div class="meta"><span>🛏 ${d.bedrooms||0} beds</span><span>🛁 ${d.bathrooms||0} baths</span><span>${d.propertyType||"Property"}</span></div><p>${d.description||"Demo description"}</p><strong>Listing owner:</strong> ${d.fullName||"Demo owner"}</div></div>`;$("#previewModal").classList.add("open")});
 $$(".modal-close").forEach(b=>b.onclick=()=>b.closest(".modal").classList.remove("open"));
}
function setupForms(){
 $$(".simple-form").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}const s=f.querySelector(".form-success");if(s)s.classList.remove("hidden");toast("Demo form submitted successfully.");}));
 $$(".password-toggle").forEach(b=>b.addEventListener("click",()=>{const i=b.previousElementSibling;i.type=i.type==="password"?"text":"password"}));
}
function initDashboard(){
 const key="demoListings";let list=JSON.parse(localStorage.getItem(key)||"[]");$("#dashboardTotal").textContent=properties.length+list.length;$("#dashboardActive").textContent=properties.length;$("#dashboardPending").textContent=list.length;$("#dashboardEnquiries").textContent=properties.reduce((a,p)=>a+p.enquiries,0);
 const body=$("#dashboardTable");body.innerHTML=properties.slice(0,6).map(p=>`<tr><td>${p.title}</td><td>${p.priceLabel}</td><td><span class="badge">${p.listingType}</span></td><td>${p.views}</td><td>${p.enquiries}</td><td><button class="btn btn-outline toast-trigger" data-message="Edit is a demo interaction.">Edit</button></td></tr>`).join("");
 setupToasts();
}
function renderAgents(){
 const agents=[["Demo Agent","Demo Agency","Demo Location",6],["Demo Landlord","Independent demo owner","Demo District",3],["Demo Property Professional","Demo Realty","Demo City",8]];
 $("#agentGrid").innerHTML=agents.map(a=>`<article class="agent-card"><div class="agent-avatar">${a[0][5]||"D"}</div><h3>${a[0]}</h3><p class="muted">${a[1]} · ${a[2]}</p><p>${a[3]} demo listings</p><a href="agent-profile.html" class="btn btn-outline">View Profile</a></article>`).join("");
}
