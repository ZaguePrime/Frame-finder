function fetchData(url) {
    return new Promise((resolve, reject) => {
        const getItems = new XMLHttpRequest();
        getItems.open("GET", url, true);
        getItems.setRequestHeader("accept", "application/json");
        getItems.setRequestHeader("Language", "en");
        getItems.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        getItems.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const serverResponse = JSON.parse(this.responseText);
                    resolve(serverResponse);
                } else {
                    reject(new Error("Request failed with status: " + this.status));
                }
            }
        };

        getItems.send();
    });
}

function loadLocations() {
    const url = "https://api.warframe.market/v1/locations";
    return fetchData(proxyUrl + url)
        .then(response => {
            return response; // or handle the case when location is not found
        })
        .catch(error => {
            console.error("Error fetching location data:", error);
            return null; // or handle the error case
        });
}

function loadEnemies()
{
    const urlEnemy = "https://api.warframe.market/v1/npc";
    return fetchData(proxyUrl + urlEnemy)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error("Error fetching enemy data:", error);
            return null;
        });
}

function loadMissions()
{
    const urlMission = "https://api.warframe.market/v1/missions";
    return fetchData(proxyUrl + urlMission)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error("Error fetching mission data:", error);
            return null;
        });
}

function loadItems()
{
    const urlRelic = "https://api.warframe.market/v1/items";
    return fetchData(proxyUrl + urlRelic)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error("Error fetching relic data:", error);
            return null;
        });
}

function getImage(response, urlArr, item)
{
    console.log("Item "+item);
    // for(var i = 0; i < response.include.item.items_in_set.length; i++)
    // {
    //     console.log(response.include.item.items_in_set[i].icon);
    //     if(response.include.item.items_in_set[i].icon.includes(item))
    //         urlArr.push(itemImageURL+response.include.item.items_in_set[i].icon);
    // }
    var bestMatchIndex = findBestMatch(item, response);
    urlArr.push(itemImageURL+response.include.item.items_in_set[bestMatchIndex].icon);
    return urlArr;
}

function findBestMatch(item, response)
{
    var bestMatch = -1;
    var bestMatchIndex = -1;
    for(var i = 0; i < response.include.item.items_in_set.length; i++)
    {
        var matchPercentage = 0;
        for(const char of item)
        {
            for(const char2 of response.include.item.items_in_set[i].icon)
            {
                if(char == char2)
                {
                    matchPercentage++;
                    continue;
                }
            }
        }
        if(matchPercentage > bestMatch)
        {
            bestMatch = matchPercentage;
            bestMatchIndex = i;
        }
    }
    return bestMatchIndex;
}