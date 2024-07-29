package models

type AllItems struct {
	Items []Item `json:"items"`
}

type Item struct {
	ID   string `json:"id"`
	Name string `json:"item_name"`
}
