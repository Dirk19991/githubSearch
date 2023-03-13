import trash from './assets/trash.svg';
import heart from './assets/heart.svg';

const form = document.querySelector('.form');
const name = document.querySelector('.name');
const comment = document.querySelector('.comment');
const userComments = document.querySelector('.user-comments');

function getData(form) {
  var formData = new FormData(form);
  const obj = {};
  for (var pair of formData.entries()) {
    obj[pair[0]] = pair[1];
  }
  return obj;
}

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function getDateString(date) {
  if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
    return `сегодня, ${new Date()
      .getHours()
      .toString()
      .padStart(2, '0')}:${new Date()
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  if (isYesterday(date)) {
    return 'вчера, 18:39';
  }

  return date.toLocaleDateString();
}

function formHandler(form) {
  const data = getData(form);

  if (!data.name || !data.comment) {
    if (!data.name) {
      name.insertAdjacentHTML(
        'afterend',
        `<div class='name-error'>
          Обязательное поле
          </div>`
      );
    }

    if (!data.comment) {
      comment.insertAdjacentHTML(
        'afterend',
        `<div class='comment-error'>
          Обязательное поле
          </div>`
      );
    }

    return;
  }
  let dateString = getDateString(new Date(data.date || Date.now()));

  userComments.insertAdjacentHTML(
    'beforeend',
    `
    <div class='user-comment'>
      <div class='user-data'>
        <div class='user-comment__name'>${data.name}</div>
        <div class='user-comment__date'>${dateString}</div>
       </div>
       <div class='user-comment__text'>${data.comment}</div>
       <div class='user-comment__icons'>
       <div class='user-comment__iconContainer like'>
       <img src=${heart} alt="heart">
       </div>
       <div class='user-comment__iconContainer trash'>
       <img src=${trash} alt="trash">
       </div>
       
       </div>
    </div>
  `
  );

  const trashIcons = document.querySelectorAll('.trash');
  trashIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      icon.closest('.user-comment').remove();
    });
  });

  const likeIcons = document.querySelectorAll('.like');
  likeIcons.forEach((icon) => {
    if (icon.classList.contains('visited')) {
      return;
    }
    icon.classList.add('visited');
    icon.addEventListener('click', () => {
      icon.classList.toggle('liked');
    });
  });

  form.reset();
}

name.addEventListener('keydown', (e) => {
  const nameError = document.querySelector('.name-error');

  if (nameError) {
    nameError.remove();
  }
});

comment.addEventListener('keydown', (e) => {
  const commentError = document.querySelector('.comment-error');

  if (commentError) {
    commentError.remove();
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
