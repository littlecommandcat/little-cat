// ChatGPT

const feedbackGrid = document.getElementById("feedbackGrid");
const feedbackPrev = document.querySelector(".feedback-prev");
const feedbackNext = document.querySelector(".feedback-next");
const feedbackDots = document.getElementById("feedbackDots");

if (feedbackGrid) {
    const cards = Array.from(feedbackGrid.querySelectorAll(".feedback-card"));
    let currentIndex = 0;
    let autoPlay;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;


    function getCardsPerView() {
        if (window.innerWidth <= 600) {
            return 1;
        }

        if (window.innerWidth <= 900) {
            return 2;
        }

        return 3;
    }

    function getStep() {
        const card = cards[0];

        if (!card) {
            return 0;
        }

        const style = getComputedStyle(feedbackGrid);
        const gap = parseFloat(style.columnGap) || 0;

        return card.offsetWidth + gap;
    }

    function getGroupCount() {
        const perView = getCardsPerView();

        return Math.ceil(cards.length / perView);
    }

    function getMaxIndex() {
        return Math.max(0, getGroupCount() - 1);
    }

    function getScrollPosition(index) {
        const perView = getCardsPerView();
        const step = getStep();

        return step * perView * index;
    }

    function updateDots() {
        feedbackDots.innerHTML = "";

        const groupCount = getGroupCount();

        for (let i = 0; i < groupCount; i++) {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "feedback-dot";
            dot.setAttribute("aria-label", `前往第 ${i + 1} 組回饋`);

            if (i === currentIndex) {
                dot.classList.add("active");
            }

            dot.addEventListener("click", () => {
                goTo(i);
                restartAutoPlay();
            });

            feedbackDots.appendChild(dot);
        }
    }

    function updateButtons() {
        const groupCount = getGroupCount();

        feedbackPrev.disabled = groupCount <= 1;
        feedbackNext.disabled = groupCount <= 1;
    }

    function goTo(index) {
        const maxIndex = getMaxIndex();

        currentIndex = Math.max(0, Math.min(index, maxIndex));

        feedbackGrid.scrollTo({
            left: getScrollPosition(currentIndex),
            behavior: "smooth"
        });

        updateButtons();
        updateDots();
    }

    function next() {
        const maxIndex = getMaxIndex();

        if (currentIndex >= maxIndex) {
            goTo(0);
            return;
        }

        goTo(currentIndex + 1);
    }

    function prev() {
        const maxIndex = getMaxIndex();

        if (currentIndex <= 0) {
            goTo(maxIndex);
            return;
        }

        goTo(currentIndex - 1);
    }

    function startAutoPlay() {
        clearInterval(autoPlay);

        if (getGroupCount() <= 1) {
            return;
        }

        autoPlay = setInterval(() => {
            next();
        }, 5000);
    }

    function restartAutoPlay() {
        startAutoPlay();
    }

    feedbackNext.addEventListener("click", () => {
        next();
        restartAutoPlay();
    });

    feedbackPrev.addEventListener("click", () => {
        prev();
        restartAutoPlay();
    });

    feedbackGrid.addEventListener("scroll", () => {
        const step = getStep();
        const perView = getCardsPerView();

        if (!step) {
            return;
        }

        const index = Math.round(
            feedbackGrid.scrollLeft / (step * perView)
        );

        if (index !== currentIndex) {
            currentIndex = Math.max(
                0,
                Math.min(index, getMaxIndex())
            );

            updateButtons();
            updateDots();
        }
    });

    feedbackGrid.addEventListener("mouseenter", () => {
        clearInterval(autoPlay);
    });

    feedbackGrid.addEventListener("mouseleave", () => {
        startAutoPlay();
    });

    feedbackGrid.addEventListener("touchstart", () => {
        clearInterval(autoPlay);
    }, { passive: true });

    feedbackGrid.addEventListener("touchend", () => {
        startAutoPlay();
    }, { passive: true });

    feedbackGrid.addEventListener("mousedown", event => {
        isDragging = true;
        startX = event.pageX;
        startScrollLeft = feedbackGrid.scrollLeft;

        feedbackGrid.style.scrollSnapType = "none";
        feedbackGrid.style.cursor = "grabbing";
    });

    feedbackGrid.addEventListener("mousemove", event => {
        if (!isDragging) {
            return;
        }

        const distance = event.pageX - startX;

        feedbackGrid.scrollLeft = startScrollLeft - distance;
    });

    function stopDragging(event) {
        if (!isDragging) {
            return;
        }

        const distance = startX - event.pageX;

        isDragging = false;

        feedbackGrid.style.scrollSnapType = "x mandatory";
        feedbackGrid.style.cursor = "";

        if (Math.abs(distance) > 50) {
            if (distance > 0) {
                next();
            } else {
                prev();
            }
        } else {
            feedbackGrid.scrollTo({
                left: getScrollPosition(currentIndex),
                behavior: "smooth"
            });
        }

        restartAutoPlay();
    }

    feedbackGrid.addEventListener("mouseup", stopDragging);
    feedbackGrid.addEventListener("mouseleave", event => {
        if (isDragging) {
            stopDragging(event);
        }
    });

    window.addEventListener("resize", () => {
        currentIndex = Math.min(currentIndex, getMaxIndex());

        updateDots();
        updateButtons();

        feedbackGrid.scrollTo({
            left: getScrollPosition(currentIndex),
            behavior: "auto"
        });
    });

    updateDots();
    updateButtons();
    startAutoPlay();


}
