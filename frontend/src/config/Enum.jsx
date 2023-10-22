export const SERVER_CODE = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

export const HOST_ADDRESS = "http://localhost:4000";

export const LOCAL_STORAGE = Object.freeze({
  USER: "user",
  // user types
  ADMIN: "Admin",
  WORKER: "Worker"
})

export const CUSTOM_SERVER_CODE = Object.freeze({
  100: "Nieprawidłowy email.",
  101: "Wszystkie pola muszą być wypełnione.",
  102: "Nieprawidłowy email lub hasło.",
  103: "Nie można znaleźć użytkownika o podanym id.",
  104: "Hasła nie są takie same.",
  105: "Brak tokenu resetowania hasła.",
  106: "Nieprawidłowy typ przekazanych danych",
  107: "Token resetowania hasła wygasł.",
  108: "Wybrane stanowisko nie istnieje w bazie danych",
  109: "Użytkownik nie ma przypisanego typu użytkownika.",
  110: "Użytkownik nie jest administratorem",
  111: "Użytkownik nie ma przypisanego emaila.",
  112: "Użytkownik nie ma przypisanej nazwy użytkownika",
  113: "Nieprawidłowy format emaila.",
  114: "Email jest już zajęty.",
  115: "Wymagany token.",
  116: "Sesja wygasła.",
  117: "Nieprawidłowy token.",
  119: "Brak ID użytkownika w nagłówku żądania",
  120: "Brak tokenu autoryzacji użytkownika",
  121: "Nie można dodać pracownika do stanowiska które jest już przypisane",
  122: "Pracownik ma już przypisane stanowisko",
  123: "Stanowiko nie ma przypisanego pracownika",
});

