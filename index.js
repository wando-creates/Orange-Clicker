let oranges = 0; //total score
let opc = 1; //oranges per click
let ops = 0; //oranges per second 

function clickOrange() {
    oranges += opc; //increases score by opc
    updateUI();
}

setInterval(() => {
    oranges += ops;
    updateUI();
}, 1000);

function updateUI() {
    document.getElementById("count").textContent = Math.floor(oranges);
    document.getElementById("ops-display").textContent = "Per Second: " + ops;
    renderShop();
}

function formatNum(n) {
    if (n >= 1_000_000_000) return (n/1_000_000_000).toFixed(1) + "B"
    if (n >= 1_000_000) return (n/1_000_000).toFixed(1) + "M"
    if (n >= 1_000) return (n/1_000).toFixed(1) + "K"

    return Math.floor(n);
}
const upgrades = [
    {name: "Orange Tree", cost: 50, ops: 1, owned: 0, icon: "images/Orange_Tree.png"},
    {name: "Bigger Tree?", cost: 200, ops: 5, owned: 0, icon: "images/big_orange_tree.png"},
    {name: "Crate Of Oranges", cost: 1000, ops: 20, owned: 0, icon: "images/orange_box.png"},
    {name: "Orange Plot", cost: 2500, ops: 50, owned: 0, icon: "images/orange_plot.png"},
    {name: "Orange Farm", cost: 10000, ops: 225, owned: 0, icon: null},
    {name: "Orange Ranch", cost: 100000, ops: 3000, owned: 0, icon: null},
    {name: "Orange Factory", cost: 1000000, ops: 50000, owned: 0, icon: "images/orange_factory.png"},
    {name: "Marma.. lade?", cost: 100000000, ops: 1000000, owned: 0, icon: null},

];

const manualUpgrades = [
    {name: "Better Click", cost: 100, opc: 1, owned: 0, icon: null},
    {name: "Super Strong Click", cost: 10000, opc: 100, owned: 0, icon: null}
]

function buyUpgrades(index) { //Upgrade function - linked with const upgrades
    const u = upgrades[index];
    if (oranges >= u.cost) {
        oranges -= u.cost;
        u.owned++;
        u.cost = Math.floor(u.cost * 1.15);
        ops += u.ops;
        updateUI();
    }
}

function buyManual(index) {
    const m = manualUpgrades[index];
    if (oranges >= m.cost) {
        oranges -= m.cost;
        m.owned++;
        m.cost = Math.floor(m.cost * 1.15);
        opc += m.opc;
        updateUI();
    }
}

function renderShop() {
    const shop = document.getElementById("shop");
    const iconBar = document.getElementById("icon-bar")
    shop.innerHTML = "";
    shop.innerHTML += `
    <p class="shop-label">Passive Upgrades</p>`
    upgrades.forEach((u, i) => {
        const canAfford = oranges >= u.cost;
        shop.innerHTML += `
            <button
            class="shop-btn ${canAfford ? 'affordable' : 'locked'}"
            onclick="buyUpgrades(${i})">
            <img class="btn-icon" src="${u.icon}">
            <div class="btn-info">
            <strong>${u.name}</strong>
            <span>Cost: ${formatNum(u.cost)}</span>
            <span>Tale: ${formatNum(u.ops)}</span>
            </div>
            </button>
            `;

    });
    
    shop.innerHTML += `
    <p class="shop-label">Upgrades</p>`
    manualUpgrades.forEach((m, i) => {
        const canAfford = oranges >= m.cost;
        shop.innerHTML += `
        <button
        class="shop-btn ${canAfford ? 'affordable' : 'locked'}"
        onclick="buyManual(${i})">
        <img class="btn-icon" src="${m.icon}">
        <div class="btn-info">
        <strong>${m.name}</strong>
        <span>Cost: ${formatNum(m.cost)}</span>
        <span>Tale: ${formatNum(m.opc)}</span>
        </div>
        </button>
        `;
    })
}




renderShop();
