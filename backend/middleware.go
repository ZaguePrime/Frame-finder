package main

import (
	"fmt"
	"net/http"

	"../models"
)

func main() {
	allItems, err := http.Get("https://api.warframe.market/v1/items")
	if err != nil {
		fmt.Println(err.Error())
	}
	defer allItems.Body.Close()

	var responseData models.ItemName
}
