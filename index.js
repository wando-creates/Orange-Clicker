let oranges = 0; //total score
let opc = 1; //oranges per click
let ops = 0; //oranges per second 
let displayedOranges = 0;

function saveGame() {
    localStorage.setItem("orangeSave", JSON.stringify({
        oranges,
        opc,
        ops,
        upgrades,
        manualUpgrades,
        lastPlayed: Date.now()
    }));
}

function loadGame() {
    const save = JSON.parse(localStorage.getItem("orangeSave"));

    if (!save) return;

    oranges = save.oranges;
    opc = save.opc;
    ops = save.ops;

    save.upgrades.forEach((s, i) => {
        upgrades[i].cost =s.cost;
        upgrades[i].owned = s.owned;
    });

    save.manualUpgrades.forEach((s, i) => {
        manualUpgrades[i].cost = s.cost;
        manualUpgrades[i].owned = s.owned;
    });

    const secondAway = (Date.now() - save.lastPlayed) / 1000;
    const earned = Math.floor(secondsAway * ops);
    oranges += earned;
    if (earned >0) {
        alert('While away, Your passive upgrades produced ${formatNum(earned)} oranges!');
    };

    updateUI();
}



function spawnSlice(x,y) {
    const slice = document.createElement("div");
    slice.classList.add("slice");
    slice.innerHTML = `<img src="images/droplet.png" style="width:30px;height:30px;">`;
    slice.style.left = x + "px";
    slice.style.top = y + "px";
    document.body.append(slice);

    setTimeout(() => slice.remove(), 1000)
}

function clickOrange() {
    oranges += opc; //increases score by opc
    updateUI(true);
}

function smoothCount() {
    displayedOranges += (oranges - displayedOranges) * 0.1;
    const countEl = document.getElementById("count");
    countEl.textContent = formatNum(displayedOranges);
    if (displayedOranges >= 1_000_000) countEl.style.color = "gold";
    else if (displayedOranges >= 1_000) countEl.style.color ="orange";
    else countEl.style.color = "black";
    requestAnimationFrame(smoothCount);
}
smoothCount();

document.getElementById("orange").addEventListener("click", (e) => {
    clickOrange();
    spawnText(e.clientX, e.clientY)
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            spawnSlice(
                e.clientX + (Math.random() - 0.5) * 40,
                e.clientY + (Math.random() - 0.5) * 40);
        }, i * 60);
    }
})

setInterval(() => {
    oranges += ops;
    updateUI(false);
}, 1000);


function updateUI() {
    const countEl = document.getElementById("count");
    if (oranges >= 1_000_000) countEl.style.color ="gold";
    else if(oranges >= 1_000) countEl.style.color ="orange";
    else countEl.style.color = "";

    document.getElementById("ops-display").textContent = "Per Second: " + ops;
    renderShop();
}

function formatNum(n) {
    if (n >= 1_000_000_000_000_000) return (n/1_000_000_000_000_000).toFixed(1) + "Qd"
    if (n >= 1_000_000_000_000) return (n/1_000_000_000_000).toFixed(1) + "T"
    if (n >= 1_000_000_000) return (n/1_000_000_000).toFixed(1) + "B"
    if (n >= 1_000_000) return (n/1_000_000).toFixed(1) + "M"
    if (n >= 1_000) return (n/1_000).toFixed(1) + "K"

    return Math.floor(n);
}

function spawnText(x,y) {
    const el = document.createElement("div");
    el.classList.add("float-text")
    el.textContent ="+"+formatNum(opc);
    el.style.left =x+"px";
    el.style.top=y+"px";
    el.style.color = "black"
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}



const bgDiv = document.getElementById("bg-oranges");
for (let i=0; i < 20; i++) {
    const o = document.createElement("div");
    o.classList.add("bg-orange");
    o.innerHTML = `<img src="images/Orange.png" style="width:30px;height:30px;">`;
    o.style.left=Math.random()*100+"vw";
    o.style.animationDuration = (Math.random() * 10 + 8) + "s";
    o.style.animationDelay = (Math.random() * 8) + "s";
    o.style.fontSize = (Math.random()*30 + 20) + "px";
    bgDiv.appendChild(o);
}
const upgrades = [
    {name: "Orange Tree",       cost: 5e1,      ops: 1,         owned: 0, icon: "images/Orange_Tree.png"},
    {name: "Bigger Tree?",      cost: 2e2,      ops: 5,         owned: 0, icon: "images/big_orange_tree.png"},
    {name: "Crate Of Oranges",  cost: 1e3,      ops: 20,        owned: 0, icon: "images/orange_box.png"},
    {name: "Orange Plot",       cost: 2.5e3,    ops: 50,        owned: 0, icon: "images/orange_plot.png"},
    {name: "Orange Farm",       cost: 1e4,      ops: 225,       owned: 0, icon: "images/orange_farm.png"},
    {name: "Orange Factory",    cost: 1e5,      ops: 5e4,       owned: 0, icon: "images/orange_factory.png"},
    {name: "Marma.. lade?",     cost: 1e7,      ops: 1e6,       owned: 0, icon: "images/marmalade.png"},
];

const manualUpgrades = [
    {name: "Better Click",              cost: 1e2,  opc: 1,     owned: 0, icon: "images/quarter_orange.png"},
    {name: "Super Strong Click",        cost: 1e4,  opc: 1e1,   owned: 0, icon: "images/half_orange.png"},
    {name: "Stronger Click",            cost: 1e6,  opc: 1e2,   owned: 0, icon: "images/full_orange.png"},
    {name: "More Juice",                cost: 1e7,  opc: 1e3,   owned: 0, icon: "images/orange_glass.png"},
    {name: "Juicer Clicker",            cost: 1e8,  opc: 1e4,   owned: 0, icon: "images/orange_carton.png"},
]

function buyUpgrades(index) { //Upgrade function - linked with const upgrades
    const u = upgrades[index];
    if (oranges >= u.cost) {
        oranges -= u.cost;
        u.owned++;
        u.cost = Math.floor(u.cost * 1.15);
        ops += u.ops;
        updateUI(false);
    }
}

function buyManual(index) {
    const m = manualUpgrades[index];
    if (oranges >= m.cost) {
        oranges -= m.cost;
        m.owned++;
        m.cost = Math.floor(m.cost * 1.15);
        opc += m.opc;
        updateUI(false);
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
            <div class="btn-owned">${u.owned}</div>
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
        <div class="btn-owned">${m.owned}</div>
        <strong>${m.name}</strong>
        <span>Cost: ${formatNum(m.cost)}</span>
        <span>Tale: ${formatNum(m.opc)}</span>
        </div>
        </button>
        `;
    })
}




renderShop();

loadGame();
setInterval(saveGame, 5000);
