
/*
요약 노트:
- API 키를 상수로 선언하여 재사용성을 높임.
- URL 객체를 사용해 API 호출 주소를 생성함.
- fetch 함수를 통해 외부 API(NewsAPI)에서 데이터를 비동기적으로 가져올 수 있음.
- fetch는 Promise를 반환하므로, 데이터를 사용하려면 then/catch 또는 async/await를 활용해야 함.
- 콘솔에 URL을 출력하여 실제 호출되는 주소를 확인할 수 있음.
- 실제 데이터 활용을 위해서는 fetch의 응답(response)을 적절히 처리해야 함.
*/

// const PAGE_SIZE = 10;

// 반복 사용되는 API 키를 상수로 지정
let newsList = []; // 전역변수 선언 (다른 함수에서도 사용할 변수)

const menus = document.querySelectorAll(".menus button");
console.log("mmm",menus)
menus.forEach(menu=>menu.addEventListener("click",(event)=>{getNewsByCategory(event)}));

// async : 비동기함수
const getLatestNews = async () => {
  // url 주소
  // new: 새로 만든다
  // URL: url을 만든다
  // 개발자는 URL호출할 일이 많다..javascript는 api호출을 위한 만들어진 인스턴스가 있다.(다양한 함수와 변수르 제공함)
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
  // 궁극적 목표 : 인터넷 세계에서 url을 호출하여 데이터를 긁어오는 것.
  // fetch : 데이터를 긁어오는 함수
  const response = await fetch(url); // fetch가 끝나면 reponse를 받아올 수 가 있다.
  // **await(비동기) 은 fetch가 pending상태가 아니라 response를 받을때까지 기다려준다
  const data = await response.json();
  // 우리가 받은 response를 json형태로 뽑아내야 한다.
  // ** json으로 뽑아내는 것도 서버와의 통신이므로 await기다려야 한다

  newsList = data.articles;
  render();
  console.log("ddd", newsList);
}

// 카테고리
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log(category);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);

  const response = await fetch(url)
  const data = await response.json() //카테고리에 맞는 api요청해서 받아온 값
  console.log("ddd",data)
  newsList = data.articles; // 랜더 다시 해주기 전에 newsList를 여기서 받아온값으로 재정의
  render() //그리고 랜더 다시 해주기
  sideMenu.classList.remove("active");
}

// 키워드 검색
const getNewsKeyword = async () => {
  const keyword = document.getElementById("search-input").value;

  if(!keyword){
    return
  }
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);
  
  const response = await fetch(url)
  const data = await response.json()
  console.log("keyword", data);

  newsList = data.articles; //뉴스리스트에 보여주고 싶은 값을 담아야한다
  render()
  
}

// 말줄임
const truncate = (text) => {
  if (!text) return "내용 없음";
  let maxLength = 200;  
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// 날짜 포맷
const date = (date) => {
  return moment(date).fromNow();
}

// 랜더링
const render = () => {    
  const newsHTML = newsList.map(news => 
    `
    <div class="row news">
      <div class="col-lg-4">
        <img
        class="news-img-size"
          src=${news.urlToImage || "default.jpg"}
          alt=""
        />
      </div>
      <div class="col-lg-8 content-area">
        <h2>${news.title}</h2>
        <p>
          ${truncate(news.description) || "내용 없음"}
        </p>
        <div class="meta">
          ${news.source.name || "no source"} * ${date(news.publishedAt)}
        </div>
      </div>
    </div>
    `).join("");

  document.getElementById('news-board').innerHTML = newsHTML;
  // console.log(newsHTML);
}

getLatestNews();


// 검색인풋
const searchToggleBtn = document.getElementById("search-toggle");
const searchInput = document.getElementById("search-input");

searchToggleBtn.addEventListener("click", () => {
  searchToggleBtn.classList.toggle("active");
  searchInput.classList.toggle("active");

  if (searchInput.classList.contains("active")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
  }
});


// 모바일 메뉴
const menuToggleBtn = document.getElementById("menu-toggle");
const menuCloseBtn = document.getElementById("menu-close");
const sideMenu = document.querySelector(".menus");

menuToggleBtn.addEventListener("click", () => {
  sideMenu.classList.add("active");
});

menuCloseBtn.addEventListener("click", () => {
  sideMenu.classList.remove("active");
});


// 1. 버튼에 클릭 이벤트 주기
// 2. 카테코리별 뉴스 가져오기
// 3. 그 뉴슥를 보여주기