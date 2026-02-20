document.addEventListener("DOMContentLoaded", function () {

const articles = document.querySelectorAll(".post-content");

articles.forEach(function(content){

let fullText = content.innerText;

if(fullText.length > 120){

let shortText = fullText.substring(0,120) + "...";

content.innerText = shortText;
content.setAttribute("data-full",fullText);
content.setAttribute("data-short",shortText);

let btn = document.createElement("button");
btn.innerText = "Selengkapnya";
btn.classList.add("read-btn");

btn.onclick = function(){

if(content.innerText === shortText){
content.innerText = fullText;
btn.innerText = "Tutup";
}else{
content.innerText = shortText;
btn.innerText = "Selengkapnya";
}

}

content.after(btn);

}

});

});
