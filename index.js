document.addEventListener("DOMContentLoaded", () => {
    console.log("G12 Biology Project is ready.");
});


const resourceBtn = document.getElementById("resourceBtn");
const resourceMenu = document.getElementById("resourceMenu");

if (resourceBtn && resourceMenu) {
    resourceBtn.addEventListener("click", function(event) {
        event.stopPropagation();

        const isOpen = resourceMenu.classList.toggle("show");
        resourceBtn.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", function(event) {
        if (!event.target.closest(".dropdown")) {
            resourceMenu.classList.remove("show");
            resourceBtn.setAttribute("aria-expanded", "false");
        }
    });
}