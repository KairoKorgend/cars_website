package main

import (
	cars "cars-viewer/data"
	"html/template"
	"log"
	"net/http"
	"sync"
)

func homePageHandler(w http.ResponseWriter, r *http.Request) {
	var wg sync.WaitGroup
	var errOccurred bool // Flag to indicate an error has occurred

	modelsChan := make(chan []cars.CarModel, 1)
	manufacturersChan := make(chan []cars.CarManufacturer, 1)
	categoriesChan := make(chan []cars.CarCategories, 1)

	wg.Add(3)
	// Fetch car models
	go func() {
		defer wg.Done()
		data, err := cars.FetchCarModels()
		if err != nil {
			log.Printf("Failed to fetch car models: %v", err)
			errOccurred = true
			return
		}
		modelsChan <- data
	}()

	// Fetch car manufacturers
	go func() {
		defer wg.Done()
		data, err := cars.FetchCarManufacturers()
		if err != nil {
			log.Printf("Failed to fetch car manufacturers: %v", err)
			errOccurred = true
			return
		}
		manufacturersChan <- data
	}()

	// Fetch car categories
	go func() {
		defer wg.Done()
		data, err := cars.FetchCarCategories()
		if err != nil {
			log.Printf("Failed to fetch car categories: %v", err)
			errOccurred = true
			return
		}
		categoriesChan <- data
	}()

	wg.Wait()

	// Close the channels after all goroutines have finished
	close(modelsChan)
	close(manufacturersChan)
	close(categoriesChan)

	// If an error occurred, return early without attempting to render the template
	if errOccurred {
		http.Error(w, "Failed to fetch data", http.StatusInternalServerError)
		return
	}

	carModels := <-modelsChan
	carManufacturers := <-manufacturersChan
	carCategories := <-categoriesChan

	// assign manufacturers to carModels struct
	manufacturerMap := make(map[int]cars.CarManufacturer)
	for _, manufacturer := range carManufacturers {
		manufacturerMap[manufacturer.ID] = manufacturer
	}

	for i, model := range carModels {
		if manu, ok := manufacturerMap[model.ManufacturerID]; ok {
			carModels[i].Manufacturer = manu
		}
	}

	// assign categories to carModels struct
	categoryMap := make(map[int]cars.CarCategories)
	for _, category := range carCategories {
		categoryMap[category.ID] = category
	}

	for i, model := range carModels {
		if category, ok := categoryMap[model.CategoryID]; ok {
			carModels[i].Categories = category
		}
	}

	tmpl, err := template.ParseFiles("web/templates/index.html")
	if err != nil {
		http.Error(w, "Unable to parse template", http.StatusInternalServerError)
		return
	}

	// Pass carModels directly since it now contains data of manufacturers and categories
	if err := tmpl.Execute(w, carModels); err != nil {
		log.Printf("Error executing template: %v", err)
		http.Error(w, "Error rendering page", http.StatusInternalServerError)
	}
}

func main() {
	// Serve static files from the `web/static` directory
	fsStatic := http.FileServer(http.Dir("web/static"))
	http.Handle("/static/", http.StripPrefix("/static/", fsStatic))

	// Serve images from the `api/img` directory
	fsImages := http.FileServer(http.Dir("api/img"))
	http.Handle("/api/img/", http.StripPrefix("/api/img/", fsImages))

	http.HandleFunc("/", homePageHandler)
	log.Println("Server started on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
