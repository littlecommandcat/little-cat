const documentMenuToggle = document.querySelector(".document-menu-toggle");
const documentNav = document.getElementById("documentNav");

if (documentMenuToggle && documentNav) {
    const closeDocumentMenu = () => {
        documentNav.classList.remove("open");
        documentMenuToggle.setAttribute("aria-expanded", "false");
        documentMenuToggle.setAttribute("aria-label", "開啟章節選單");
    };

    documentMenuToggle.addEventListener("click", () => {
        const isOpen = documentNav.classList.toggle("open");
        documentMenuToggle.setAttribute("aria-expanded", String(isOpen));
        documentMenuToggle.setAttribute("aria-label", isOpen ? "關閉章節選單" : "開啟章節選單");
    });

    documentNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeDocumentMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && documentNav.classList.contains("open")) {
            closeDocumentMenu();
            documentMenuToggle.focus();
        }
    });
}
