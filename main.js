// autogempa.xml
// gempaterkini.xml
// gempadirasakan.xml
// lasttsunami.xml

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
const addPadding = (arr) =>
  arr.map((i) => `<div style="padding-bottom:20px">${i}</div>`);
const takeTwo = take(2);
const afterTakeTwo = trace('after take 2');
const beforeTakeTwo = trace('before take 2');

const BASEURL = 'https://gempa.yapie.me/api/gempa';

async function getData(path) {
  try {
    const { data } = await axios.get(`${BASEURL}/${path}`);
    // console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
}

const objToHtmlString = (obj) =>
  Object.entries(obj).map(
    ([key, value]) => `
    <div class="has-text-centered"> 
      <div class="title is-size-6" style="margin-bottom:0">
        ${key}
      </div>
      <div>
        ${value} 
      </div>
    </div>
    `
  );

const toObject = (acc, [key, value]) => {
  acc[key] = value;
  acc;
};

const setKeys = (obj) => {
  const keys = ['Tanggal', 'Jam', 'Magnitude', 'Potensi', 'Area', 'Wilayah'];

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (keys.includes(key) || key.includes('Wilayah')) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

async function gempa(path) {
  const { data } = await getData(path);

  return data.map(setKeys).map(compose(join(''), objToHtmlString));
}

gempa('autogempa').then(compose(render(autogempa), addPadding));
gempa('gempaterkini').then(
  compose(render(gempaterkini), join(''), addPadding, takeTwo)
);
gempa('gempadirasakan').then(
  compose(render(gempadirasakan), join(''), addPadding, takeTwo)
);
gempa('lasttsunami').then(compose(render(lasttsunami), addPadding));
