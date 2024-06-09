package cars

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type CarModel struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	ManufacturerID int    `json:"manufacturerId"`
	CategoryID     int    `json:"categoryId"`
	Year           int    `json:"year"`
	Specifications Specifications
	Image          string `json:"image"`
	Manufacturer   CarManufacturer
	Categories     CarCategories
}

type Specifications struct {
	Engine       string `json:"engine"`
	Horsepower   int    `json:"horsepower"`
	Transmission string `json:"transmission"`
	Drivetrain   string `json:"drivetrain"`
}

type CarManufacturer struct {
	ID               int    `json:"id"`
	ManufacturerName string `json:"name"`
	Country          string `json:"country"`
	FoundingYear     int    `json:"foundingYear"`
}

type CarCategories struct {
	ID       int    `json:"id"`
	Category string `json:"name"`
}

func FetchCarModels() ([]CarModel, error) {
	var carModels []CarModel
	resp, err := http.Get("http://localhost:3000/api/models")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(body, &carModels)
	if err != nil {
		return nil, err
	}

	return carModels, nil
}

func FetchCarManufacturers() ([]CarManufacturer, error) {
	var carManufacturers []CarManufacturer
	resp, err := http.Get("http://localhost:3000/api/manufacturers")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(body, &carManufacturers)
	if err != nil {
		return nil, err
	}

	return carManufacturers, nil
}

func FetchCarCategories() ([]CarCategories, error) {
	var carCategories []CarCategories
	resp, err := http.Get("http://localhost:3000/api/categories")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(body, &carCategories)
	if err != nil {
		return nil, err
	}

	return carCategories, nil
}
