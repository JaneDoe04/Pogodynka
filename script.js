"use strict";
const navigation_bar = document.querySelector(".navigation_bar");
const scroll_down = document.querySelector(".scroll_down");
const section_scroll = document.querySelectorAll(".jump_to");
const btns = document.querySelectorAll(".btn");
const blur = document.querySelector(".blur");
const account_window = document.querySelector(".account");
const registration_button = document.querySelector(".registration");
const unmaring = document.querySelector(".unmargin");
const images = document.querySelectorAll(".img");
const section2 = document.querySelector("#section1");
const explaination_box = document.querySelector(".explanation_box");
const sections = document.querySelectorAll("section");
const logout_btn = document.querySelector(".logout");
const user_name = document.querySelector("h5");

const left_bar = document.querySelector(".left_bar");

const weather_bar = document.querySelector(".weather_bar");

window.addEventListener("load", () =>
  document.querySelector("#section1").classList.remove("first")
);
const weather_code = [];
weather_code[0] = "Czyste niebo";
weather_code[1] = "Prawie czyste niebo";
weather_code[2] = "Częściowe zachmurzone";
weather_code[3] = "Pochmurnie";
weather_code[45] = "Mgliście";
weather_code[48] = "Mgła szronowa";
weather_code[51] = "Lekka mżawka";
weather_code[53] = "Umiarkowana mżawka";
weather_code[55] = "Gęsta mżawka";
weather_code[56] = "Mroźna mżawka o niskiej intensywności";
weather_code[57] = "Mroźna mżawka o wysokiej intensywności";
weather_code[61] = "Lekki deszcz";
weather_code[63] = "Umiarkowany deszcz";
weather_code[65] = "Intensywny deszcz";
weather_code[66] = "Mroźny deszcz o niskiej intensywności";
weather_code[67] = "Mroźny deszcz o wysokiej intensywności";
weather_code[71] = "Opady śniegu o niskiej intensywności";
weather_code[73] = "Opady śniegu o umiarkowanej intensywności";
weather_code[75] = "Opady śniegu o wysokiej intensywności";
weather_code[77] = "Gradobicie";
weather_code[80] = "Przelotne opady deszczu";
weather_code[81] = "Przelotne opady deszczu";
weather_code[82] = "Przelotne opady deszczu ";
weather_code[85] = "Lekkie opadu śniegu";
weather_code[86] = "Mocne opady śniegu";
weather_code[95] = "Burza";
weather_code[96] = "Burza z gradem";
weather_code[99] = "Burza z gradem";

