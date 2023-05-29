import {
    BACK_BASE_URL,
} from './api.js'

const container = document.querySelector('#container');
const payload = JSON.parse(localStorage.getItem('payload'));
let iso;
let previousPageUrl = null;
let nextPageUrl = `${BACK_BASE_URL}/diary/`;

function loadData(url, append = true) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const posts = data.results;

      if (!append) {
        container.innerHTML = '';
      }


      posts.forEach(post => {

        const item = document.createElement('div');
        item.classList.add('item');
        let date = new Date(post.created_at);
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');  // JS에서 월은 0부터 시작합니다.
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');

        let imageUrl = post.article_img;

        if (imageUrl == null) {
          // If the post does not have an image, use a default image
          imageUrl = 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbFtOx6%2FbtshybehTvK%2F0peatYdJqtR8Tvqfm6K6c1%2Fimg.png';
        }

        if ((post.is_private == 0) || (post.user == payload.user_id)) {
          item.innerHTML = `
        <a href="diary_detail.html?id=${post.id}"  data-title="${post.title}">
          <img src="${imageUrl}" alt="${post.title}" />
          <div class="item-info">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p>${post.user_nickname}</p>
            <p>${date}</p>
          </div>
        </a>
      `;

        } else {
          item.innerHTML = `
        <a href="diary_detail.html?id=${post.id}" data-title="${post.title}">
          <img src="${imageUrl}" alt="비공개 글입니다" />
          <div class="item-info">
            <h2>비공개 글입니다</h2>
            <p>비공개 글입니다</p>
            <p>비공개 글입니다</p>
            <p>비공개 글입니다</p>
          </div>
        </a>
      `;
        }
        container.appendChild(item);
      });

      iso = new Isotope(container, {
        itemSelector: '.item',
        layoutMode: 'masonry',
        initLayout: false,
      });

      imagesLoaded(container).on('always', function () {
        iso.arrange();
      });



      previousPageUrl =
        data.previous == null
          ? null
          : data.previous.replace("http://", "https://");
      nextPageUrl =
        data.next == null
          ? null
          : data.next.replace("http://", "https://");

    });
}
loadData(nextPageUrl, false);

document.querySelector('#previous').addEventListener('click', function () {
  if (previousPageUrl) {
    loadData(previousPageUrl, false);
  }
});

document.querySelector('#next').addEventListener('click', function () {
  if (nextPageUrl) {
    loadData(nextPageUrl, false);
  }
});