var LocationArray = [];
var detailObject = [];
var numTRegistered = 0;
var numTs = 0;

var locationData = null;//stores a list of all location data
var itemData = null;//stores a list of all item data
var enemyData = null;//stores a list of all enemy data
var missionData = null;//stores a list of all mission data

const proxyUrl = "https://cors-proxy.fringe.zone/";


function initialiseData() {
    locationData = loadLocations();
    itemData = loadItems();
    enemyData = loadEnemies();
    missionData = loadMissions();
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
                    numTs++;
                    console.log(numTs);
                }
                else if(response.payload.dropsources[i].type == 'mission' && response.payload.dropsources[i].location == null)
                {
                    getMissionName(response.payload.dropsources[i].mission, response.payload.dropsources[i].rate, response.payload.dropsources[i].rarity);
                    numTs++;
                    console.log(numTs);
                }            
                else if(response.payload.dropsources[i].type == 'npc')
                {
                    getEnemyName(response.payload.dropsources[i].npc, response.payload.dropsources[i].rate, response.payload.dropsources[i].rarity);
                    numTs++;
                    console.log(numTs);
                }
                else if(response.payload.dropsources[i].type == 'relic')
                {
                    getRelicName(response.payload.dropsources[i].relic, response.payload.dropsources[i].rates, response.payload.dropsources[i].rarity);
                    numTs++;
                    console.log(numTs);
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
    const url = "https://api.warframe.market/v1/locations";

    return fetchData(proxyUrl + url)
        .then(response => {
            const id = locationID;
            // console.log("Number of locations: " + response.payload.locations.length);
            for (var i = 0; i < response.payload.locations.length; i++) {
                if (response.payload.locations[i].id == id) {
                    LocationArray.push(response.payload.locations[i].node_name);
                    // console.log(LocationArray);
                    detailObject.push({
                        Planet: response.payload.locations[i].system_name,
                        Node: response.payload.locations[i].node_name,
                        Rarity: locationRarity,
                        Rate: dropRateLocation
                    });
                    // console.log(detailObject);
                    numTRegistered++;
                    loadSources();
                }
            }
            return response; // or handle the case when location is not found
        })
        .catch(error => {
            console.error("Error fetching location data:", error);
            return null; // or handle the error case
        });
}

function getEnemyName(enemyId, dropRateEnemy, enemyRarity)
{
    const urlEnemy = "https://api.warframe.market/v1/npc";
    return fetchData(proxyUrl + urlEnemy)
        .then(response => {
            for(var j = 0; j < response.payload.npc.length; j++) {
                if(response.payload.npc[j].id == enemyId)
                {
                    detailObject.push({
                        Enemy: response.payload.npc[j].name,
                        Rarity: enemyRarity,
                        Rate: dropRateEnemy,
                        Icon: response.payload.npc[j].icon,
                    })
                    // console.log(detailObject);
                    numTRegistered++;
                    loadSources();
                }
            }
        })
        .catch(error => {
            console.error("Error fetching enemy data:", error);
            return null;
        });
}

function getMissionName(missionId, dropRateMission, missionRarity)
{
    const urlMission = "https://api.warframe.market/v1/missions";
    return fetchData(proxyUrl + urlMission)
        .then(response => {
            for(var k = 0; k < response.payload.missions.length; k++) {
                if(response.payload.missions[k].id == missionId)
                {
                    detailObject.push({
                        Mission: response.payload.missions[k].name,
                        Rarity: missionRarity,
                        Rate: dropRateMission
                    })
                    // console.log(detailObject);
                    numTRegistered++;
                    loadSources();
                }
            }
        })
        .catch(error => {
            console.error("Error fetching mission data:", error);
            return null;
        });
}

function getRelicName(relicID, itemRates, relicRarity)
{
    const urlRelic = "https://api.warframe.market/v1/items";
    return fetchData(proxyUrl + urlRelic)
    .then(response => {
        for(var l = 0; l < response.payload.items.length; l++) {
            if(response.payload.items[l].id == relicID)
            {
                var status;
                if(response.payload.items[l].vaulted)
                {
                    status = "Yes";
                }
                else
                {
                    status = "No";
                }
                detailObject.push({
                    Relic: response.payload.items[l].item_name,
                    Rarity: relicRarity,
                    Rates: itemRates,
                    Vaulted: status
                })
                // console.log(detailObject);
                numTRegistered++;
                loadSources();
            }
        }
    })
    .catch(error => {
        console.error("Error fetching relic data:", error);
        return null;
    });
}

function loadSources()
{
    console.log("Called");
    if(numTRegistered == numTs)
    {
        console.log(detailObject);
    }
    console.log("T 1: "+numTRegistered);
    console.log("T 2: "+numTs);
}