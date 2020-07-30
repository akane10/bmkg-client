// autogempa.xml
// gempaterkini.xml
// gempadirasakan.xml
// lasttsunami.xml

navigator.serviceWorker
  .register('sw.js', { scope: '.' })
  .then(function (reg) {
    console.log('Service worker registered successfully');
  })
  .catch(function (e) {
    console.error('Error during service worker registration:', e);
  });

const autogempa = document.getElementById('autogempa');
const gempaterkini = document.getElementById('gempaterkini');
const gempadirasakan = document.getElementById('gempadirasakan');
const lasttsunami = document.getElementById('lasttsunami');

const compose = (...functions) => (args) =>
  functions.reduceRight((arg, fn) => fn(arg), args);

const trace = (label) => (value) => {
  console.log(`${label}: ${value}`);
  return value;
};

const render = (id) => (html) => (id.innerHTML += html);
const take = (num) => (arr) => arr.slice(0, num);
const join = (str) => (arr) => arr.join(str);
const takeThree = take(3);

const BASEURL = 'https://gempa.yapie.me/api/gempa';

async function getData(path) {
  try {
    const { data } = await axios.get(`${BASEURL}/${path}`);
    return data;
  } catch (e) {
    console.error(e);
  }
}

function handleValue(value) {
  if (Array.isArray(value)) {
    return value.map((i) => `<div> ${i} </div>`).join('');
  } else {
    return value;
  }
}

const objToHtmlString = (obj) =>
  Object.entries(obj).map(
    ([key, value]) => `
    <div class="has-text-centered"> 
      <div class="title is-size-5" style="margin-bottom:0">
        ${key}
      </div>
      <div>
        ${handleValue(value)} 
      </div>
    </div>
    `
  );

const setWilayah = (obj) => {
  const values = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key.includes('Wilayah')) {
      acc.push(value);
    }
    return acc;
  }, []);

  const objWithoutWilayah = Object.entries(obj).reduce((acc, [key, value]) => {
    if (key.includes('Wilayah')) {
      return acc;
    } else {
      acc[key] = value;
      return acc;
    }
  }, {});

  if (values.length > 0) {
    objWithoutWilayah.Wilayah = values;
  }

  return { ...objWithoutWilayah };
};

const setKeys = (obj) => {
  const keys = [
    'Tanggal',
    'Jam',
    'Magnitude',
    'Potensi',
    'Area',
    'Wilayah',
    'Keterangan',
    'Dirasakan',
  ];

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key) || key.includes('Wilayah')) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const addPadding = (arr) =>
  arr.map((i) => `<div style="padding-bottom:20px">${i}</div>`);

async function gempa(path) {
  const { data } = await getData(path);
  return data.map(compose(join(''), objToHtmlString, setWilayah, setKeys));
}

gempa('autogempa').then(compose(render(autogempa), addPadding));
gempa('gempaterkini').then(
  compose(render(gempaterkini), join(''), addPadding, takeThree)
);
gempa('gempadirasakan').then(
  compose(render(gempadirasakan), join(''), addPadding, takeThree)
);
gempa('lasttsunami').then(compose(render(lasttsunami), addPadding));
