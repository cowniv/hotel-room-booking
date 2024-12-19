// Room rates and capacity are the same ones from my Flowgorithm flowchart:
// single = 1500 / 1 guest, double = 2500 / 2 guests, family = 5000 / 5 guests
const ROOMS = {
  single: { name: "Single", feePerDay: 1500, capacity: 1, desc: "1 bed, city view" },
  double: { name: "Double", feePerDay: 2500, capacity: 2, desc: "Queen bed, balcony" },
  family: { name: "Family", feePerDay: 5000, capacity: 5, desc: "2 rooms, kitchenette" },
};

const ADDONS = [
  { id: "breakfast", label: "Breakfast buffet", price: 350, perGuest: true },
  { id: "parking", label: "Parking", price: 200, perGuest: false },
  { id: "spa", label: "Spa access", price: 800, perGuest: true },
];

const STORAGE_KEY = "hotel-bookings";

let selectedRoom = "single";
let bookings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ---------- elements ----------
const roomsEl = document.getElementById("rooms");
const addonsEl = document.getElementById("addons");
const form = document.getElementById("booking-form");
const checkinEl = document.getElementById("checkin");
const checkoutEl = document.getElementById("checkout");
const guestsEl = document.getElementById("guests");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const errorsEl = document.getElementById("errors");
const summaryEl = document.getElementById("summary");
const totalEl = document.getElementById("total");
const listEl = document.getElementById("booking-list");
const emptyEl = document.getElementById("empty");

// ---------- helpers ----------
const peso = (n) => "₱" + n.toLocaleString("en-PH");

function todayString() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function countNights(checkin, checkout) {
  if (!checkin || !checkout) return 0;
  const ms = new Date(checkout) - new Date(checkin);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function saveBookings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// Two bookings for the same room type overlap if one starts before the other ends
function isRoomTaken(roomType, checkin, checkout) {
  return bookings.some(
    (b) => b.status === "confirmed" && b.roomType === roomType &&
      checkin < b.checkout && checkout > b.checkin
  );
}

// ---------- the calculation (flowchart: totalFee = feePerDay * days) ----------
function calculate() {
  const room = ROOMS[selectedRoom];
  const nights = countNights(checkinEl.value, checkoutEl.value);
  const guests = Number(guestsEl.value) || 0;
  const roomFee = room.feePerDay * Math.max(nights, 0);

  const chosen = ADDONS.filter((a) => document.getElementById(a.id).checked);
  const addonFee = chosen.reduce((sum, a) => {
    const qty = a.perGuest ? guests : 1;
    return sum + a.price * qty * Math.max(nights, 0);
  }, 0);

  return { room, nights, guests, roomFee, chosen, addonFee, total: roomFee + addonFee };
}

// ---------- validation (flowchart: invalid room / too many guests) ----------
function validate() {
  const errors = [];
  const { room, nights, guests } = calculate();

  if (!ROOMS[selectedRoom]) errors.push("Invalid room type.");
  if (!checkinEl.value || !checkoutEl.value) errors.push("Pick both check-in and check-out dates.");
  else if (checkinEl.value < todayString()) errors.push("Check-in can't be in the past.");
  else if (nights < 1) errors.push("Check-out must be at least 1 night after check-in.");
  else if (isRoomTaken(selectedRoom, checkinEl.value, checkoutEl.value))
    errors.push(`The ${room.name} room is already booked on those dates.`);

  if (guests < 1) errors.push("Enter at least 1 guest.");
  else if (guests > room.capacity) errors.push(`Too many guests for the ${room.name} room (max ${room.capacity}).`);

  if (nameEl.value.trim().length < 2) errors.push("Enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) errors.push("Enter a valid email.");

  return errors;
}

// ---------- rendering ----------
function renderRooms() {
  roomsEl.innerHTML = Object.entries(ROOMS)
    .map(([key, r]) => `
      <button type="button" class="room ${key === selectedRoom ? "selected" : ""}" data-room="${key}">
        <h3>${r.name}</h3>
        <span class="rate">${peso(r.feePerDay)}</span> / night
        <small>Up to ${r.capacity} guest${r.capacity > 1 ? "s" : ""}</small>
        <small>${r.desc}</small>
      </button>`)
    .join("");
}

function renderAddons() {
  addonsEl.innerHTML = ADDONS.map((a) => `
    <label>
      <input type="checkbox" id="${a.id}">
      ${a.label}
      <span class="price">${peso(a.price)}${a.perGuest ? " / guest" : ""}</span>
    </label>`).join("");
}

function renderSummary() {
  const c = calculate();
  const rows = [
    ["Room", c.room.name],
    ["Rate", peso(c.room.feePerDay) + " / night"],
    ["Nights", c.nights > 0 ? c.nights : "—"],
    ["Guests", c.guests || "—"],
    ["Room fee", peso(c.roomFee)],
    ...c.chosen.map((a) => [a.label, "included"]),
    ["Add-ons", peso(c.addonFee)],
  ];
  summaryEl.innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  totalEl.textContent = peso(c.total);
}

function renderBookings() {
  emptyEl.hidden = bookings.length > 0;
  listEl.innerHTML = bookings
    .slice()
    .reverse()
    .map((b) => `
      <li class="${b.status}">
        <div>
          <strong>${ROOMS[b.roomType].name} room · ${b.name}</strong><br>
          <span class="muted">${b.checkin} → ${b.checkout} · ${b.nights} night(s) · ${b.guests} guest(s) · ${peso(b.total)}</span>
          ${b.status === "cancelled" ? '<span class="muted"> · cancelled</span>' : ""}
        </div>
        ${b.status === "confirmed" ? `<button class="btn small" data-cancel="${b.id}">Cancel</button>` : ""}
      </li>`)
    .join("");
}

// ---------- events ----------
roomsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".room");
  if (!btn) return;
  selectedRoom = btn.dataset.room;
  guestsEl.max = ROOMS[selectedRoom].capacity;
  renderRooms();
  renderSummary();
});

form.addEventListener("input", renderSummary);

checkinEl.addEventListener("change", () => {
  // check-out has to be at least the day after check-in
  if (checkinEl.value) {
    const next = new Date(checkinEl.value);
    next.setDate(next.getDate() + 1);
    checkoutEl.min = next.toISOString().slice(0, 10);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const errors = validate();
  errorsEl.innerHTML = errors.map((msg) => `<li>${msg}</li>`).join("");
  if (errors.length) return;

  const c = calculate();
  bookings.push({
    id: Date.now(),
    roomType: selectedRoom,
    checkin: checkinEl.value,
    checkout: checkoutEl.value,
    nights: c.nights,
