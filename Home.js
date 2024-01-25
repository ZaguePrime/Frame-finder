var LocationArray = [];
var detailObject = [];
var numTRegistered = 0;
var numTs = 0;

var locationData = null;//stores a list of all location data
var itemData = null;//stores a list of all item data
var enemyData = null;//stores a list of all enemy data
var missionData = null;//stores a list of all mission data

const proxyUrl = "https://cors-proxy.fringe.zone/";

document.addEventListener('DOMContentLoaded', function () {
    initialiseData();
});


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
            for (var i = 0; i < locationData.payload.locations.length; i++) {
                if (locationData.payload.locations[i].id == locationID) {
                    LocationArray.push(locationData.payload.locations[i].node_name);
                    // console.log(LocationArray);
                    detailObject.push({
                    Planet: locationData.payload.locations[i].system_name,
                    Node: locationData.payload.locations[i].node_name,
                    Rarity: locationRarity,
                    Rate: dropRateLocation
            });
                // console.log(detailObject);
            numTRegistered++;
            loadSources();
        }
    }
}

function getEnemyName(enemyId, dropRateEnemy, enemyRarity)
{
    numTs++;
    // console.log(enemyData);
    console.log(enemyData.payload.npc.length);
    for(var j = 0; j < enemyData.payload.npc.length; j++) {
        if(enemyData.payload.npc[j].id == enemyId)
        {
            detailObject.push({
                Enemy: enemyData.payload.npc[j].name,
                Rarity: enemyRarity,
                Rate: dropRateEnemy,
                Icon: enemyData.payload.npc[j].icon,
            })
                    // console.log(detailObject);
            numTRegistered++;
            loadSources();
        }
    }
}

function getMissionName(missionId, dropRateMission, missionRarity)
{
    numTs++;
            for(var k = 0; k < missionData.payload.missions.length; k++) {
                if(missionData.payload.missions[k].id == missionId)
                {
                    detailObject.push({
                        Mission: missionData.payload.missions[k].name,
                        Rarity: missionRarity,
                        Rate: dropRateMission
                    })
                    // console.log(detailObject);
                    numTRegistered++;
                    loadSources();
                }
            }
}

function getRelicName(relicID, itemRates, relicRarity)
{
    numTs++;
        for(var l = 0; l < itemData.payload.items.length; l++) {
            if(itemData.payload.items[l].id == relicID)
            {
                var status;
                if(itemData.payload.items[l].vaulted)
                {
                    status = "Yes";
                }
                else
                {
                    status = "No";
                }
                detailObject.push({
                    Relic: itemData.payload.items[l].item_name,
                    Rarity: relicRarity,
                    Rates: itemRates,
                    Vaulted: status
                })
                // console.log(detailObject);
                numTRegistered++;
                loadSources();
            }
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