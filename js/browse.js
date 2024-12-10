const CONTAINER = document.getElementById("name_container")

let worldData

let iconCache = {}

// const SPECIAL_CASES_getItemIcon_LOOKUP = {
//     "gold_block": "Block_of_Gold",
//     "quartz_block": "Block_of_Quartz",
//     "lapiz_block": "Block_of_Lapiz",
//     "emerald_block": "Block_of_Emerald",
//     "bamboo_block": "Block_of_Bamboo",
// }
async function getItemIcon(item_id) {
    if (iconCache[item_id]) {
        return iconCache[item_id]
    }
    console.log(item_id)
    let final = item_id.replace(/^\w+:/, "").split("_");
    final = final
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join("_")
        .replace(/(?:_|^)(on|a|of|with)(?=_|$)/gi, (match) => match.toLowerCase())
        .replace(/(?:_|^)tnt(?=_|$)/gi, (match) => match.toUpperCase());

    const pngUrl = `https://minecraft.wiki/w/Special:FilePath/${final}.png`;
    const pngResponse = await fetch(pngUrl);

    if (pngResponse.ok) {
        iconCache[item_id] = pngResponse.url
        return pngResponse.url;
    }

    const gifUrl = `https://minecraft.wiki/w/Special:FilePath/${final}.gif`;
    const gifResponse = await fetch(gifUrl);

    if (gifResponse.ok) {
        iconCache[item_id] = gifResponse.url
        return gifResponse.url;
    }

    throw new SyntaxError(`'${item_id}' is not a valid item id.`);
}

async function fetchAllWorldData() {
    console.log("fetchAllWorldData")
    const response = await fetch("https://api.omrih.me/top/0")
    console.log("fetched data!")
    return await response.json()
}

async function addWorld(world) {
    console.log("addWorld")
    let wrapper = document.createElement("div");
    wrapper.style.display = "flex"
    wrapper.style.flexDirection = "row"
    wrapper.style.margin = "10px"
    wrapper.style.height = "50px"
    wrapper.style.alignItems = "center"
    wrapper.style.justifyContent = "center"

    let worldName = document.createElement("minecraft-text");
    worldName.textContent = world.raw_name
    worldName.style.marginRight = "10px"

    wrapper.appendChild(worldName)

    try {
        let icon = await getItemIcon(world.icon);
        let img = document.createElement("img");

        img.style.width = "auto"
        img.style.height = "50px"

        img.src = icon

        wrapper.appendChild(img)
    } catch {}

    return wrapper
}

async function init() {
    console.log("init")
    
    worldData = await fetchAllWorldData()
    console.log("done fetching data")

    for (let world of worldData) {
        const worldElement = await addWorld(world)
        CONTAINER.appendChild(worldElement)
    }
}

init()

console.log("e")