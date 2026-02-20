function getID(){

let url = new URL(window.location.href);
return url.searchParams.get("id");

}

async function loadPost(){

let id = getID();

const res = await fetch('/masjid-website/data/articles.json');
const data = await res.json();

let post = data[id];

document.getElementById("post-title").innerText = post.judul;
document.getElementById("post-content").innerText = post.isi;

}

loadPost();
