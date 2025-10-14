//console.log('DreamCars - cars.js betöltve');

// Várjuk meg a DOM betöltődését
document.addEventListener('DOMContentLoaded', function() {
  //console.log('DOM betöltve, inicializálás...');

  const elements = {
    brandSelect: document.getElementById('brand-select'),
    filterPanel: document.getElementById('filter-panel'),
    carDetails: document.getElementById('car-details'),
    bookBtn: document.getElementById('book-btn'),
    fuelFilter: document.getElementById('fuel-filter'),
    yearFilter: document.getElementById('year-filter'),
    priceFilter: document.getElementById('price-filter')
  };

  //console.log('Elemek ellenőrzése:');
  Object.entries(elements).forEach(function([key, value]) {
    //console.log('  -', key, ':', value ? 'Jo' : 'Nem jo');
  });

  const missingElements = Object.entries(elements)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingElements.length > 0) {
    console.error('Hiányzó elemek:', missingElements);
    alert('HIBA: Hiányzó HTML elemek: ' + missingElements.join(', '));
    return;
  }

  const state = {
    currentBrand: null,
    cars: [],
    selectedCarId: null
  };

  //console.log('Márkák betöltése indul...');
  initBrands();

  elements.brandSelect.addEventListener('change', handleBrandChange);
  elements.fuelFilter.addEventListener('change', applyFilters);
  elements.yearFilter.addEventListener('change', applyFilters);
  elements.priceFilter.addEventListener('input', debounce(applyFilters, 500));
  elements.bookBtn.addEventListener('click', handleBooking);

  //console.log('Event listenerek hozzáadva');

  function initBrands() {
    const url = '../php/get_brands.php';
    //console.log('Márkák lekérése:', url);
    
    fetch(url)
      .then(function(response) {
        //console.log('response:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error('HTTP hiba: ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        //console.log('kapott adat:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('nem tömb: ' + typeof data);
        }

        if (data.length === 0) {
          console.warn('Nincsenek márkák az adatbázisban');
          elements.brandSelect.innerHTML += '<option disabled>Nincsenek elérhető márkák</option>';
          return;
        }

        data.forEach(function(brand) {
          const option = document.createElement('option');
          option.value = brand;
          option.textContent = brand;
          elements.brandSelect.appendChild(option);
          //console.log('Márka hozzáadva:', brand);
        });

        //console.log('Minden elem inicializálva');
        //console.log('Márkák betöltve:', data.length + ' db');
      })
      .catch(function(error) {
        //console.error('HIBA a márkák betöltésekor:', error);
        alert('Hiba: Nem sikerült betölteni a márkákat!\n\n' + error.message + '\n\nEllenőrizd:\n1. A PHP fájl elérhetőségét\n2. Az adatbázis kapcsolatot\n3. A konzolt további hibákért');
      });
  }

  // Márka választás kezelése
  function handleBrandChange() {
    const brand = elements.brandSelect.value;
    //console.log('Márka kiválasztva:', brand);
    
    if (!brand) {
      //console.log('Üres márka, panel elrejtése');
      elements.filterPanel.style.display = 'none';
      elements.carDetails.innerHTML = '<div class="empty-message" style="grid-column: 1 / -1;"><p>🚗 Válassz egy márkát a keresés megkezdéséhez!</p></div>';
      elements.bookBtn.style.display = 'none';
      return;
    }

    state.currentBrand = brand;
    
    elements.filterPanel.style.display = 'block';
    //console.log('Szűrők megjelenítve');
    
    // Szűrők visszaállítása
    elements.fuelFilter.value = '';
    elements.yearFilter.value = '';
    elements.priceFilter.value = '';
    //console.log('Szűrők alaphelyzetbe állítva');
    
    loadCars(brand);
  }

  function loadCars(brand) {
    //console.log('Autók betöltése:', brand);
    
    showLoading(elements.carDetails, 'Autók betöltése...');
    elements.bookBtn.style.display = 'none';

    let url = '../php/get_cars.php?marka=' + encodeURIComponent(brand);
    
    const fuel = elements.fuelFilter.value;
    const year = elements.yearFilter.value;
    const maxPrice = elements.priceFilter.value;
    
    if (fuel) {
      url += '&fuel=' + fuel;
      //console.log('Üzemanyag szűrő:', fuel);
    }
    if (year) {
      url += '&year=' + year;
      //console.log('Évjárat szűrő:', year);
    }
    if (maxPrice) {
      url += '&maxPrice=' + maxPrice;
      //console.log('Ár szűrő:', maxPrice);
    }

    //console.log('Teljes URL:', url);

    fetch(url)
      .then(function(response) {
        //console.log('response: ', response.status, response.statusText);
        if (!response.ok) {
          throw new Error('HTTP hiba: ' + response.status);
        }
        return response.json();
      })
      .then(function(cars) {
        //console.log('Kapott autók:', cars);
        //console.log('Autók száma:', Array.isArray(cars) ? cars.length : 'nem tömb');
        
        if (!Array.isArray(cars)) {
          throw new Error('A válasz nem tömb');
        }

        state.cars = cars;
        displayCars(cars);
      })
      .catch(function(error) {
        //console.error('HIBA az autók betöltésekor:', error);
        showError('Nem sikerült betölteni az autókat: ' + error.message);
      });
  }

  // Szűrők alkalmazása
  function applyFilters() {
    //console.log('Szűrők alkalmazása');
    if (!state.currentBrand) {
      //console.warn('Nincs kiválasztva márka');
      return;
    }
    loadCars(state.currentBrand);
  }

  // Autók megjelenítése
  function displayCars(cars) {
    //console.log('Autók megjelenítése:', cars.length + ' db');
    
    if (!cars || cars.length === 0) {
      elements.carDetails.innerHTML = `
        <div class="empty-message">
          <p>Nincs találat a megadott szűrőkkel.</p>
          <p style="font-size: 0.9rem; margin-top: 10px;">Próbálj más szűrőket használni!</p>
        </div>
      `;
      elements.bookBtn.style.display = 'none';
      console.log('Nincs megjeleníthető autó');
      return;
    }

    let html = '';
    
    cars.forEach(function(car, index) {
      //console.log('Autó #' + (index + 1) + ':', car.nev);
      html += `
        <div class="car-card" data-car-id="${car.id}">
          <img src="${car.img}" alt="${car.nev}" onerror="this.onerror=null; this.src='../assets/placeholder.jpg'; console.error('Kép betöltési hiba: ${car.img}');">
          <h3>${car.nev}</h3>
          <p class="car-desc">${car.desc}</p>
          <div class="car-details-list">
            <ul>
              <li><strong>Évjárat:</strong> ${car.evjarat}</li>
              <li><strong>Üzemanyag:</strong> ${car.uzemanyag}</li>
              <li><strong>Ár:</strong> ${car.arFormat}</li>
            </ul>
          </div>
        </div>
      `;
    });

    elements.carDetails.innerHTML = html;
    elements.bookBtn.style.display = 'block';
    
    //console.log('Autók megjelenítve sikesen');
  }

  // Foglalás kezelése
  function handleBooking() {
    //console.log('Foglalás gomb megnyomva');
    
    if (state.cars.length === 0) {
      alert('Nincs kiválasztható autó!');
      return;
    }

    const carIds = state.cars.map(function(car) { return car.id; }).join(',');
    window.location.href = 'booking.html?brand=' + encodeURIComponent(state.currentBrand) + '&cars=' + carIds;
  }

  // Segédfüggvények

  function showLoading(element, message) {
    //console.log('Loading:', message);
    element.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999;">
        <p style="font-size: 1.2rem;">${message}</p>
      </div>
    `;
  }

  function showError(message) {
    //console.error('Hiba megjelenítése:', message);
    elements.carDetails.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e50914;">
        <p style="font-size: 1.2rem;">${message}</p>
        <p style="font-size: 0.9rem; margin-top: 10px; color: #999;">Ellenőrizd a konzolt további információkért!</p>
      </div>
    `;
  }

  // Debounce függvény
  function debounce(func, delay) {
    let timeoutId;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function() {
        func.apply(context, args);
      }, delay);
    };
  }

  //console.log('Inicializálás befejezve, várakozás...');
});