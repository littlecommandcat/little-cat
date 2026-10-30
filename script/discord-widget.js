const DISCORD_GUILD_ID = "1061475265924038758";
const WIDGET_API_URL = `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`;

async function updateDiscordWidget() {
    const wrapper = document.querySelector(".discord-widget");
    if (!wrapper) return;

    const nameEl = wrapper.querySelector("[data-widget-name]");
    const onlineEl = wrapper.querySelector("[data-widget-online]");
    const dotEl = wrapper.querySelector("[data-widget-dot]");

    try {
        const response = await fetch(WIDGET_API_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Discord API HTTP ${response.status}`);
        }

        const data = await response.json();
        const onlineCount = typeof data.presence_count === "number" ? data.presence_count : 0;

        if (nameEl && typeof data.name === "string") {
            nameEl.textContent = data.name;
        }
        if (onlineEl) {
            onlineEl.textContent = `${onlineCount} 位成員上線`;
        }
        if (dotEl) {
            dotEl.classList.remove("widget-dot-error");
        }
    } catch (error) {
        console.warn("無法抓取 Discord widget 人數：", error);

        if (onlineEl) {
            onlineEl.textContent = "無法取得人數";
        }
        if (dotEl) {
            dotEl.classList.add("widget-dot-error");
        }
        if (nameEl) {
            nameEl.textContent = "Discord 支援社群";
        }
    }
}

document.addEventListener("DOMContentLoaded", updateDiscordWidget);
