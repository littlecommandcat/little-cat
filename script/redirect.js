const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1144161789832069141";
const HOST_URL = "https://dctw.xyz/servers/1404587685645123665";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
menuToggle.addEventListener("click", () => {
const isOpen = mainNav.classList.toggle("open");

```
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
```

},

document.querySelectorAll("[data-url]").forEach(button => {
button.addEventListener("click", () => {
const target = button.dataset.url;

```
    if (target === "invite") {
        navigate(INVITE_URL);
    } else if (target === "host") {
        navigate(HOST_URL);
    }
});
```

});

function navigate(url) {
document.body.classList.add("page-leaving");

```
setTimeout(() => {
    window.location.href = url;
}, 180);
```

}

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

```
sections.forEach(section => observer.observe(section));
```

} else {
sections.forEach(section => section.classList.add("visible"));
}}))}
