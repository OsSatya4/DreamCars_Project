/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

describe('cars.js Márka/Szűrő Integrációs Teszt', () => {
  const mockBrands = ["BMW", "Ford", "Nissan"];
  const mockCarsBMW = [
    { id: 1, marka: "BMW", nev: "M4", uzemanyag: "Benzin", arFormat: "95 000 Ft/nap" },
    { id: 4, marka: "BMW", nev: "i8", uzemanyag: "Elektromos", arFormat: "110 000 Ft/nap" }
  ];

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="filter-panel" style="display:none;">
        <select id="fuel-filter"><option value="">Összes</option><option value="1">Benzin</option></select>
        <input type="number" id="year-filter">
        <input type="number" id="price-filter">
      </div>
      <select id="brand-select"><option value="" selected disabled>Válassz egy márkát...</option></select>
      <div id="car-details"></div>
    `;
    
    jest.useFakeTimers();
    fetch.mockClear();
    
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockBrands),
    });
    
    require('../js/cars.js'); // Futtatjuk a cars.js-t
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('1. Inicializáláskor megtörténik a márkák lekérése és betöltése a DOM-ba', async () => {
    await Promise.resolve(); 
    
    expect(fetch).toHaveBeenCalledWith('../php/get_brands.php');
    
    const brandSelect = document.getElementById('brand-select');
    expect(brandSelect.options.length).toBe(1 + mockBrands.length); 
    expect(brandSelect.options[1].textContent).toBe('BMW');
  });

  test('2. Márka kiválasztásakor a filter panel megjelenik és autók töltődnek be', async () => {
    
    await Promise.resolve(); 
    
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCarsBMW),
    });

    const brandSelect = document.getElementById('brand-select');
    const filterPanel = document.getElementById('filter-panel');
    const carDetails = document.getElementById('car-details');

 
    brandSelect.value = 'BMW';
    brandSelect.dispatchEvent(new Event('change'));
    
    expect(filterPanel.style.display).toBe('block');
    expect(fetch).toHaveBeenCalledWith('../php/get_cars.php?marka=BMW');
   
    await Promise.resolve(); 
    
    await jest.runAllTimersAsync();

    expect(carDetails.children.length).toBe(mockCarsBMW.length); 
    
    expect(carDetails.innerHTML).toContain('M4');
    expect(carDetails.innerHTML).toContain('i8');
});
  
  test('3. Üzemanyag szűrő alkalmazása frissíti a lekérdezési URL-t', async () => {
    
    await Promise.resolve(); 
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCarsBMW),
    });
    const brandSelect = document.getElementById('brand-select');
    brandSelect.value = 'BMW';
    brandSelect.dispatchEvent(new Event('change'));
    await Promise.resolve(); 
    
    
    fetch.mockClear(); 

    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCarsBMW[0]]),
    });

    const fuelFilter = document.getElementById('fuel-filter');
    
   
    fuelFilter.value = '1';
    fuelFilter.dispatchEvent(new Event('change')); 
    
    await Promise.resolve(); 

    expect(fetch).toHaveBeenCalledWith('../php/get_cars.php?marka=BMW&fuel=1');
  });
});