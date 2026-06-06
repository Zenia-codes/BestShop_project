// Když uživatel zadá počet produktů,
// zobrazí se výpočet ceny za produkty (např. 20 × $0.5 = $10).
// Když zadá počet objednávek, vypočítá se cena za objednávky.
// Když vybere balíček, přičte se cena podle balíčku.
// Když zaškrtne accounting nebo terminal, přidá se fixní částka.
// Nakonec se vše sečte do celkové ceny.

function Calculator(prices, inputs, summary) {
  this.prices = prices;
  this.inputs = inputs;
  this.summary = summary;
  this.state = {
    products: 0,
    orders: 0,
    package: "",
    accounting: false,
    terminal: false,
  };

  this.init();
}

// INIT

Calculator.prototype.init = function () {
  this.bindNumber("products");
  this.bindNumber("orders");
  this.bindPackage();
  this.bindCheckbox("accounting");
  this.bindCheckbox("terminal");
  this.bindRemoveButtons();
  this.calculateTotal();
};

// UPDATE ROW (summary + preview)

Calculator.prototype.setRow = function (
  key,
  active,
  calcText = "",
  priceText = ""
) {
  const item = this.summary.items[key];
  const preview = document.querySelector(
    `.calc__preview .item__type[data-id="${key}"]`
  );

  if (!item) return;

  item.classList.toggle("open", active);

  const calc = item.querySelector(".item__calc");
  const price = item.querySelector(".item__price");

  if (calc) calc.innerText = calcText;
  if (price) price.innerText = priceText;

  if (preview) {
    preview.classList.toggle("active", active);
  }
};

//  TOTAL

Calculator.prototype.calculateTotal = function () {
  let total = 0;

  const s = this.state;
  const p = this.prices;

  total += s.products * p.products;
  total += s.orders * p.orders;

  if (s.package) total += p.package[s.package];

  if (s.accounting) total += p.accounting;
  if (s.terminal) total += p.terminal;

  this.total = total;
  this.updateTotal();
};

// TOTAL UI

Calculator.prototype.updateTotal = function () {
  const box = this.summary.total;

  box.priceSpan.innerText = this.total.toFixed(2) + " $";
  box.container.classList.toggle("open", this.total > 0);
};

// NUMBER INPUTS

Calculator.prototype.bindNumber = function (key) {
  const input = this.inputs[key];
  const price = this.prices[key];

  input.addEventListener("input", () => {
    let val = parseInt(input.value) || 0;

    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
      val = parseInt(input.value) || 0;
    }

    this.state[key] = val;

    if (val > 0) {
      this.setRow(
        key,
        true,
        `${val} × ${price}`,
        (val * price).toFixed(2) + " $"
      );
    } else {
      this.setRow(key, false);
    }

    this.calculateTotal();
  });
};

// CHECKBOXES

Calculator.prototype.bindCheckbox = function (key) {
  const input = this.inputs[key];
  const price = this.prices[key];

  input.addEventListener("change", () => {
    this.state[key] = input.checked;

    if (input.checked) {
      this.setRow(key, true, "", price.toFixed(2) + " $");
    } else {
      this.setRow(key, false);
    }

    this.calculateTotal();
  });
};

// PACKAGE

Calculator.prototype.bindPackage = function () {
  const wrapper = this.inputs.package;
  const header = wrapper.querySelector(".select__input");
  const options = wrapper.querySelectorAll(".select__dropdown li");

  const prices = this.prices.package;

  header.addEventListener("click", () => {
    wrapper.classList.toggle("open");
  });

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const value = opt.dataset.value;
      const text = opt.innerText;

      this.state.package = value;

      wrapper.dataset.value = value;
      header.innerText = text;
      wrapper.classList.remove("open");

      this.setRow("package", true, text, prices[value].toFixed(2) + " $");

      this.calculateTotal();
    });
  });
};

// REMOVE BUTTONS

Calculator.prototype.bindRemoveButtons = function () {
  Object.keys(this.summary.items).forEach((key) => {
    const item = this.summary.items[key];
    const btn = item.querySelector(".item__remove");

    if (!btn) return;

    btn.addEventListener("click", () => {
      this.state[key] =
        key === "products" || key === "orders"
          ? 0
          : key === "package"
          ? ""
          : false;

      if (key === "products" || key === "orders") {
        this.inputs[key].value = "";
      }

      if (key === "package") {
        this.inputs.package.dataset.value = "";
        this.inputs.package.querySelector(".select__input").innerText =
          "Choose package";
      }

      if (key === "accounting" || key === "terminal") {
        this.inputs[key].checked = false;
      }

      this.setRow(key, false);
      this.calculateTotal();
    });
  });
};

// DATA

const prices = {
  products: 0.5,
  orders: 0.25,
  package: {
    basic: 0,
    professional: 25,
    premium: 60,
  },
  accounting: 35,
  terminal: 5,
};

// INPUTS

const inputs = {
  products: document.getElementById("products"),
  orders: document.getElementById("orders"),
  package: document.getElementById("package"),
  accounting: document.getElementById("accounting"),
  terminal: document.getElementById("terminal"),
};

// SUMMARY

const summary = {
  items: {
    products: document.querySelector('.list__item[data-id="products"]'),
    orders: document.querySelector('.list__item[data-id="orders"]'),
    package: document.querySelector('.list__item[data-id="package"]'),
    accounting: document.querySelector('.list__item[data-id="accounting"]'),
    terminal: document.querySelector('.list__item[data-id="terminal"]'),
  },
  total: {
    container: document.getElementById("total-price"),
    priceSpan: document.querySelector(".total__price"),
  },
};

// START

const calculator = new Calculator(prices, inputs, summary);
