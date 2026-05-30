let appState = {
        showGeekLand: false,
        showOniLand: false,
    }

document.addEventListener("DOMContentLoaded", async function() {    

    const geekToggle = document.getElementById("geekToggle");
    const oniToggle = document.getElementById("oniToggle");

    buildSeasonMap();
    updateSeasonMap();

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
        updateSeasonMap();
    });

    oniToggle.addEventListener("change", () => {
        appState.showOniLand = oniToggle.checked;
        updateSeasonMap();
    });

    const cells = document.querySelectorAll(".map-cell");
    cells.forEach(cell => (
        cell.addEventListener("click", (e) => mapCellHandler(e))
    ))

    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modals = document.querySelectorAll(".modal");
            modals.forEach(modal => {
                modal.style.display = "none";
            })
        })
    })

})


const geekLand = [
    [2,9],[2,11],[3,8],[3,9],[3,11],[5,11],[6,11],[7,11],[3,10],[4,11],[6,10],[4,8]
];


function buildSeasonMap() {
    const map = document.getElementById("bottom-container");
    map.innerHTML = "";

    for (let row = 1; row <= 13; row++) {
        for (let col = 1; col <= 13; col++) {
            const cell = document.createElement("div");

            cell.classList.add("map-cell");
            if ((row % 2 == 0 && col % 2 == 0) || (row % 2 == 1 && col % 2 == 1)) {
                cell.classList.add("digger");
            } 
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (row === 7 && col === 7) {
                const img = document.createElement("img");
                img.src = "pictures/capital.png";
                img.alt = "Capital";
                img.id = "capital";
                cell.appendChild(img);
            } else {
                cell.textContent = `${row},${col}`;
            }

            map.appendChild(cell);
        }
    }
}

function updateSeasonMap() {
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

        if (appState.showOniLand && hasTile(geekLand, row, col)) {
            if ((row % 2 == 0 && col % 2 == 0) || (row % 2 == 1 && col % 2 == 1)) {
                return
            } 
            cell.classList.add("oni");
        }
       

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

async function mapCellHandler(e) {
    if (!appState.showGeekLand) return;

    if (e.target.id == "capital") {
        console.log(JSON.stringify(geekLand));
        return;
    }
    if (!appState.showGeekLand) return;

    const target = e.target;
    const dataRow = Number(target.dataset.row);
    const dataCol = Number(target.dataset.col);
    const isGeekLand = clickedGeekLand(dataRow, dataCol);
    
    if (isGeekLand){
        const messageElement = document.getElementById("remove-land-message");
        let message = `Remove [${dataRow}-${dataCol}] land from Geek?`;
        messageElement.textContent = message;
        const confirmed = await removeGeekLand();
        if (!confirmed) return;

        const index = geekLand.findIndex(
            ([row, col]) => row === dataRow && col === dataCol
        );

        geekLand.splice(index, 1);
    } else {
        const messageElement = document.getElementById("add-land-message");
        let message = `Add [${dataRow}-${dataCol}] land to Geek?`;
        messageElement.textContent = message;
        const confirmed = await addGeekLand();
        if (!confirmed) return;
        geekLand.push([dataRow, dataCol]);
    }
    

    updateSeasonMap();
    console.log(geekLand);
}

function clickedGeekLand(dataRow, dataCol) {
    const index = geekLand.findIndex(
        ([row, col]) => row === dataRow && col === dataCol
    );

    return index == -1 ? false : true
}

function removeGeekLand() {
    return new Promise (resolve => {
        const modal = document.getElementById("confirmation-modal");
        const yesButton = document.getElementById("yes-button");
        const noButton = document.getElementById("cancel-button");

        modal.style.display = "block";

        const handleYesClick = () => {
            modal.style.display = "none";
            cleanup() // remove listeners 
            resolve(true);
        }

        const handleNoClick = () => {
            modal.style.display = "none";
            cleanup(); // Clean up listeners
            resolve(false);
        };

        yesButton.addEventListener("click", handleYesClick);
        noButton.addEventListener("click", handleNoClick);

        function cleanup() {
            yesButton.removeEventListener("click", handleYesClick);
            noButton.removeEventListener("click", handleNoClick);
        }

    });
}

function addGeekLand() {
    return new Promise (resolve => {
        const modal = document.getElementById("confirmation-add-modal");
        const yesButton = document.getElementById("yes-add-button");
        const noButton = document.getElementById("cancel-add-button");

        modal.style.display = "block";

        const handleYesClick = () => {
            modal.style.display = "none";
            cleanup() // remove listeners 
            resolve(true);
        }

        const handleNoClick = () => {
            modal.style.display = "none";
            cleanup(); // Clean up listeners
            resolve(false);
        };

        yesButton.addEventListener("click", handleYesClick);
        noButton.addEventListener("click", handleNoClick);

        function cleanup() {
            yesButton.removeEventListener("click", handleYesClick);
            noButton.removeEventListener("click", handleNoClick);
        }

    });
}