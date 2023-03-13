import { Octokit } from '@octokit/core';

const form = document.querySelector('.form');
const name = document.querySelector('.name');
const searchResults = document.querySelector('.search-results');

const octokit = new Octokit({
  auth: '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',
});

async function search(repName) {
  try {
    const response = await octokit.request('GET /search/repositories', {
      q: repName,
      org: 'octokit',
      type: 'private',
    });

    return response.data.items.slice(0, 10);
  } catch (error) {
    console.log(error);
  }
}

function getData(form) {
  var formData = new FormData(form);
  const obj = {};
  for (var pair of formData.entries()) {
    obj[pair[0]] = pair[1];
  }
  return obj;
}

async function formHandler(form) {
  const data = getData(form);

  console.log(data.name);

  if (!data.name) {
    name.insertAdjacentHTML(
      'afterend',
      `<div class='name-error'>
        Обязательное поле
        </div>`
    );
    return;
  }

  if (data.name.length < 2) {
    name.insertAdjacentHTML(
      'afterend',
      `<div class='name-error'>
        Минимальное число символов - 2
        </div>`
    );
    return;
  }

  form.reset();
  const repos = await search(data.name);

  if (repos.length === 0) {
    searchResults.insertAdjacentHTML(
      'beforeend',
      `<div class='search-results__error'>Ничего не найдено</div>`
    );
  }
  const listItems = document.querySelectorAll('li');

  listItems.forEach((item) => {
    item.innerHTML = '';
  });

  listItems.forEach((item, index) => {
    if (!repos[index]) {
      return;
    }
    item.insertAdjacentHTML(
      'beforeend',
      `<h2><a target="_blank"  href=${repos[index].svn_url}>${repos[index].name}</a></h2>
      <div><span class='bold'>Описание:</span> ${repos[index].description}</div>
      <div><span class='bold'>Владелец:</span> ${repos[index].owner.login}</div>
      `
    );
  });
  console.log(repos);
}

name.addEventListener('keydown', (e) => {
  const nameError = document.querySelector('.name-error');
  const resultsError = document.querySelector('.search-results__error');

  if (nameError) {
    nameError.remove();
  }

  if (resultsError) {
    resultsError.remove();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formHandler(form);
});

form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    formHandler(form);
  }
});
