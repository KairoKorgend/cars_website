let initialCarItems = document.querySelectorAll(".car-item");
let carItems = document.querySelectorAll(".car-item");
const categoryButtons = document.querySelectorAll(".category-button");
const modal = document.getElementById("carModal");
const span = document.getElementsByClassName("close")[0];
const compareButton = document.getElementById("compare-btn");
const comparisonModal = document.getElementById("comparison-modal");
const resetButton = document.getElementById("reset-filters");
const comparisonClose = document.querySelector(".comparison-modal .close");
const checkBoxes = document.querySelectorAll(".car-checkbox");
const selectedCars = document.querySelectorAll(".car-checkbox:checked");
const searchInput = document.getElementById("search-input");

// Event listener for "Compare" button
compareButton.addEventListener("click", function () {
  collectAndDisplayCarDetails();
});

span.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when clicking elsewhere
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
  if (event.target === comparisonModal) {
    comparisonModal.style.display = "none";
  }
};

// Search functionality
searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  carItems = document.querySelectorAll(".car-item");
  carItems.forEach((item) => {
    const modelName = item.dataset.name.toLowerCase();
    item.style.display = modelName.includes(searchText) ? "" : "none";
  });
});

// Category filter functionality
categoryButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const category = this.dataset.category;
    filterByCategory(category);
  });
});

// Filter form submission
document
  .getElementById("filter-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    applyFilters();
  });

// Call resetCars to store the initial order on page load
resetCars();

// Resets the filters
resetButton.addEventListener("click", function () {
  resetFilters();
});

function populateModal(item) {
  const modalCarName = document.getElementById("modalCarName");
  const modalCarYear = document.getElementById("modalCarYear");
  const modalCarID = document.getElementById("modalCarID");
  const modalCarCountry = document.getElementById("modalCarCountry");
  const modalCarDrivetrain = document.getElementById("modalCarDrivetrain");
  const modalCarEngine = document.getElementById("modalCarEngine");
  const modalCarHorsepower = document.getElementById("modalCarHorsepower");
  const modalCarFoundingYear = document.getElementById("modalCarFoundingYear");
  const modalCarTransmission = document.getElementById("modalCarTransmission");
  const modalCarManufacturerName = document.getElementById(
    "modalCarManufacturerName"
  );

  modalCarName.textContent = item.dataset.name;
  modalCarYear.textContent = item.dataset.year;
  modalCarEngine.textContent = item.dataset.engine;
  modalCarHorsepower.textContent = item.dataset.horsepower;
  modalCarTransmission.textContent = item.dataset.transmission;
  modalCarManufacturerName.textContent = item.dataset.manufacturer;
  modalCarID.textContent = "ID #" + item.dataset.id;
  modalCarDrivetrain.textContent = item.dataset.drivetrain;
  modalCarCountry.textContent = item.dataset.country;
  modalCarFoundingYear.textContent = item.dataset.founding;
}

function applyFilters() {
  const yearSortOrder = document.getElementById("year").value;
  const makeFilterValue = document.getElementById("make").value.toLowerCase();
  const transmissionFilterValue = document.getElementById("transmission").value;
  const drivetrainFilterValue = document.getElementById("drivetrain").value;
  const horsepowerSortOrder = document.getElementById("horsepower").value;
  let carItems = Array.from(initialCarItems);

  // Filter by manufacturer
  if (makeFilterValue) {
    carItems = carItems.filter(
      (item) => item.dataset.name.toLowerCase() === makeFilterValue
    );
  }

  // Filter by transmission
  if (transmissionFilterValue) {
    carItems = carItems.filter(
      (item) => item.dataset.transmission === transmissionFilterValue
    );
  }

  // New filter by drivetrain
  if (drivetrainFilterValue) {
    carItems = carItems.filter(
      (item) => item.dataset.drivetrain === drivetrainFilterValue
    );
  }

  // Sorting by year
  if (yearSortOrder === "newest" || yearSortOrder === "oldest") {
    sortCars(carItems, yearSortOrder);
  } else {
    updateCarDisplay(carItems);
  }

  // Sorting by horsepower
  if (horsepowerSortOrder === "highest" || horsepowerSortOrder === "lowest") {
    carItems.sort((a, b) => {
      const hpA = parseInt(a.dataset.horsepower, 10);
      const hpB = parseInt(b.dataset.horsepower, 10);
      return horsepowerSortOrder === "highest" ? hpB - hpA : hpA - hpB;
    });
  }

  updateCarDisplay(carItems);
}

// Resets dropdown selections to their default value
function resetFilters() {
  document.getElementById("make").value = "";
  document.getElementById("year").value = "";
  document.getElementById("transmission").value = "";
  document.getElementById("drivetrain").value = "";
  document.getElementById("horsepower").value = "";
  applyFilters(); // Reapply filters

  // Optionally reset the search input and display all cars
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
}

function filterByCategory(category) {
  carItems = document.querySelectorAll(".car-item");
  carItems.forEach((item) => {
    // Check if 'category' is 'all'
    if (category === "all") {
      item.style.display = ""; // Show all items
    } else {
      const itemCategory = item.dataset.category.toLowerCase();
      item.style.display = itemCategory === category ? "" : "none";
    }
  });
}

function sortCars(carItems, order) {
  carItems.sort(function (a, b) {
    var yearA = parseInt(a.dataset.year, 10);
    var yearB = parseInt(b.dataset.year, 10);
    return order === "newest" ? yearB - yearA : yearA - yearB;
  });
  updateCarDisplay(carItems);
}

function resetCars() {
  updateCarDisplay(initialCarItems);
}

function updateCarDisplay(carItems) {
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";

  carItems.forEach((item) => {
    const clone = item.cloneNode(true);
    container.appendChild(clone);

    clone.addEventListener("click", function (event) {
      // Check if the clicked element is not a checkbox
      if (!event.target.classList.contains("car-checkbox")) {
        populateModal(clone);
        document.getElementById("carModal").style.display = "block";
      }
    });
  });
}

function collectAndDisplayCarDetails() {
  const selectedCars = document.querySelectorAll(".car-checkbox:checked");
  if (selectedCars.length !== 2) {
    alert("Please select exactly 2 cars to compare.");
    return;
  }

  let comparisonContent = '<div class="comparison-container">';

  selectedCars.forEach((car) => {
    const carDetails = car.closest(".car-item").dataset;
    comparisonContent += `
        <div class="comparison-details">
          <h3>${carDetails.name}</h3>
          <p>Year: ${carDetails.year}</p>
          <p>Engine: ${carDetails.engine}</p>
          <p>Horsepower: ${carDetails.horsepower}</p>
          <p>Transmission: ${carDetails.transmission}</p>
          <p>Drivetrain: ${carDetails.drivetrain}</p>
          <p>Manufacturer's name: ${carDetails.manufacturer}</p>
          <p>Country: ${carDetails.country}</p>
          <p>Founding Year: ${carDetails.founding}</p>
        </div>
      `;
  });

  comparisonContent += "</div>";
  const comparisonModal = document.getElementById("comparison-modal");
  comparisonModal.innerHTML = comparisonContent;
  comparisonModal.style.display = "block";
}