class App {
  #users = [];
  #big_cities_cords = [
    {
      city: "Warszawa",
      lat: 53.24,
      lng: 19.81,
    },
    {
      city: "Krakow",
      lat: 50.06,
      lng: 19.94,
    },
    {
      city: "Gdańsk",
      lat: 19.94,
      lng: 18.65,
    },
    {
      city: "Bydgoszcz",
      lat: 53.12,
      lng: 18.01,
    },
    {
      city: "Szczecin",
      lat: 53.43,
      lng: 14.55,
    },
    {
      city: "Poznań",
      lat: 52.41,
      lng: 16.93,
    },
    {
      city: "Białystok",
      lat: 53.13,
      lng: 23.16,
    },
    {
      city: "Łódź",
      lat: 51.77,
      lng: 19.47,
    },
    {
      city: "Wroclaw",
      lat: 51.1,
      lng: 17.03,
    },
    {
      city: "Częstochowa",
      lat: 50.8,
      lng: 19.12,
    },
    {
      city: "Katowice",
      lat: 50.26,
      lng: 19.03,
    },
    {
      city: "Lublin",
      lat: 51.25,
      lng: 22.57,
    },
  ];

  #map;
  #map_event;
  #map_zoom_level = 15;
  #not_working_remove_event_listener = false;
  explanation = `<div class="explanation_box">Haslo musi zawierać conajmniej 8 znaków, jedną wielką literę, jedną małą literę oraz conajmniej 1 cyfrę.</div>`;
  registration = `<div class="login_row"> <div class="single_login_row"><h3>Login</h3> </div><input class="login_data login_input" type="text"></div>
  <div class="login_row"><div class="single_login_row"><h3>E-mail</h3></div> <input class="login_data email_input"  type="text"></div>
  <div class="login_row"><div class="single_login_row"><h3>Hasło<sup class="explaination">*</sup></h3></div> <input class="login_data password_input"  type="password"></div>
  <div class="login_row"><div class="single_login_row"><h3>Potwierdź hasło</h3> </div><input class="login_data password_input_repeat"  type="password"></div>
  <div class='error'></div>
  <div class="login_row"><div class="single_login_row"><h3 class="accepter">Zapoznałem się z warunkami nieistniejacej umowy i zobowiązuję się ich przestrzegać</h3></div><input class="login_data_check"  type="checkbox"></div>
  <input type="submit" value="Załóż konto!" class="submiter btn">`;
  login = `<div class="login_row"> <div class="single_login_row"><h3>Login</h3> </div><input class="login_data login_input" type="text"></div>
  <div class='error'></div>
  <div class="login_row"><div class="single_login_row"><h3>Hasło<sup class="explaination">*</sup></h3></div> <input class="login_data"  type="password"></div>
  <input type="submit" value="Zaloguj się!" class="submiter btn">`;
  single_weather_bar = `<div class="single_weather_bar_city">Warszawa </div>`;
  constructor() {
    this.fullfill_left_bar();
    window.addEventListener("keydown", this.login_by_enter.bind(this));
    sections.forEach((section) => this.section_observer.observe(section));
    images.forEach((img) => this.imgObserver.observe(img));
    unmaring.addEventListener("click", this.open_modal_window.bind(this));
    blur.addEventListener("click", this.close_modal_window.bind(this));
    btns.forEach((el) => {
      if (!el.classList.contains("logout"))
        el.addEventListener("click", this.open_modal_window.bind(this));
    });
    section_scroll.forEach((el) => el.addEventListener("click", this.skip_to));
    scroll_down.addEventListener("click", this.skip_to);
    navigation_bar.addEventListener("mouseover", this.text_shadowing);
    navigation_bar.addEventListener("mouseout", this.text_unshadowing);
    logout_btn.addEventListener("click", this.logOuting);
    this.#getLocalStorage();
  }
  //
  //
  //dodawanie mapy do diva dla zalogowanych
  _get_Position(id) {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this, id),
        function () {
          alert("Could not get your position");
        }
      );
  }
  _loadMap(id, position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(position);
    const coords = [latitude, longitude];

    if (!document.querySelector("#map").textContent) {
      this.#map = L.map("map").setView(coords, this.#map_zoom_level);
    }
    this.recreate_popups(id);
    this.display_popups_bar(id);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on("click", this.add_popup.bind(this, id));
  }

  //
  //
  //CHMURKA Z WYMAGANIAMI DOT. HASLA
  shadow_of_explaination() {
    account_window.insertAdjacentHTML("afterbegin", this.explanation);
  }
  removing_shadow_of_explanation() {
    document.querySelector(".explanation_box").remove();
  }
  //
  //
  // OPTYMALIZACJA LADOWANIA ZDJEC
  loadImg(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
  }

  imgObserver = new IntersectionObserver(this.loadImg, {
    root: null,
    threshold: 0,
    rootMargin: "200px",
  });
  // PRZYKLEJANIE PASKA NAWIGACYJNEGO NA STALE
  animated_section_observer(entries) {
    const [entry] = entries;
    if (entry.isIntersecting && entry.target.classList.contains("animated"))
      entry.target.classList.remove("animated");
  }

  section_observer = new IntersectionObserver(this.animated_section_observer, {
    root: null,
    threshold: 0,
    rootMargin: -navigation_bar.offsetHeight + 100 + "px",
  });

  //
  //
  // PRZYCIEMNIANIE OPCJI MENU NA PASKU NAWIGACYJNYM
  text_shadowing(e) {
    if (e.target.classList.contains("nav")) {
      document.querySelectorAll(".nav").forEach((el) => {
        if (el !== e.target) {
          el.classList.add("shadowing");
        }
      });
    }
  }
  text_unshadowing(e) {
    if (e.target.classList.contains("nav")) {
      document.querySelectorAll(".nav").forEach((el) => {
        el.classList.remove("shadowing");
      });
    }
  }
  // PRZEWIJANIE STRONY DO ODPOWIEDNIEJ SEKCJI
  skip_to(e) {
    e.preventDefault();
    const link = e.target.getAttribute("href");
    document.querySelector(link).scrollIntoView({ behavior: "smooth" });
  }
  //
  //
  // OTWIERANIE I ZAMYKANIE OKNA REJESTRACJI I LOGOWANIA
  filling_window(target) {
    account_window.insertAdjacentHTML(
      "afterbegin",
      target.classList.contains("login") ? this.login : this.registration
    );
    document
      .querySelector(".explaination")
      .addEventListener("mouseover", this.shadow_of_explaination.bind(this));

    document
      .querySelector(".explaination")
      .addEventListener("mouseout", this.removing_shadow_of_explanation);
    if (target.classList.contains("login")) {
      document
        .querySelector(".submiter")
        .addEventListener("click", this._logining.bind(this));
    }
  }

  open_modal_window(e) {
    if (!account_window.textContent) {
      this.#not_working_remove_event_listener = true;
      this.filling_window(e.target);
      blur.style.display = "block";
      account_window.style.display = "flex";
      if (e.target.classList.contains("registration"))
        document
          .querySelector(".submiter")
          .addEventListener("click", this.login_validation.bind(this));
    }
  }
  login_by_enter(e) {
    if (e.key === "Enter" && this.#not_working_remove_event_listener) {
      this._logining();
    }
  }
  close_modal_window() {
    blur.style.display = "none";
    account_window.style.display = "none";
    account_window.innerHTML = "";
    this.is_window_opened = true;
    this.#not_working_remove_event_listener = false;
  }
  //
  //
  // PROCES TWORZENIA KONTA
  check_login() {
    console.log(document.querySelector(".login_input"));
    const login = document.querySelector(".login_input").value;
    if (login.length < 8) return "Podany login ma mniej niż 8 znaków";
    if (this.#users.find((user) => user.login === login))
      return "Podany login już istnieje";

    return true;
  }
  check_email() {
    const email = document.querySelector(".email_input").value;
    if (this.#users.find((user) => user.email === email))
      return "Podany email istieje już w naszej bazie!";
    if (!email.includes("@")) return "Podany e-mail jest niepoprawny";
    if (!email.split("@")[1].includes("."))
      return "Podany e-mail jest niepoprawny";
    return true;
  }
  check_password() {
    const password = document.querySelector(".password_input").value;
    const req = "Hasło nie spełnia wymagań";
    let is_number = false;
    let is_big = false;
    let is_small = false;
    if (password.length < 8) return req; //dlugosc liter >7
    for (let i = 0; i < password.length; i++) {
      if (Number(password[i])) {
        //czy zawiera cyfre
        is_number = true;
      }
      if (password[i].charCodeAt() <= 122 && password[i].charCodeAt() >= 97) {
        //czy zawiera mala litere
        is_small = true;
      }
      if (password[i].charCodeAt() > 64 && password[i].charCodeAt() < 91) {
        //czy zaiwera duza litere 97-122
        is_big = true;
      }
    }
    if (!is_number || !is_small || !is_big) return req;
    return true;
  }
  check_repeated_password() {
    const password = document.querySelector(".password_input").value;
    const password_repeated = document.querySelector(
      ".password_input_repeat"
    ).value;
    if (password !== password_repeated) return "Hasla sie nie zgadzaja";

    return true;
  }
  login_validation() {
    if (this.check_login() !== true) {
      document.querySelector(".error").textContent = this.check_login();
      return;
    }
    if (this.check_email() !== true) {
      document.querySelector(".error").textContent = this.check_email();
      return;
    }
    if (this.check_password() !== true) {
      document.querySelector(".error").textContent = this.check_password();
      return;
    }
    this.check_repeated_password();
    if (this.check_repeated_password() !== true) {
      document.querySelector(".error").textContent =
        this.check_repeated_password();
      return;
    }
    if (!document.querySelector(".login_data_check").checked) {
      document.querySelector(".error").textContent =
        "Proszę zatwierdzić warunki umowy!";
      return;
    }
    document.querySelector(".error").textContent = "";
    const user = new User(
      document.querySelector(".login_input").value,
      document.querySelector(".email_input").value,
      document.querySelector(".password_input").value
    );
    console.log(this.#users);

    this.#users.push(user);
    this.#setLocalStorage();
    document.querySelector(".error").textContent =
      "Gratulacje, udało Ci się założyć konto!, miłej zabawy na tej bezużytecznej stronie";
  }
  //Zapisywanie konta w pamieci przegladarki
  #setLocalStorage() {
    localStorage.setItem("users", JSON.stringify(this.#users));
  }
  #getLocalStorage() {
    console.log("1:");
    console.dir(localStorage.getItem("users"));

    const data = JSON.parse(localStorage.getItem("users"));

    if (!data) return;

    this.#users = data;
  }
  //logowanie sie do aplikacji
  _logining() {
    const [user_login_input, user_password_input] =
      document.querySelectorAll(".login_data");
    const [user_login, user_paswword] = [
      user_login_input.value,
      user_password_input.value,
    ];
    const user = this.#users.find((el) => el.login === user_login);
    if (user_paswword === user.password) {
      this._logged_window(user);
    }
  }
  _logged_window(user) {
    document.querySelector(".logged").style.display = "flex";
    this.close_modal_window();
    btns.forEach((el) => (el.style.display = "none"));
    logout_btn.style.display = "block";
    logout_btn.removeEventListener("click", this.open_modal_window.bind(this));
    this._get_Position(user.id);
    this.name_filling(user);
  }
  name_filling(user) {
    user_name.textContent = `Witaj, ${user.login}`;
  }
  logOuting() {
    btns.forEach((el) => (el.style.display = "block"));
    logout_btn.style.display = "none";
    document.querySelector(".logged").style.display = "none";
  }
  //
  recreate_popups(id) {
    const current_user = this.#users.find((el) => el.id === id);
    console.log(current_user);
    current_user.popups.forEach((el) => {
      const marker = L.marker([el.lat, el.lng]).addTo(this.#map);
    });
  }
  display_popups_bar(id) {
    weather_bar.innerHTML = "";
    const current_user = this.#users.find((el) => el.id === id);
    weather_bar.addEventListener(
      "click",
      this.switch_view.bind(this, current_user)
    );

    current_user.popups.forEach((el, i) => {
      console.log(el.lat, el.lng);
      const divs = `<div class="single_weather_bar" data-id='${i}'> kordy znacznika: ${Math.floor(
        el.lat
      )},  ${Math.floor(el.lng)}</div> `;
      weather_bar.insertAdjacentHTML("beforeend", divs);
    });
  }
  add_popup(id, mapE) {
    const popup_lat = mapE.latlng.lat;
    const popup_lng = mapE.latlng.lng;

    const pop = new Popup(popup_lat, popup_lng);

    const marker = L.marker([popup_lat, popup_lng]).addTo(this.#map);
    const find_user = this.#users.find((el) => el.id === id);
    find_user.popups.push(pop);
    this.#setLocalStorage();
    this.#map_event = mapE;
    this.display_popups_bar(id);
  }
  switch_view(current_user, e) {
    if (e.target.classList.contains("single_weather_bar")) {
      const current_id = e.target.getAttribute("data-id");
      console.log(current_id, current_user);
      const current_cords = current_user.popups[current_id];
      console.log(current_cords);
      // L.map("map").setView(current_cords, this.#map_zoom_level);
      console.log(L.map);
    }
  }
  #get_data(lat, lng) {
    return fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weathercode&forecast_days=1`
    );
  }
  fullfill_left_bar() {
    const time = new Date();

    const dane = this.#big_cities_cords.forEach((el) => {
      const miasto = this.#get_data(el.lat, el.lng);
      miasto
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          const current_weather_code = res.hourly.weathercode[time.getHours()];
          const left_bar_div = `<div class="city"><h4>${el.city}<br> </h4> ${
            res.hourly.temperature_2m[time.getHours()]
          }℃<br>${weather_code[current_weather_code]} <div class="emotka">${
            current_weather_code == 0
              ? "🌞"
              : current_weather_code >= 1 && current_weather_code <= 3
              ? "☁"
              : current_weather_code >= 45 && current_weather_code <= 48
              ? "🌫"
              : current_weather_code >= 51 && current_weather_code <= 67
              ? "🌧"
              : current_weather_code >= 71 && current_weather_code <= 75
              ? "❄"
              : current_weather_code == 77
              ? "🌨"
              : current_weather_code >= 80 && current_weather_code <= 82
              ? "🌧"
              : current_weather_code >= 85 && current_weather_code <= 86
              ? "❄"
              : current_weather_code == 95
              ? "🌩"
              : "⛈s"
          }</div></div>`;

          left_bar.insertAdjacentHTML("beforeend", left_bar_div);
        });
    });
    // console.log(dane);
  }
}
class User {
  id = Date.now();
  // #login;
  // #email;
  // #password; nie moge ustawic tych zmiennych na prywatne, bo nie moglbym zaladowac ich do localstorage, w kazdym razie i tak mija sie to|
  // z celem, z racji, ze dane do logowania sa dostepne w pamieci przegladarki.
  popups = [];
  constructor(login, email, password) {
    this.login = login;
    this.email = email;
    this.password = password;
    console.log(this);
  }
}
class Popup {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}
const app = new App();
