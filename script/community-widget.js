function formatCount(count) {
    if (typeof count !== "number" || !Number.isFinite(count)) {
        return null;
    }
    return `${count.toLocaleString("zh-TW")} 位上線`;
}

async function updateCommunityCard(span) {
    const guildId = span.dataset.guildId;

    if (!guildId) return;

    try {
        const response = await fetch(
            `https://discord.com/api/guilds/${guildId}/widget.json`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error(`Discord widget API HTTP ${response.status}`);
        }

        const data = await response.json();
        const presence = typeof data.presence_count === "number" ? data.presence_count : null;

        span.textContent = formatCount(presence) ?? "無法取得人數";
    } catch (error) {
        console.warn("無法抓取社群人數：", error);
        span.textContent = "無法取得人數";
    }
}

function initCommunityWidget() {
    const spans = document.querySelectorAll(".community-card [data-guild-id]");
    spans.forEach(updateCommunityCard);
}

document.addEventListener("DOMContentLoaded", initCommunityWidget);
