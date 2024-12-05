document.addEventListener("DOMContentLoaded", () => {
    const tabList = document.getElementById("tab-list");
    const searchInput = document.getElementById("search");
    const saveSessionButton = document.getElementById("save-session");
    const loadSessionButton = document.getElementById("load-session");
    
    //focus on search
    searchInput.focus();
    // Fetch tabs and render
    function fetchTabs() {
        chrome.runtime.sendMessage({ type: "get-tabs" }, (response) => {
            renderTabs(response.tabs);
        });
    }

    // Render tabs in the UI
    function renderTabs(tabs) {
        tabList.innerHTML = "";
        tabs.forEach((tab) => {
            const tabItem = document.createElement("div");
            tabItem.className = "tab-item";
            const faviconUrl = tab.favIconUrl || "default_favicon.png"; // Use a default favicon if not available

            tabItem.innerHTML = `
            <div class="tab-info">
                <img class="tab-favicon" src="${faviconUrl}" alt="favicon">
                <div class="tab-title">${tab.title}</div> <!-- Fixed width for the tab title -->
            </div>
            <button class="switch-btn" data-tab-id="${tab.id}">Switch</button>
        `;
            tabList.appendChild(tabItem);
        });

        // Add event listeners to "Switch" buttons
        document.querySelectorAll(".switch-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const tabId = parseInt(e.target.dataset.tabId);
                chrome.tabs.update(tabId, { active: true });
            });
        });
    }

    // Search tabs
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const allTabs = tabList.querySelectorAll(".tab-item");
        allTabs.forEach((item) => {
            const title = item.querySelector(".tab-title").textContent.toLowerCase(); // Look inside .tab-title
            item.style.display = title.includes(query) ? "block" : "none"; // Search on the title
        });
    });


    // Save session
    saveSessionButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "get-tabs" }, (response) => {
            const tabUrls = response.tabs.map((tab) => tab.url);
            chrome.storage.local.set({ savedSession: tabUrls }, () => {
                alert("Session saved!");
            });
        });
    });

    // Load session
    loadSessionButton.addEventListener("click", () => {
        chrome.storage.local.get("savedSession", (data) => {
            if (data.savedSession) {
                data.savedSession.forEach((url) => {
                    chrome.tabs.create({ url });
                });
            } else {
                alert("No saved session found!");
            }
        });
    });

    // Initial load
    fetchTabs();
});
