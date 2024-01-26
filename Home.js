var LocationArray = [];
var detailObject = [];
var numTRegistered = 0;
var numTs = 0;

var locationData = null;//stores a list of all location data
var itemData = null;//stores a list of all item data
var enemyData = null;//stores a list of all enemy data
var missionData = null;//stores a list of all mission data

var locationMap = {};
var itemMap = {};
var enemyMap = {};
var missionMap = {};

const proxyUrl = "https://cors-proxy.fringe.zone/";

document.addEventListener('DOMContentLoaded', function () {
    initialiseData();
    var List = document.getElementsByClassName("suggestions")[0];
    List.style.display = "none";
});


function setupMaps() {
    // Create a map of location IDs to location data
    for (var i = 0; i < locationData.payload.locations.length; i++) {
        locationMap[locationData.payload.locations[i].id] = locationData.payload.locations[i];
    }

    // Create a map of item IDs to item data
    for (var i = 0; i < itemData.payload.items.length; i++) {
        itemMap[itemData.payload.items[i].id] = itemData.payload.items[i];
    }

    // Create a map of enemy IDs to enemy data
    for (var i = 0; i < enemyData.payload.npc.length; i++) {
        enemyMap[enemyData.payload.npc[i].id] = enemyData.payload.npc[i];
    }

    // Create a map of mission IDs to mission data
    for (var i = 0; i < missionData.payload.missions.length; i++) {
        missionMap[missionData.payload.missions[i].id] = missionData.payload.missions[i];
    }
    console.log("DONE");
}


async function initialiseData() {
    try {
        // Load all data concurrently
        const [locations, items, enemies, missions] = await Promise.all([
            loadLocations(),
            loadItems(),
            loadEnemies(),
            loadMissions()
        ]);

        // Check if any of the data is null
        if (!locations || !items || !enemies || !missions) {
            throw new Error("Failed to load one or more data sets.");
        }

        // Assign the data to global variables
        locationData = locations;
        itemData = items;
        enemyData = enemies;
        missionData = missions;
    } catch (error) {
        throw error; // Propagate the error to the caller
    }

    setupMaps();
    populateSuggestions();

}

function initialFetch() {
    LocationArray = [];
    detailObject = [];
    numTRegistered = 0;
    numTs = 0;
    var results = document.getElementById("payload");
    var itemName = document.getElementById("itemName").value;
    itemName = itemName.toLowerCase();
    itemName = itemName.replaceAll(" ", "_");
    console.log(itemName);

    const url1 = "https://api.warframe.market/v1/items/";
    const url2 = "/dropsources?include=item";
    const finalURL = url1 + itemName +  url2;

    fetchData(proxyUrl + finalURL)
        .then(response => {
            for(var i = 0; i < response.payload.dropsources.length; i++) {
                if(response.payload.dropsources[i].type == 'mission' && response.payload.dropsources[i].location != null)
                {
                    getLocationName(response.payload.dropsources[i].location, response.payload.dropsources[i].rate, response.payload.dropsources[i].rarity);
                }
                else if(response.payload.dropsources[i].type == 'mission' && response.payload.dropsources[i].location == null)
                {
                    getMissionName(response.payload.dropsources[i].mission, response.payload.dropsources[i].rate, response.payload.dropsources[i].rarity);
                }            
                else if(response.payload.dropsources[i].type == 'npc')
                {
                    getEnemyName(response.payload.dropsources[i].npc, response.payload.dropsources[i].rate, response.payload.dropsources[i].rarity);
                }
                else if(response.payload.dropsources[i].type == 'relic')
                {
                    getRelicName(response.payload.dropsources[i].relic, response.payload.dropsources[i].rates, response.payload.dropsources[i].rarity);
                }
            }
            // return response;
            // results.innerHTML = JSON.stringify(response.payload.dropsources[0]);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


function getLocationName(locationID, dropRateLocation, locationRarity) {
    numTs++;
    if(locationMap[locationID] != null)
    {
        detailObject.push({
            Planet: locationMap[locationID].system_name,
            Node: locationMap[locationID].node_name,
            Rarity: locationRarity,
            Rate: dropRateLocation
        });
        numTRegistered++;
        loadSources();
    }
}

function getEnemyName(enemyId, dropRateEnemy, enemyRarity)
{
    numTs++;
    if(enemyMap[enemyId] != null)
    {
        detailObject.push({
            Enemy: enemyMap[enemyId].name,
            Rarity: enemyRarity,
            Rate: dropRateEnemy,
            Icon: enemyMap[enemyId].icon,
        })
        numTRegistered++;
        loadSources();
    }
}

function getMissionName(missionId, dropRateMission, missionRarity)
{
    numTs++;
    if(missionMap[missionId] != null)
    {
        detailObject.push({
            Mission: missionMap[missionId].name,
            Rarity: missionRarity,
            Rate: dropRateMission
        })
        numTRegistered++;
        loadSources();
    }
}

function getRelicName(relicID, itemRates, relicRarity)
{
    numTs++;
    if(itemMap[relicID] != null)
    {
        var status;
        if(itemMap[relicID].vaulted)
        {
            status = "Yes";
        }
        else
        {
            status = "No";
        }
        detailObject.push({
            Relic: itemMap[relicID].item_name,
            Rarity: relicRarity,
            Rates: itemRates,
            Vaulted: status
        })
        numTRegistered++;
        loadSources();
    }
}

function loadSources()
{
    console.log("Fulfilled:"+numTRegistered);
    console.log("Promised:"+numTs);
    if(numTRegistered == numTs)
    {
        console.log(detailObject);
    }
}

function populateSuggestions(){
    var List = document.getElementsByClassName("suggestions")[0];
    var suggestionItems = document.getElementsByTagName("li");
    for(var i = 0; i < itemData.payload.items.length; i++)
    {
        var listItem = document.createElement("li");
        listItem.onclick = function() {
            document.getElementById("itemName").value = this.innerHTML;
            List.style.display = "none";
            initialFetch();
        };
        listItem.innerHTML = itemData.payload.items[i].item_name;
        // listItem.setAttribute("onclick", "selectSuggestion(this)");
        List.appendChild(listItem);
    }
    console.log("DONE");
}

function filterSuggestions()
{
    var List = document.getElementsByClassName("suggestions")[0];
    var suggestionItems = document.getElementsByTagName("li");
    if(document.getElementById("itemName").value.toLowerCase() == "")
    {
        List.style.display = "none";
        return;
    }
    if(List.style.display === "none")
        List.style.display = "block";
    for(var z = 0; z < suggestionItems.length; z++)
    {
        if(suggestionItems[z].innerHTML.toLowerCase().includes(document.getElementById("itemName").value.toLowerCase()))
        {
            suggestionItems[z].style.display = "block";
        }
        else
        {
            suggestionItems[z].style.display = "none";
        }
    }
}