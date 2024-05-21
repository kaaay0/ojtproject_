document.addEventListener("DOMContentLoaded", function() {
    
    document.querySelector(".container").addEventListener("click", function() {
     
        document.body.classList.add("fade-out");

     
        setTimeout(function() {
            window.location.href = "./login.html";
        }, 500);
    });
});
