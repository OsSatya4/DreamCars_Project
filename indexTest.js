/**
 * @jest-environment jsdom
 */

import { initMenuToggle } from "./menu";

describe("Menu toggle", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="menu-toggle"></button>
      <nav id="nav-links" class=""></nav>
    `;
  });

  test("kattintásra hozzáadja a 'show' class-t", () => {
    initMenuToggle();

    // DOMContentLoaded esemény szimulálása
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const button = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-links");

    button.click();

    expect(nav.classList.contains("show")).toBe(true);
  });

  test("második kattintásra eltávolítja a 'show' class-t", () => {
    initMenuToggle();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const button = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-links");

    button.click(); // hozzáadja
    button.click(); // eltávolítja

    expect(nav.classList.contains("show")).toBe(false);
  });
});
