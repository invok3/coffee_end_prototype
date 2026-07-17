/* ---- State ---- */
var state = {
  currentScreen: 'screen-welcome',
  product: null,
  size: 'small',
  quantity: 1,
  side: null
};

/* ---- Product catalog ---- */
var products = {
  coffee:     { name: 'قهوة',           icon: '\u2615', prices: { small: 3.00, medium: 4.00, large: 5.00 } },
  milkshake:  { name: 'ميلك شيك',       icon: '\uD83C\uDF67', prices: { small: 4.00, medium: 5.00, large: 6.00 } },
  juice:      { name: 'عصير',           icon: '\uD83E\uDDC3', prices: { small: 3.00, medium: 4.00, large: 5.00 } },
  slush:      { name: 'كوكتيل سلاش',    icon: '\uD83C\uDF66', prices: { small: 4.00, medium: 5.00, large: 6.00 } }
};

var sizeLabels = { small: 'ص', medium: 'م', large: 'ك' };

var sideNames = {
  incoming: 'الجهة القادمة',
  outgoing: 'الجهة الصادرة'
};

/* ---- Navigation ---- */
function navigateTo(screenId) {
  var all = document.querySelectorAll('.screen');
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove('active');
  }
  document.getElementById(screenId).classList.add('active');
  state.currentScreen = screenId;

  if (screenId === 'screen-confirm') {
    renderConfirmation();
  }

  window.scrollTo(0, 0);
}

/* ---- Product selection ---- */
function selectProduct(id) {
  state.product = id;
  state.size = 'small';
  state.quantity = 1;

  var p = products[id];
  document.getElementById('detail-icon').textContent = p.icon;
  document.getElementById('detail-name').textContent = p.name;

  var btns = document.querySelectorAll('.size-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active');
    if (btns[i].getAttribute('data-size') === 'small') {
      btns[i].classList.add('active');
    }
  }
  document.getElementById('qty-value').textContent = '1';

  updateDetailPrice();
  navigateTo('screen-detail');
}

/* ---- Size selection ---- */
function selectSize(size) {
  state.size = size;
  var btns = document.querySelectorAll('.size-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active');
    if (btns[i].getAttribute('data-size') === size) {
      btns[i].classList.add('active');
    }
  }
  updateDetailPrice();
}

/* ---- Quantity ---- */
function changeQty(delta) {
  state.quantity = Math.max(1, Math.min(10, state.quantity + delta));
  document.getElementById('qty-value').textContent = state.quantity;
  updateDetailPrice();
}

/* ---- Price update ---- */
function updateDetailPrice() {
  var p = products[state.product];
  var unit = p.prices[state.size];
  var total = unit * state.quantity;

  document.getElementById('detail-price').textContent = '$' + unit.toFixed(2);
  document.getElementById('detail-total-price').textContent = '$' + total.toFixed(2);
}

/* ---- Map interactions ---- */
function handleMapTap(side) {
  state.side = side;
  confirmSide(side);
}

function confirmSide(side) {
  var sides = document.querySelectorAll('.map-lane');
  for (var i = 0; i < sides.length; i++) {
    if (sides[i].dataset.side === side) {
      sides[i].classList.add('selected');
      sides[i].classList.remove('dimmed');
    } else {
      sides[i].classList.add('dimmed');
      sides[i].classList.remove('selected');
    }
  }

  document.getElementById('map-hint').style.display = 'none';
  var sel = document.getElementById('map-selected');
  sel.style.display = 'block';
  document.getElementById('map-selected-text').textContent = sideNames[side];

  document.getElementById('btn-confirm-side').style.display = 'block';
}

/* ---- Confirmation screen ---- */
function renderConfirmation() {
  var p = products[state.product];
  var unit = p.prices[state.size];
  var total = unit * state.quantity;

  document.getElementById('confirm-item').textContent =
    p.name + ' (' + sizeLabels[state.size] + ')';
  document.getElementById('confirm-qty').textContent = state.quantity;
  document.getElementById('confirm-total').textContent = '$' + total.toFixed(2);

  var isIncoming = state.side === 'incoming';
  document.getElementById('confirm-side').innerHTML =
    '<span id="confirm-side-arrow">' + (isIncoming ? '&#8594;' : '&#8592;') + '</span> ' +
    sideNames[state.side];

  document.getElementById('done-side').innerHTML =
    'الاستلام: ' + sideNames[state.side] + (isIncoming ? ' &#8594;' : ' &#8592;');
}

/* ---- Place order ---- */
function placeOrder() {
  navigateTo('screen-done');
}

/* ---- Reset ---- */
function resetOrder() {
  state = {
    currentScreen: 'screen-welcome',
    product: null,
    size: 'small',
    quantity: 1,
    side: null
  };

  var sides = document.querySelectorAll('.map-lane');
  for (var i = 0; i < sides.length; i++) {
    sides[i].classList.remove('dimmed');
  }

  document.getElementById('map-hint').style.display = '';
  document.getElementById('map-selected').style.display = 'none';
  document.getElementById('btn-confirm-side').style.display = 'none';

  navigateTo('screen-welcome');
}
