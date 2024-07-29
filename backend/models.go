package backend

type Response struct {
	Items []Item `json:"items"`
}

type Item struct {
	ID   string `json:"id"`
	Name string `json:"item_name"`
}
