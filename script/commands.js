const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");


        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            document.body.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });


}

const search = document.getElementById("commandSearch");
const commandCards = document.querySelectorAll(".command-card");
const noResults = document.getElementById("noResults");

if (search) {
    search.addEventListener("input", () => {
        const keyword = search.value.trim().toLowerCase();
        let visibleCount = 0;


        commandCards.forEach(card => {
            const content = card.textContent.toLowerCase();
            const matched = content.includes(keyword);

            card.style.display = matched ? "" : "none";

            if (matched) {
                visibleCount++;
            }
        });

        noResults.style.display = visibleCount === 0 ? "block" : "none";
    });


}

document.querySelectorAll(".copy-command").forEach(button => {
    button.addEventListener("click", async () => {
        const command = button.dataset.copy;


        try {
            await navigator.clipboard.writeText(command);

            const originalText = button.textContent;
            button.textContent = "已複製";

            setTimeout(() => {
                button.textContent = originalText;
            }, 1200);
        } catch {
            button.textContent = "複製失敗";

            setTimeout(() => {
                button.textContent = "複製";
            }, 1200);
        }
    });


});

const sections = document.querySelectorAll("section");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08
    });


    sections.forEach(section => observer.observe(section));


} else {
    sections.forEach(section => section.classList.add("visible"));
}
