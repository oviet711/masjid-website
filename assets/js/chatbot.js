async function sendMessage(){
    const input=document.getElementById("chat-input");
    const chatWindow=document.getElementById("chat-window");

    if(!input.value) return;

    chatWindow.innerHTML+=`<div><b>Anda:</b> ${input.value}</div>`;

    const loading=document.createElement("div");
    loading.innerHTML="<i>AI sedang mengetik...</i>";
    chatWindow.appendChild(loading);

    try{
        const res=await fetch("YOUR_WORKER_URL",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:input.value})
        });

        const data=await res.json();
        loading.remove();

        chatWindow.innerHTML+=`<div><b>AI:</b> ${data.choices[0].message.content}</div>`;

    }catch(err){
        loading.innerHTML="AI tidak tersedia.";
    }

    input.value="";
    chatWindow.scrollTop=chatWindow.scrollHeight;
}
