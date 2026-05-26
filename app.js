
document.addEventListener("DOMContentLoaded", async function() {    
    appState = {
        showGeekLand: false,
        showOniLand: false,
    }

    const geekToggle = document.getElementById("geekToggle");
    const oniToggle = document.getElementById("oniToggle");

    buildSeasonMap();
    updateSeasonMap(appState);

    placeTradeStoreOverlay(1, 1);
    placeTradeStoreOverlay(2, 2);
    placeTradeStoreOverlay(1, 12);
    placeTradeStoreOverlay(2, 11);
    placeTradeStoreOverlay(12, 1);
    placeTradeStoreOverlay(11, 2);
    placeTradeStoreOverlay(12, 12);
    placeTradeStoreOverlay(11, 11);
    
    geekToggle.addEventListener("change", () => {
        appState.showGeekLand = geekToggle.checked;
        updateSeasonMap(appState);
    });

    oniToggle.addEventListener("change", () => {
        appState.showOniLand = oniToggle.checked;
        updateSeasonMap(appState);
    });

})


const geekLand = [
    [1, 10],
    [2, 9],
    [2, 10],
    [2, 11],
    [3, 9], 
    [3, 11],
    [3, 12],
    [4, 12],
    [5, 11],
    [5, 12],
    [7, 11],
    [7, 12],
];

const oniLand = [
    [2, 10],
    [3, 9],
    [3, 11],
    [4, 12],
    [5, 11],
    [7, 11],
];


function buildSeasonMap() {
    const map = document.getElementById("bottom-container");
    map.innerHTML = "";

    for (let row = 1; row <= 13; row++) {
        for (let col = 1; col <= 13; col++) {
            const cell = document.createElement("div");

            cell.classList.add("map-cell");
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (row === 7 && col === 7) {
                const img = document.createElement("img");
                img.src = "pictures/capital.png";
                img.alt = "Capital";
                cell.appendChild(img);
            } else {
                cell.textContent = `${row},${col}`;
            }

            map.appendChild(cell);
        }
    }
}

function updateSeasonMap(appState) {
    const cells = document.querySelectorAll(".map-cell");

    cells.forEach(cell => {
        cell.classList.remove("geekLand", "oni");
        

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        // skip capital tile
        if (row === 7 && col === 7) {
            return;
        }

        // clear existing text
        cell.textContent = `${row},${col}`;


        if (appState.showGeekLand && hasTile(geekLand, row, col)) {
            cell.classList.add("geekLand");
        }

        if (appState.showOniLand && hasTile(oniLand, row, col)) {
            cell.classList.add("oni");
        }

        // if (appState.showOniLand && hasTile(oniGenerals, row, col)) {
        //     cell.classList.add("general");
        //     cell.textContent = "G";
        // }
    });
}

function hasTile(tileList, row, col) {
    return tileList.some(([tileRow, tileCol]) => {
        return tileRow === row && tileCol === col;
    });
}


function placeTradeStoreOverlay(row, col) {
    const map = document.getElementById("bottom-container");

    const cellSize = 40;
    const gap = 1;
    const padding = 6;

    const x = padding + col * cellSize + (col - 0.5) * gap;
    const y = padding + row * cellSize + (row - 0.5) * gap;

    const store = document.createElement("div");
    store.classList.add("trade-store-overlay");

    store.style.left = `${x}px`;
    store.style.top = `${y}px`;

    map.appendChild(store);
}