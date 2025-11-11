# DreamCars Project - Fejlesztői Dokumentáció

## Tartalomjegyzék

1. [Projekt Áttekintés](#projekt-áttekintés)
2. [Technológiai Stack](#technológiai-stack)
3. [Projekt Struktúra](#projekt-struktúra)
4. [Adatbázis Séma](#adatbázis-séma)
5. [Backend API Dokumentáció](#backend-api-dokumentáció)
6. [Frontend Komponensek](#frontend-komponensek)
7. [Autentikáció és Session Kezelés](#autentikáció-és-session-kezelés)
8. [Telepítési Útmutató](#telepítési-útmutató)
9. [Biztonsági Szempontok](#biztonsági-szempontok)
10. [Hibaelhárítás](#hibaelhárítás)
11. [Továbbfejlesztési Lehetőségek](#továbbfejlesztési-lehetőségek)

---

## Projekt Áttekintés

### Leírás
A **DreamCars Project** egy modern, full-stack webes autókölcsönző alkalmazás, amely lehetővé teszi felhasználók számára prémium járművek böngészését, foglalását és online fizetését.

### Főbb Funkciók
- ✅ Felhasználói regisztráció és bejelentkezés
- ✅ Autók böngészése márka és szűrők alapján
- ✅ Interaktív foglalási naptár
- ✅ Online fizetési rendszer
- ✅ Felhasználói profil kezelés
- ✅ Admin panel autók hozzáadásához
- ✅ Statisztikák megjelenítése
- ✅ Foglalások kezelése

### Célközönség
- Végfelhasználók: Autót bérelni kívánó ügyfelek
- Admin felhasználók: Autópark kezelők

---

## Technológiai Stack

### Frontend
| Technológia | Verzió | Használat |
|-------------|--------|-----------|
| **HTML5** | - | Markup nyelv |
| **CSS3** | - | Stíluslapok |
| **JavaScript (ES6+)** | - | Kliens oldali logika |
| **Font Awesome** | 6.5.1 | Ikonok |

### Backend
| Technológia | Verzió | Használat |
|-------------|--------|-----------|
| **PHP** | 7.4+ | Szerver oldali programozás |
| **MySQL** | 5.7+ / MariaDB 10.4+ | Adatbázis |

### Szerver Környezet
- **Apache** / **Nginx**
- **XAMPP** / **WAMP** / **LAMP** (fejlesztéshez)

---

## Projekt Struktúra

```
dreamcars/
│
├── html/                          # HTML oldalak
│   ├── index.html                 # Főoldal
│   ├── cars.html                  # Autók böngészése
│   ├── booking.html               # Foglalási oldal
│   ├── payment.html               # Fizetési oldal
│   ├── login.html                 # Bejelentkezés
│   ├── register.html              # Regisztráció
│   ├── admin.html                 # Admin panel
│   └── user.html                  # Felhasználói profil
│
├── css/                           # Stíluslapok
│   ├── style.css                  # Fő stíluslap
│   ├── admin.css                  # Admin specifikus
│   ├── booking.css                # Foglalás specifikus
│   ├── payment.css                # Fizetés specifikus
│   └── user.css                   # Profil specifikus
│
├── js/                            # JavaScript fájlok
│   ├── main.js                    # Fő szkript
│   ├── auth.js                    # Autentikáció kezelés
│   ├── cars.js                    # Autók kezelése
│   ├── booking.js                 # Foglalás logika
│   ├── payment.js                 # Fizetés logika
│   ├── admin.js                   # Admin funkciók
│   ├── user.js                    # Profil funkciók
│   └── stats.js                   # Statisztikák
│
├── php/                           # PHP backend fájlok
│   ├── session_handler.php        # Session kezelés
│   ├── login.php                  # Bejelentkezés
│   ├── register.php               # Regisztráció
│   ├── logout.php                 # Kijelentkezés
│   ├── check_session.php          # Session ellenőrzés
│   ├── get_brands.php             # Márkák lekérése
│   ├── get_cars.php               # Autók lekérése
│   ├── get_car.php                # Egy autó adatai
│   ├── get_bookings.php           # Foglalások lekérése
│   ├── get_user_bookings.php      # Felhasználó foglalásai
│   ├── get_user_data.php          # Felhasználó adatai
│   ├── get_stats.php              # Statisztikák
│   ├── add_car.php                # Autó hozzáadása
│   ├── process_booking.php        # Foglalás feldolgozása
│   ├── update_profile.php         # Profil frissítés
│   └── change_password.php        # Jelszó módosítás
│
├── assets/                        # Média fájlok
│   ├── favicon.png                # Favicon
│   ├── listImg/                   # Autó képek
│   ├── ferrari488.jpg             # Kiemelt képek
│   ├── huracan.jpg
│   └── porshe.png
│
└── sql/                           # SQL fájlok
    └── dreamcars_full.sql         # Adatbázis séma + kezdő adatok
```

---

## Adatbázis Séma

### Adatbázis neve: `dreamcars`

### Táblák

#### 1. **users** - Felhasználók táblája

| Mező | Típus | Leírás | Megszorítások |
|------|-------|--------|---------------|
| `id` | INT(11) | Elsődleges kulcs | PRIMARY KEY, AUTO_INCREMENT |
| `fullname` | VARCHAR(100) | Teljes név | NOT NULL |
| `email` | VARCHAR(100) | Email cím | NOT NULL, UNIQUE |
| `phone` | VARCHAR(20) | Telefonszám | NULL |
| `password` | VARCHAR(255) | Hash-elt jelszó | NOT NULL |
| `hasBookings` | TINYINT(4) | Van-e foglalása | DEFAULT 0 |
| `isAdmin` | TINYINT(1) | Admin jogosultság | DEFAULT 0 |

**Indexek:**
- PRIMARY KEY: `id`
- UNIQUE KEY: `email`

**Megjegyzés:** A jelszavak `password_hash()` függvénnyel vannak titkosítva (bcrypt).

---

#### 2. **cars** - Járművek táblája

| Mező | Típus | Leírás | Megszorítások |
|------|-------|--------|---------------|
| `id` | INT(11) | Elsődleges kulcs | PRIMARY KEY, AUTO_INCREMENT |
| `marka` | VARCHAR(50) | Márka neve | NOT NULL |
| `nev` | VARCHAR(100) | Modell neve | NOT NULL |
| `img` | VARCHAR(255) | Kép fájlneve | NOT NULL |
| `desc` | TEXT | Leírás | NULL |
| `evjarat` | INT(11) | Évjárat | NOT NULL |
| `uzemanyag` | TINYINT(4) | Üzemanyag típus kód | NOT NULL, COMMENT '1=Benzin, 2=Dízel, 3=Elektromos' |
| `ar` | INT(11) | Napi ár (Ft) | NOT NULL |

**Indexek:**
- PRIMARY KEY: `id`
- INDEX: `idx_marka` (`marka`)
- INDEX: `idx_evjarat` (`evjarat`)
- INDEX: `idx_uzemanyag` (`uzemanyag`)

**Üzemanyag kódok:**
- `1` = Benzin
- `2` = Dízel
- `3` = Elektromos

---

#### 3. **bookings** - Foglalások táblája

| Mező | Típus | Leírás | Megszorítások |
|------|-------|--------|---------------|
| `id` | INT(11) | Elsődleges kulcs | PRIMARY KEY, AUTO_INCREMENT |
| `user_id` | INT(11) | Felhasználó ID | NOT NULL, FOREIGN KEY |
| `car_id` | INT(11) | Autó ID | NOT NULL, FOREIGN KEY |
| `start_date` | DATE | Kezdő dátum | NOT NULL |
| `end_date` | DATE | Záró dátum | NOT NULL |
| `total_price` | INT(11) | Teljes ár | NOT NULL |
| `status` | ENUM | Foglalás státusza | DEFAULT 'pending' |
| `created_at` | TIMESTAMP | Létrehozás ideje | DEFAULT CURRENT_TIMESTAMP |

**Status értékek:**
- `pending` - Függőben
- `confirmed` - Megerősítve
- `cancelled` - Törölve

**Indexek:**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `car_id`

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE CASCADE
- `car_id` → `cars(id)` ON DELETE CASCADE

---

### ER Diagram (Kapcsolatok)

```
users (1) ─────< (N) bookings
cars (1) ──────< (N) bookings
```

- Egy **felhasználó** több **foglalást** létrehozhat
- Egy **autóhoz** több **foglalás** tartozhat
- Egy **foglalás** egy felhasználóhoz és egy autóhoz tartozik

---

## Backend API Dokumentáció

### Autentikáció Endpoints

#### 1. **POST** `/php/register.php`
Új felhasználó regisztrálása.

**Form Data:**
```
fullname: string (min 3 karakter)
email: string (valid email)
password: string (min 6 karakter)
```

**Válasz (sikeres):**
```javascript
// Átirányítás login.html-re alert üzenettel
alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
```

**Válasz (hiba):**
```javascript
// Alert hibaüzenettel
alert('Ez az email cím már regisztrálva van!');
```

---

#### 2. **POST** `/php/login.php`
Felhasználó bejelentkeztetése.

**Form Data:**
```
email: string
password: string
```

**Session létrehozás:**
```php
$_SESSION["user_id"] = $id;
$_SESSION["fullname"] = $fullname;
$_SESSION["email"] = $email;
$_SESSION["isAdmin"] = $isAdmin;
$_SESSION["login_time"] = time();
```

**Válasz (sikeres):**
```javascript
// Átirányítás index.html?login=success
window.location.href = '../html/index.html?login=success';
```

**Válasz (hiba):**
```javascript
alert('Hibás jelszó!');
// vagy
alert('Nincs ilyen felhasználó!');
```

---

#### 3. **GET** `/php/logout.php`
Felhasználó kijelentkeztetése.

**Válasz:**
```javascript
session_unset();
session_destroy();
// Átirányítás index.html-re
```

---

#### 4. **GET** `/php/check_session.php`
Aktuális session állapotának ellenőrzése.

**Válasz (JSON):**
```json
{
  "loggedIn": true,
  "user": {
    "id": 1,
    "fullname": "Varga Dárius",
    "email": "darovarga@gmail.com",
    "isAdmin": 1
  }
}
```

vagy

```json
{
  "loggedIn": false,
  "user": null
}
```

---

### Autók Endpoints

#### 5. **GET** `/php/get_brands.php`
Az összes egyedi autómárka lekérése.

**Válasz (JSON):**
```json
[
  "BMW",
  "Ford",
  "Nissan",
  "Dodge"
]
```

**HTTP Hibakódok:**
- `500` - Adatbázis hiba

---

#### 6. **GET** `/php/get_cars.php`
Autók lekérése szűrőkkel.

**Query Paraméterek:**
```
marka: string (kötelező)
fuel: int (opcionális) - 1=Benzin, 2=Dízel, 3=Elektromos
year: int (opcionális) - Évjárat
maxPrice: int (opcionális) - Maximum ár Ft-ban
```

**Példa request:**
```
GET /php/get_cars.php?marka=BMW&fuel=1&year=2023&maxPrice=100000
```

**Válasz (JSON):**
```json
[
  {
    "id": 1,
    "marka": "BMW",
    "nev": "BMW M4",
    "img": "../assets/listImg/bmw_m4.jpg",
    "desc": "Német sportkupé, 510 lóerővel.",
    "evjarat": 2023,
    "uzemanyag": "Benzin",
    "uzemanyagKod": 1,
    "ar": 95000,
    "arFormat": "95 000 Ft/nap"
  }
]
```

**HTTP Hibakódok:**
- `400` - Hiányzó márka paraméter
- `500` - Adatbázis hiba

---

#### 7. **GET** `/php/get_car.php`
Egy konkrét autó részletes adatainak lekérése.

**Query Paraméterek:**
```
id: int (kötelező)
```

**Példa request:**
```
GET /php/get_car.php?id=1
```

**Válasz (JSON):**
```json
{
  "id": 1,
  "marka": "BMW",
  "nev": "BMW M4",
  "img": "../assets/listImg/bmw_m4.jpg",
  "desc": "Német sportkupé, 510 lóerővel.",
  "evjarat": 2023,
  "uzemanyag": "Benzin",
  "uzemanyagKod": 1,
  "ar": 95000,
  "arFormat": "95 000 Ft/nap"
}
```

**HTTP Hibakódok:**
- `400` - Hiányzó vagy érvénytelen ID
- `404` - Autó nem található
- `500` - Adatbázis hiba

---

#### 8. **POST** `/php/add_car.php`
Új autó hozzáadása (ADMIN csak).

**Autentikáció:** Session-ben `isAdmin` = 1 szükséges

**Form Data (multipart/form-data):**
```
marka: string
nev: string
desc: text
evjarat: int (1900-2030)
uzemanyag: int (1-3)
ar: int (0-10000000)
img: file (jpg/png/webp, max 5MB)
```

**Fájl kezelés:**
- Fájlnév generálás: `{marka}_{nev}_{timestamp}.{extension}`
- Feltöltési útvonal: `../assets/listImg/`
- Támogatott formátumok: JPG, PNG, WEBP
- Max méret: 5MB

**Válasz (sikeres):**
```javascript
alert('Autó sikeresen hozzáadva!');
window.location.href = '../html/admin.html';
```

**Válasz (hiba):**
```javascript
alert('Csak JPG, PNG és WEBP képek engedélyezettek!');
```

---

### Foglalások Endpoints

#### 9. **GET** `/php/get_bookings.php`
Egy autóhoz tartozó foglalt dátumok lekérése.

**Query Paraméterek:**
```
carId: int (kötelező)
```

**Példa request:**
```
GET /php/get_bookings.php?carId=4
```

**Válasz (JSON):**
```json
[
  "2025-10-29",
  "2025-10-30",
  "2025-10-22"
]
```

---

#### 10. **POST** `/php/process_booking.php`
Új foglalás létrehozása.

**Autentikáció:** Bejelentkezés szükséges

**Form Data:**
```
carId: int
date: string (YYYY-MM-DD)
price: int
```

**Foglalás ellenőrzés:**
- Dátum elérhető-e (nincs már foglalva)
- Felhasználó be van-e jelentkezve

**Válasz (JSON):**
```json
{
  "success": true,
  "message": "Sikeres foglalás"
}
```

vagy

```json
{
  "success": false,
  "message": "Ez a dátum már foglalt"
}
```

---

#### 11. **GET** `/php/get_user_bookings.php`
Bejelentkezett felhasználó foglalásainak lekérése.

**Autentikáció:** Bejelentkezés szükséges

**Válasz (JSON):**
```json
{
  "success": true,
  "future": [
    {
      "id": 3,
      "car_name": "BMW M4",
      "start_date": "2025-10-30",
      "formatted_date": "2025. Oktober 30.",
      "total_price": 110000,
      "formatted_price": "110 000 Ft",
      "created_at": "2025.10.21."
    }
  ],
  "past": [
    {
      "id": 1,
      "car_name": "BMW i8",
      "start_date": "2025-10-20",
      "formatted_date": "2025. Oktober 20.",
      "total_price": 110000,
      "formatted_price": "110 000 Ft",
      "created_at": "2025.10.19."
    }
  ]
}
```

---

### Felhasználó Endpoints

#### 12. **GET** `/php/get_user_data.php`
Bejelentkezett felhasználó adatainak lekérése.

**Autentikáció:** Bejelentkezés szükséges

**Válasz (JSON):**
```json
{
  "success": true,
  "user": {
    "fullname": "Varga Dárius",
    "email": "darovarga@gmail.com",
    "phone": "305840612"
  }
}
```

---

#### 13. **POST** `/php/update_profile.php`
Felhasználói profil frissítése.

**Autentikáció:** Bejelentkezés szükséges

**Form Data:**
```
fullname: string
email: string
phone: string
```

**Email ellenőrzés:**
- Más felhasználónál már használatban van-e

**Válasz (JSON):**
```json
{
  "success": true,
  "message": "Profil sikeresen frissítve"
}
```

vagy

```json
{
  "success": false,
  "message": "Ez az email már használatban van"
}
```

---

#### 14. **POST** `/php/change_password.php`
Jelszó módosítása.

**Autentikáció:** Bejelentkezés szükséges

**Form Data:**
```
current_password: string
new_password: string (min 6 karakter)
```

**Ellenőrzések:**
- Jelenlegi jelszó helyes-e
- Új jelszó legalább 6 karakter

**Válasz (JSON):**
```json
{
  "success": true,
  "message": "Jelszó sikeresen módosítva"
}
```

vagy

```json
{
  "success": false,
  "message": "Hibás jelenlegi jelszó"
}
```

---

### Statisztika Endpoints

#### 15. **GET** `/php/get_stats.php`
Globális statisztikák lekérése.

**Válasz (JSON):**
```json
{
  "users": 15,
  "bookings": 42,
  "cars": 28
}
```

---

## Frontend Komponensek

### JavaScript Modulok

#### 1. **auth.js** - Autentikáció Kezelés

**Globális objektum:** `window.DreamCarsAuth`

**Tulajdonságok:**
```javascript
{
  user: null | Object,        // Bejelentkezett felhasználó adatai
  isLoggedIn: false | true,   // Be van-e jelentkezve
  initialized: false | true   // Inicializálva van-e
}
```

**Függvények:**

##### `checkSession(forceRefresh = false)`
Session ellenőrzése és navigáció frissítése.

```javascript
const data = await window.DreamCarsAuth.check();
console.log(data.loggedIn); // true/false
console.log(data.user);     // user object vagy null
```

##### `logout()`
Kijelentkezés megerősítéssel.

```javascript
window.DreamCarsAuth.logout();
// Confirm dialog -> logout.php -> átirányítás
```

##### `requireLogin()`
Oldal védelem - bejelentkezés kikényszerítése.

```javascript
window.DreamCarsAuth.requireLogin();
// Ha nincs bejelentkezve -> átirányítás login.html-re
```

##### `redirectIfLoggedIn()`
Login/Register oldalak védelme.

```javascript
window.DreamCarsAuth.redirectIfLoggedIn();
// Ha be van jelentkezve -> átirányítás index.html-re
```

**Automatikus funkciók:**
- Navigáció frissítése felhasználónév megjelenítéssel
- Admin link hozzáadása admin felhasználóknak
- Kijelentkezés gomb dinamikus létrehozása

---

#### 2. **cars.js** - Autók Böngészése

**Fő funkciók:**

##### `initBrands()`
Márkák betöltése a dropdown-ba.

##### `handleBrandChange()`
Márka kiválasztása eseménykezelő.

##### `loadCars(brand)`
Autók betöltése a kiválasztott márkához szűrőkkel.

##### `applyFilters()`
Szűrők alkalmazása (üzemanyag, évjárat, ár).

##### `displayCars(cars)`
Autók megjelenítése kártyákban.

##### `handleBooking(carId, carName)`
Foglalás gomb eseménykezelő.

**Debounce implementáció:**
Ár szűrőhöz 500ms késleltetés a gyakori API hívások elkerülésére.

---

#### 3. **booking.js** - Foglalási Rendszer

**Globális változók:**
```javascript
let carData = null;           // Kiválasztott autó adatai
let bookedDates = [];         // Foglalt dátumok listája
let selectedDate = null;      // Kiválasztott dátum
let currentMonth = new Date(); // Aktuális hónap
```

**Fő funkciók:**

##### `loadCarData()`
Autó adatainak betöltése URL paraméterből.

##### `loadBookedDates()`
Foglalt dátumok lekérése az autóhoz.

##### `renderCalendar()`
Naptár generálása és megjelenítése.

**Naptár logika:**
- Múltbeli dátumok: `disabled`
- Foglalt dátumok: `booked`
- Elérhető dátumok: `available`
- Kiválasztott dátum: `selected`
- 1 éven túli dátumok: `disabled`

##### `selectDate(date, dateString)`
Dátum kiválasztása.

##### `updateSummary(date)`
Összegző panel frissítése.

##### `formatDate(date)`
Dátum formázása YYYY-MM-DD formátumba.

**Magyar hónap nevek:**
```javascript
['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December']
```

---

#### 4. **payment.js** - Fizetési Rendszer

**URL paraméterek:**
```javascript
const carId = urlParams.get('carId');
const date = urlParams.get('date');
const price = urlParams.get('price');
```

**Fő funkciók:**

##### `loadSummary()`
Foglalás összegzésének betöltése.

##### `displaySummary(car, bookingDate, totalPrice)`
Összegzés megjelenítése.

##### `processPayment()`
Fizetés feldolgozása és foglalás mentése.

##### `showSuccessModal()`
Sikeres fizetés modal megjelenítése.

**Kártya input formázás:**
- **Kártyaszám:** 4-es csoportok (1234 5678 9012 3456)
- **Lejárat:** MM/YY formátum
- **CVV:** Csak számok, max 3 karakter

**Fizetési módok:**
- Bankkártya (card)
- PayPal (paypal)

---

#### 5. **admin.js** - Admin Panel

**Admin ellenőrzés:**
```javascript
if (!window.DreamCarsAuth.user || window.DreamCarsAuth.user.isAdmin != 1) {
  alert('Nincs jogosultságod ehhez az oldalhoz!');
  window.location.href = 'index.html';
}
```

**Fő funkciók:**

##### Kép előnézet
```javascript
imgInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && file.size <= 5MB) {
    // FileReader -> preview
  }
});
```

##### Form validáció
- Évjárat: 1900 - (current year + 1)
- Ár: 0 - 10,000,000 Ft
- Kép: Kötelező, max 5MB

---

#### 6. **user.js** - Felhasználói Profil

**Tab rendszer:**
```javascript
const tabs = ['details', 'bookings', 'security'];
```

**Fő funkciók:**

##### `loadUserData()`
Felhasználói adatok betöltése.

##### `loadBookings()`
Foglalások betöltése (jövőbeli és múltbeli).

##### `displayBookings(bookings, containerId)`
Foglalások megjelenítése.

**Foglalás státuszok:**
- `confirmed` / `active` - Aktív foglalás (zöld)
- `past` - Lezárt foglalás (szürke)
- `cancelled` - Törölt foglalás (piros)

##### Profil frissítés
Email ellenőrzés más felhasználóknál való használat ellen.

##### Jelszó módosítás
- Jelenlegi jelszó ellenőrzés
- Új jelszó minimum 6 karakter
- Jelszó megerősítés

---

#### 7. **stats.js** - Statisztikák

**Animált számláló:**
```javascript
function animateCounter(elementId, start, end, duration) {
  const increment = range / (duration / 16);
  // 60 FPS animáció
}
```

**Statisztikák:**
- Regisztrált felhasználók száma
- Teljesített foglalások száma
- Elérhető járművek száma

---

#### 8. **main.js** - Fő Szkript

**Mobil menü kezelés:**
```javascript
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});
```

---

## Autentikáció és Session Kezelés

### Session Változók

```php
$_SESSION["user_id"]     // Felhasználó ID
$_SESSION["fullname"]    // Teljes név
$_SESSION["email"]       // Email cím
$_SESSION["isAdmin"]     // Admin jogosultság (0/1)
$_SESSION["login_time"]  // Bejelentkezés időpontja (timestamp)
```

### Biztonsági Funkciók

#### Password Hashing
```php
// Regisztráció
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Bejelentkezés
if (password_verify($password, $hashedPassword)) {
  // Sikeres
}
```

#### Session védelem
```php
// session_handler.php
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: ../html/login.html');
        exit();
    }
}

function requireAdmin() {
    if (!isAdmin()) {
        header('Location: ../html/index.html');
        exit();
    }
}
```

#### SQL Injection védelem
```php
// Prepared statements használata MINDEN query-nél
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
```

#### XSS védelem
```php
// Input tisztítás
$email = trim($_POST["email"]);
$fullname = trim($_POST["fullname"]);

// Output escape-elés (ahol szükséges)
htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
```

---

## Telepítési Útmutató

### Követelmények

- **PHP:** 7.4 vagy újabb
- **MySQL:** 5.7+ vagy MariaDB 10.4+
- **Webszerver:** Apache vagy Nginx
- **Böngésző:** Modern böngésző (Chrome, Firefox, Edge, Safari)

### 1. lépés: Környezet előkészítése

#### XAMPP telepítés (Windows)
1. Töltsd le: https://www.apachefriends.org/
2. Telepítsd az Apache-t és MySQL-t
3. Indítsd el mindkettőt a Control Panel-ből

#### LAMP telepítés (Linux)
```bash
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql
sudo systemctl start apache2
sudo systemctl start mysql
```

### 2. lépés: Adatbázis létrehozása

1. Nyisd meg a phpMyAdmin-t: `http://localhost/phpmyadmin`
2. Hozz létre új adatbázist: `dreamcars`
3. Importáld a `dreamcars_full.sql` fájlt
4. Ellenőrizd, hogy az összes tábla létrejött

**Parancssorból:**
```bash
mysql -u root -p
CREATE DATABASE dreamcars CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

mysql -u root -p dreamcars < dreamcars_full.sql
```

### 3. lépés: Projekt fájlok elhelyezése

1. Másold a projekt mappát a webszerver gyökérkönyvtárába
   - **XAMPP:** `C:/xampp/htdocs/dreamcars/`
   - **LAMP:** `/var/www/html/dreamcars/`

2. Ellenőrizd a struktúrát:
```
htdocs/dreamcars/
├── html/
├── css/
├── js/
├── php/
└── assets/
```

### 4. lépés: Adatbázis kapcsolat beállítása

Minden PHP fájlban ellenőrizd az adatbázis kapcsolati adatokat:

```php
$servername = "localhost";
$username = "root";           // Módosítsd szükség szerint
$password = "";               // Módosítsd szükség szerint
$dbname = "dreamcars";
```

### 5. lépés: Fájl jogosultságok (Linux)

```bash
sudo chown -R www-data:www-data /var/www/html/dreamcars/
sudo chmod -R 755 /var/www/html/dreamcars/
sudo chmod -R 775 /var/www/html/dreamcars/assets/listImg/
```

### 6. lépés: Tesztelés

1. Nyisd meg a böngészőt
2. Navigálj a címre: `http://localhost/dreamcars/html/index.html`
3. Regisztrálj egy új felhasználót
4. Jelentkezz be
5. Böngéssz az autók között

### Admin felhasználó létrehozása

**SQL-ben:**
```sql
UPDATE users SET isAdmin = 1 WHERE email = 'darovarga@gmail.com';
```

vagy közvetlenül a regisztráció után phpMyAdmin-ban.

---

## Biztonsági Szempontok

### Jelenlegi implementáció

#### Megvalósított biztonsági funkciók:
1. **Password hashing** - bcrypt algoritmus
2. **Prepared statements** - SQL injection védelem
3. **Session alapú autentikáció**
4. **Input validáció** - kliens és szerver oldalon
5. **File upload ellenőrzés** - típus, méret
6. **Admin jogosultság ellenőrzés**
7. **CSRF védelem** - form origin ellenőrzés

### Továbbfejlesztendő területek

#### Javaslatok:
1. **HTTPS használat** - Éles környezetben kötelező
2. **CSRF token** - Form védelem token-nel
3. **Rate limiting** - Login próbálkozások korlátozása
4. **Email verification** - Email cím megerősítés
5. **Two-factor authentication (2FA)**
6. **Password complexity** - Erősebb jelszó követelmények
7. **Session timeout** - Automatikus kijelentkezés
8. **Activity logging** - Felhasználói tevékenységek naplózása
9. **IP whitelist/blacklist** - Admin funkciókhoz
10. **Input sanitization** - Még szigorúbb tisztítás

### Ajánlott gyakorlatok

```php
// CSRF Token generálás
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// CSRF Token ellenőrzés
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF token validation failed');
}

// Rate limiting példa
$max_attempts = 5;
$lockout_time = 15 * 60; // 15 perc

// Session timeout
$inactive = 1800; // 30 perc
if (isset($_SESSION['last_activity']) && 
    (time() - $_SESSION['last_activity'] > $inactive)) {
    session_unset();
    session_destroy();
}
$_SESSION['last_activity'] = time();
```

---

## Hibaelhárítás

### Lehetséges gyakori problémák és megoldásaik

#### 1. "Adatbázis kapcsolódási hiba"

**Probléma:** PHP nem tud kapcsolódni a MySQL-hez.

**Megoldás:**
```php
// Ellenőrizd:
$servername = "localhost";  // Helyes-e?
$username = "root";         // Létezik ez a user?
$password = "";             // Helyes jelszó?
$dbname = "dreamcars";      // Létezik ez az adatbázis?

// Teszteld a kapcsolatot:
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
```

#### 2. "Session nem működik"

**Probléma:** Felhasználó bejelentkezik, de azonnal "kijelentkezik".

**Megoldás:**
```php
// Minden PHP fájl elején:
session_start();

// Ellenőrizd a session cookie beállításokat:
ini_set('session.cookie_lifetime', 0);
ini_set('session.cookie_path', '/');
ini_set('session.cookie_secure', 0); // 1 ha HTTPS
ini_set('session.cookie_httponly', 1);

// Ellenőrizd a session mentési útvonalat:
echo session_save_path();
```

#### 3. "Képek nem töltődnek be"

**Probléma:** Autó képek nem jelennek meg.

**Megoldás:**
```
1. Ellenőrizd az elérési utakat:
   - HTML-ben: ../assets/listImg/kep.jpg
   - PHP-ben: ../assets/listImg/ könyvtár létezik?

2. Jogosultságok (Linux):
   chmod 755 assets/listImg/

3. Kép fájlnevek:
   - Nincs benne szóköz vagy speciális karakter?
   - Helyes kiterjesztés (.jpg, .png)?
```

#### 4. "CORS Error"

**Probléma:** JavaScript fetch hívások blokkolva vannak.

**Megoldás:**
```php
// PHP fájlok elején:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
```

#### 5. "JSON parse error"

**Probléma:** JavaScript nem tudja értelmezni a PHP választ.

**Megoldás:**
```php
// MINDIG állítsd be a Content-Type-ot:
header('Content-Type: application/json; charset=utf-8');

// Ellenőrizd, hogy csak JSON megy vissza (nincs HTML/warning):
error_reporting(0); // Fejlesztés közben NE használd!

// JSON encode UTF-8 támogatással:
echo json_encode($data, JSON_UNESCAPED_UNICODE);
```

#### 6. "File upload nem működik"

**Probléma:** Képfeltöltés az admin panel-en sikertelen.

**Megoldás:**
```php
// php.ini beállítások:
upload_max_filesize = 10M
post_max_size = 10M
max_file_uploads = 20

// Jogosultságok (Linux):
chmod 775 assets/listImg/
chown www-data:www-data assets/listImg/

// Form-ban mindig:
<form enctype="multipart/form-data">
```

#### 7. "Admin panel nem látszik"

**Probléma:** Bejelentkezett felhasználó nem látja az Admin menüpontot.

**Megoldás:**
```sql
-- Ellenőrizd az adatbázisban:
SELECT id, email, isAdmin FROM users WHERE email = 'te@email.hu';

-- Ha 0, akkor állítsd 1-re:
UPDATE users SET isAdmin = 1 WHERE id = 1;
```

#### 8. "Foglalásnál nincs naptár"

**Probléma:** booking.html-en üres a naptár rész.

**Megoldás:**
```javascript
// Ellenőrizd a console-t (F12):
console.log('Calendar element:', document.getElementById('calendar'));

// JavaScript betöltési sorrend:
<script src="../js/auth.js"></script>
<script src="../js/booking.js"></script>
<script src="../js/main.js"></script>
```

---

## Továbbfejlesztési Lehetőségek

### Rövid távú fejlesztések (1-2 hét)

1. **Email értesítések**
   - Foglalás visszaigazolás email
   - Jelszó visszaállítás email-ben
   - Newsletter feliratkozás

2. **Többnapos foglalás**
   - Kezdő és záró dátum kiválasztása
   - Dinamikus árkalkuláció

3. **Kedvenc autók**
   - Wishlist funkció
   - Autók mentése későbbi böngészéshez

4. **Keresés és rendezés**
   - Keresés autó név alapján
   - Rendezés ár, évjárat szerint

5. **Értékelések**
   - Autók értékelése
   - Kommentek írása

### Középtávú fejlesztések (1-2 hónap)

6. **Valós fizetési integráció**
   - Stripe API
   - PayPal API
   - Bankkártya fizetés

7. **Google Maps integráció**
   - Autók elhelyezkedése térképen
   - Átvételi pontok

8. **Chat rendszer**
   - Élő ügyfélszolgálat
   - Admin-felhasználó kommunikáció

9. **Többnyelvűség**
   - Magyar/Angol nyelv támogatás
   - Nyelv választó

10. **Push értesítések**
    - Foglalás emlékeztetők
    - Akciók értesítése

### Hosszú távú fejlesztések (3-6 hónap)

11. **Mobilalkalmazás**
    - React Native app
    - iOS és Android támogatás

12. **API dokumentáció**
    - Swagger/OpenAPI spec
    - Külső integrációk

13. **Adminisztrációs fejlesztések**
    - Dashboard analytics
    - Foglalások kezelése
    - Autók szerkesztése/törlése
    - Felhasználók kezelése

14. **Promóciók és kedvezmények**
    - Kupon kódok
    - Törzsvásárlói program
    - Szezonális akciók

15. **Gépi tanulás**
    - Ajánlórendszer
    - Dinamikus árazás
    - Fraud detection

### UI/UX fejlesztések

16. **Dark/Light mode**
17. **Accessibility** (WCAG 2.1)
18. **Progressive Web App (PWA)**
19. **Skeleton loading screens**
20. **Animációk finomítása**

### Backend optimalizációk

21. **Caching** (Redis/Memcached)
22. **CDN használat** képekhez
23. **Database indexek** optimalizálása
24. **API rate limiting**
25. **Load balancing**

---

## Függelékek

### Hasznos linkek

- **PHP Dokumentáció:** https://www.php.net/docs.php
- **MySQL Dokumentáció:** https://dev.mysql.com/doc/
- **MDN Web Docs:** https://developer.mozilla.org/
- **Font Awesome:** https://fontawesome.com/
- **OWASP Security:** https://owasp.org/

### SQL Parancsok gyűjtemény

```sql
-- Összes felhasználó listázása
SELECT * FROM users;

-- Admin jogosultság adása
UPDATE users SET isAdmin = 1 WHERE id = ?;

-- Foglalások száma autónként
SELECT car_id, COUNT(*) as count 
FROM bookings 
GROUP BY car_id;

-- Legnépszerűbb autók
SELECT c.nev, COUNT(b.id) as bookings_count
FROM cars c
LEFT JOIN bookings b ON c.id = b.car_id
GROUP BY c.id
ORDER BY bookings_count DESC
LIMIT 10;

-- Felhasználó összes foglalása
SELECT b.*, c.nev, c.marka
FROM bookings b
JOIN cars c ON b.car_id = c.id
WHERE b.user_id = ?
ORDER BY b.start_date DESC;

-- Adatbázis mentés
mysqldump -u root -p dreamcars > backup.sql

-- Adatbázis visszaállítás
mysql -u root -p dreamcars < backup.sql
```

---

## 📝 Változtatások Naplója

### v1.0.0 (2025. Október)
- ✅ Alapvető funkcionalitás
- ✅ Felhasználói regisztráció és bejelentkezés
- ✅ Autók böngészése és szűrése
- ✅ Foglalási rendszer naptárral
- ✅ Fizetési szimuláció
- ✅ Admin panel
- ✅ Felhasználói profil

---

## Közreműködők

- **Fejlesztő:** Varga Dárius, Osikóczki Sándor Mátyás, Juhász Ferenc Dániel 
- **Projekt típus:** Egyetemi projekt
- **Technológia stack:** PHP, MySQL, JavaScript, HTML5, CSS3

---

## Licenc

Ez egy egyetemi projekt feladat a Rendszerfejlesztés technológiája és modszertana(BAI0168) nevezetű tárgyra. A projekt szabadon felhasználható tanulási és fejlesztési célokra.

---

## Kapcsolat & Támogatás

Ha kérdésed van a projekttel kapcsolatban:
1. Nézd át ezt a dokumentációt
2. Ellenőrizd a **Hibaelhárítás** részt
3. Használd a böngésző **DevTools Console**-ját (F12)
4. Ellenőrizd a **PHP error log**-okat

Egyéb támogatással kapcsolatban, illetve hibák felmerülése esetén NEM vagyunk kötelesek se hajlandóak segítség nyújtásra, a projekt módosítása csak saját felelősségre történik, a módosítás utáni felmerülő problémák esetén NE keressék a projekt fejlesztőit!

**Debug mód bekapcsolása (fejlesztés közben):**
```php
// PHP fájlok elején:
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

---

**Utolsó frissítés:** 2025. November  
**Dokumentáció verzió:** 1.0  
**Projekt verzió:** v1.0.0

---
