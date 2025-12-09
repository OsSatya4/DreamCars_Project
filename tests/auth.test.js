/**
 * auth.test.js - Egységtesztek az auth.js modulhoz
 * 
 * Tesztelési keretrendszer: Jest
 * Telepítés: npm install --save-dev jest @testing-library/dom
 */

// Mock fetch és DOM elemek
global.fetch = jest.fn();
global.alert = jest.fn();
global.confirm = jest.fn();

describe('DreamCarsAuth - Autentikációs Modul Tesztek', () => {
  
  beforeEach(() => {
    // Minden teszt előtt tisztítjuk a DOM-ot és a mock-okat
    document.body.innerHTML = `
      <nav>
        <ul id="nav-links">
          <li><a href="index.html">Kezdőlap</a></li>
          <li><a href="cars.html">Autók</a></li>
          <li><a href="booking.html">Foglalás</a></li>
          <li><a href="login.html">Bejelentkezés</a></li>
          <li><a href="register.html">Regisztráció</a></li>
        </ul>
      </nav>
    `;
    
    // Reset window.DreamCarsAuth
    window.DreamCarsAuth = {
      user: null,
      isLoggedIn: false,
      initialized: false
    };
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset location
    delete window.location;
    window.location = { 
      href: '', 
      pathname: '/html/index.html',
      search: ''
    };
  });

  // ============================================
  // 1. INICIALIZÁLÁS TESZTEK
  // ============================================
  
  describe('Modul Inicializálás', () => {
    test('DreamCarsAuth objektum létezik', () => {
      expect(window.DreamCarsAuth).toBeDefined();
    });

    test('Kezdeti állapot helyes', () => {
      expect(window.DreamCarsAuth.user).toBeNull();
      expect(window.DreamCarsAuth.isLoggedIn).toBe(false);
      expect(window.DreamCarsAuth.initialized).toBe(false);
    });

    test('Publikus metódusok elérhetők', () => {
      // Betöltjük az auth.js-t (szimulálva)
      require('../js/auth.js'); // Ha node környezetben futtatod
      
      expect(typeof window.DreamCarsAuth.check).toBe('function');
      expect(typeof window.DreamCarsAuth.logout).toBe('function');
      expect(typeof window.DreamCarsAuth.requireLogin).toBe('function');
      expect(typeof window.DreamCarsAuth.redirectIfLoggedIn).toBe('function');
    });
  });

  // ============================================
  // 2. SESSION ELLENŐRZÉS TESZTEK
  // ============================================
  
  describe('checkSession() - Session Ellenőrzés', () => {
    test('Sikeres session ellenőrzés bejelentkezett felhasználóval', async () => {
      const mockUserData = {
        loggedIn: true,
        user: {
          id: 1,
          fullname: 'Teszt Felhasználó',
          email: 'teszt@example.com',
          isAdmin: 0
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      const result = await window.DreamCarsAuth.check();

      expect(fetch).toHaveBeenCalledWith('../php/check_session.php');
      expect(window.DreamCarsAuth.isLoggedIn).toBe(true);
      expect(window.DreamCarsAuth.user).toEqual(mockUserData.user);
      expect(window.DreamCarsAuth.initialized).toBe(true);
      expect(result).toEqual(mockUserData);
    });

    test('Session ellenőrzés nem bejelentkezett felhasználóval', async () => {
      const mockData = {
        loggedIn: false,
        user: null
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockData
      });

      const result = await window.DreamCarsAuth.check();

      expect(window.DreamCarsAuth.isLoggedIn).toBe(false);
      expect(window.DreamCarsAuth.user).toBeNull();
      expect(result).toEqual(mockData);
    });

    test('Session ellenőrzés admin felhasználóval', async () => {
      const mockAdminData = {
        loggedIn: true,
        user: {
          id: 1,
          fullname: 'Admin User',
          email: 'admin@example.com',
          isAdmin: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockAdminData
      });

      await window.DreamCarsAuth.check();

      expect(window.DreamCarsAuth.user.isAdmin).toBe(1);
    });

    test('Force refresh paraméter működik', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ loggedIn: false, user: null })
      });

      await window.DreamCarsAuth.check(true);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('?t=')
      );
    });

    test('Fetch hiba kezelése', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await window.DreamCarsAuth.check();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toEqual({ loggedIn: false, user: null });
      
      consoleErrorSpy.mockRestore();
    });
  });

  // ============================================
  // 3. NAVIGÁCIÓ FRISSÍTÉS TESZTEK
  // ============================================
  
  describe('updateNavigation() - Navigáció Frissítés', () => {
    test('Bejelentkezés után a navigáció frissül', async () => {
      const mockUserData = {
        loggedIn: true,
        user: {
          fullname: 'Teszt User',
          isAdmin: 0
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      await window.DreamCarsAuth.check();

      const loginLink = document.querySelector('a[href*="login.html"]');
      const registerLink = document.querySelector('a[href*="register.html"]');

      expect(loginLink.textContent).toContain('Teszt User');
      expect(loginLink.href).toContain('user.html');
      expect(registerLink.textContent).toBe('Kijelentkezés');
    });

    test('Admin felhasználónál megjelenik az Admin Panel link', async () => {
      const mockAdminData = {
        loggedIn: true,
        user: {
          fullname: 'Admin User',
          isAdmin: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockAdminData
      });

      await window.DreamCarsAuth.check();

      const loginLink = document.querySelector('a[href*="login.html"]');
      const adminLink = document.querySelector('a[href*="admin.html"]');

      expect(loginLink.textContent).toContain('(Admin)');
      expect(adminLink).not.toBeNull();
      expect(adminLink.textContent).toBe('Admin Panel');
    });

    test('Kijelentkezés után a navigáció visszaáll', async () => {
      // Először bejelentkezés
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          loggedIn: true,
          user: { fullname: 'Test', isAdmin: 0 }
        })
      });
      await window.DreamCarsAuth.check();

      // Majd kijelentkezés
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          loggedIn: false,
          user: null
        })
      });
      await window.DreamCarsAuth.check();

      const loginLink = document.querySelector('a[href*="login.html"]');
      const registerLink = document.querySelector('a[href*="register.html"]');

      expect(loginLink.textContent).toBe('Bejelentkezés');
      expect(loginLink.href).toContain('login.html');
      expect(registerLink.textContent).toBe('Regisztráció');
    });

    test('Admin link csak egyszer adódik hozzá', async () => {
      const mockAdminData = {
        loggedIn: true,
        user: { fullname: 'Admin', isAdmin: 1 }
      };

      // Kétszer hívjuk meg
      global.fetch.mockResolvedValue({
        json: async () => mockAdminData
      });

      await window.DreamCarsAuth.check();
      await window.DreamCarsAuth.check();

      const adminLinks = document.querySelectorAll('a[href*="admin.html"]');
      expect(adminLinks.length).toBe(1);
    });
  });

  // ============================================
  // 4. KIJELENTKEZÉS TESZTEK
  // ============================================
  
  describe('logout() - Kijelentkezés', () => {
    test('Kijelentkezés megerősítés után megtörténik', async () => {
      global.confirm.mockReturnValueOnce(true);
      global.fetch.mockResolvedValueOnce({
        text: async () => 'Success'
      });

      await window.DreamCarsAuth.logout();

      expect(confirm).toHaveBeenCalledWith('Biztosan ki szeretnél jelentkezni?');
      expect(fetch).toHaveBeenCalledWith('../php/logout.php');
      expect(window.location.href).toBe('index.html');
    });

    test('Kijelentkezés visszavonása működik', async () => {
      global.confirm.mockReturnValueOnce(false);

      await window.DreamCarsAuth.logout();

      expect(confirm).toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });

    test('Kijelentkezési hiba kezelése', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      global.confirm.mockReturnValueOnce(true);
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await window.DreamCarsAuth.logout();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(alert).toHaveBeenCalledWith('Hiba történt a kijelentkezés során!');
      
      consoleErrorSpy.mockRestore();
    });
  });

  // ============================================
  // 5. VÉDETT OLDAL TESZTEK
  // ============================================
  
  describe('requireLogin() - Bejelentkezés Kikényszerítés', () => {
    test('Nem bejelentkezett felhasználó átirányítása', () => {
      window.DreamCarsAuth.isLoggedIn = false;

      window.DreamCarsAuth.requireLogin();

      expect(alert).toHaveBeenCalledWith('Ehhez az oldalhoz be kell jelentkezned!');
      expect(window.location.href).toContain('login.html');
      expect(window.location.href).toContain('redirect=');
    });

    test('Bejelentkezett felhasználó maradhat az oldalon', () => {
      window.DreamCarsAuth.isLoggedIn = true;

      window.DreamCarsAuth.requireLogin();

      expect(alert).not.toHaveBeenCalled();
      expect(window.location.href).toBe('');
    });
  });

  // ============================================
  // 6. LOGIN/REGISTER OLDAL VÉDELEM TESZTEK
  // ============================================
  
  describe('redirectIfLoggedIn() - Login Oldal Védelem', () => {
    test('Bejelentkezett felhasználó átirányítása', () => {
      window.DreamCarsAuth.isLoggedIn = true;

      window.DreamCarsAuth.redirectIfLoggedIn();

      expect(window.location.href).toBe('index.html');
    });

    test('Nem bejelentkezett felhasználó maradhat', () => {
      window.DreamCarsAuth.isLoggedIn = false;

      window.DreamCarsAuth.redirectIfLoggedIn();

      expect(window.location.href).toBe('');
    });
  });

  // ============================================
  // 7. URL PARAMÉTER KEZELÉS TESZTEK
  // ============================================
  
  describe('Login Success URL Paraméter', () => {
    test('Login success paraméter kezelése', (done) => {
      // Mock URL paraméter
      delete window.location;
      window.location = {
        href: '',
        pathname: '/html/index.html',
        search: '?login=success'
      };

      // Mock URLSearchParams
      global.URLSearchParams = jest.fn().mockImplementation(() => ({
        get: jest.fn((key) => key === 'login' ? 'success' : null)
      }));

      const mockUserData = {
        loggedIn: true,
        user: { fullname: 'Test User' }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      // Szimuláljuk a DOMContentLoaded eseményt
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // Várunk a setTimeout-ra
      setTimeout(() => {
        expect(alert).toHaveBeenCalledWith(
          expect.stringContaining('Sikeres bejelentkezés!')
        );
        done();
      }, 400);
    });
  });

  // ============================================
  // 8. INTEGRÁCIÓ TESZTEK
  // ============================================
  
  describe('Integrációs Tesztek', () => {
    test('Teljes bejelentkezési folyamat', async () => {
      // 1. Kezdetben nincs bejelentkezve
      expect(window.DreamCarsAuth.isLoggedIn).toBe(false);

      // 2. Check session - bejelentkezve
      const mockUserData = {
        loggedIn: true,
        user: {
          id: 1,
          fullname: 'Teszt User',
          email: 'test@example.com',
          isAdmin: 0
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      await window.DreamCarsAuth.check();

      // 3. Ellenőrizzük az állapotot
      expect(window.DreamCarsAuth.isLoggedIn).toBe(true);
      expect(window.DreamCarsAuth.user).toEqual(mockUserData.user);
      expect(window.DreamCarsAuth.initialized).toBe(true);

      // 4. Ellenőrizzük a navigációt
      const loginLink = document.querySelector('a[href*="login.html"]');
      expect(loginLink.textContent).toContain('Teszt User');

      // 5. Kijelentkezés
      global.confirm.mockReturnValueOnce(true);
      global.fetch.mockResolvedValueOnce({
        text: async () => 'Success'
      });

      await window.DreamCarsAuth.logout();

      expect(window.location.href).toBe('index.html');
    });

    test('Admin felhasználó teljes folyamata', async () => {
      const mockAdminData = {
        loggedIn: true,
        user: {
          id: 1,
          fullname: 'Admin User',
          email: 'admin@example.com',
          isAdmin: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockAdminData
      });

      await window.DreamCarsAuth.check();

      // Ellenőrizzük az admin linket
      const adminLink = document.querySelector('a[href*="admin.html"]');
      expect(adminLink).not.toBeNull();

      // Ellenőrizzük az admin jelzést
      const loginLink = document.querySelector('a[href*="login.html"]');
      expect(loginLink.textContent).toContain('(Admin)');
      expect(loginLink.style.color).toBe('#ffd700');
    });
  });

  // ============================================
  // 9. EDGE CASE TESZTEK
  // ============================================
  
  describe('Edge Case Tesztek', () => {
    test('Hiányzó nav-links elem kezelése', async () => {
      document.body.innerHTML = '<div></div>'; // Nincs nav-links

      const mockUserData = {
        loggedIn: true,
        user: { fullname: 'Test', isAdmin: 0 }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      // Ne dobjon hibát
      await expect(window.DreamCarsAuth.check()).resolves.toBeDefined();
    });

    test('Hiányzó login link kezelése', async () => {
      document.body.innerHTML = `
        <nav>
          <ul id="nav-links">
            <li><a href="register.html">Regisztráció</a></li>
          </ul>
        </nav>
      `;

      const mockUserData = {
        loggedIn: true,
        user: { fullname: 'Test', isAdmin: 0 }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      await expect(window.DreamCarsAuth.check()).resolves.toBeDefined();
    });

    test('Üres felhasználónév kezelése', async () => {
      const mockUserData = {
        loggedIn: true,
        user: {
          fullname: '',
          isAdmin: 0
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      await window.DreamCarsAuth.check();

      const loginLink = document.querySelector('a[href*="login.html"]');
      expect(loginLink.textContent).toBe('👤 ');
    });

    test('isAdmin string értékének kezelése', async () => {
      const mockUserData = {
        loggedIn: true,
        user: {
          fullname: 'User',
          isAdmin: '1' // String helyett number
        }
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockUserData
      });

      await window.DreamCarsAuth.check();

      const adminLink = document.querySelector('a[href*="admin.html"]');
      expect(adminLink).not.toBeNull(); // == 1 működik
    });
  });

  // ============================================
  // 10. PERFORMANCE TESZTEK
  // ============================================
  
  describe('Performance Tesztek', () => {
    test('checkSession gyors futás (< 100ms mock-kal)', async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ loggedIn: false, user: null })
      });

      const start = Date.now();
      await window.DreamCarsAuth.check();
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });

    test('Többszöri hívás nem okoz problémát', async () => {
      global.fetch.mockResolvedValue({
        json: async () => ({ loggedIn: false, user: null })
      });

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(window.DreamCarsAuth.check());
      }

      await expect(Promise.all(promises)).resolves.toBeDefined();
    });
  });
});

// ============================================
// SEGÉD FÜGGVÉNYEK A TESZTELÉSHEZ
// ============================================

/**
 * Mock-olja a fetch válaszokat egyszerűen
 */
function mockFetchResponse(data) {
  global.fetch.mockResolvedValueOnce({
    json: async () => data
  });
}

/**
 * Létrehoz egy teljes DOM környezetet
 */
function setupDOM() {
  document.body.innerHTML = `
    <nav>
      <ul id="nav-links">
        <li><a href="index.html">Kezdőlap</a></li>
        <li><a href="cars.html">Autók</a></li>
        <li><a href="booking.html">Foglalás</a></li>
        <li><a href="login.html">Bejelentkezés</a></li>
        <li><a href="register.html">Regisztráció</a></li>
      </ul>
    </nav>
  `;
}

/**
 * Várakozás async műveletekre
 */
function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
