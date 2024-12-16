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
