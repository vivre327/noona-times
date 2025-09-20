
/*
요약 노트:
- API 키를 상수로 선언하여 재사용성을 높임.
- URL 객체를 사용해 API 호출 주소를 생성함.
- fetch 함수를 통해 외부 API(NewsAPI)에서 데이터를 비동기적으로 가져올 수 있음.
- fetch는 Promise를 반환하므로, 데이터를 사용하려면 then/catch 또는 async/await를 활용해야 함.
- 콘솔에 URL을 출력하여 실제 호출되는 주소를 확인할 수 있음.
- 실제 데이터 활용을 위해서는 fetch의 응답(response)을 적절히 처리해야 함.
*/

// *** 에러 핸들링 헷갈릴때 확인하기!!==> https://hackmd.io/@YS3WJBkRQzKk2sbRRhHyyg/S15WXh5oeg

// const API_KEY = CONFIG.NEWS_API_KEY;


// 반복 사용되는 API 키를 상수로 지정
let newsList = []; // 전역변수 선언 (다른 함수에서도 사용할 변수)

const menus = document.querySelectorAll(".menus button");
console.log("mmm",menus)
menus.forEach(menu=>menu.addEventListener("click",(event)=>{getNewsByCategory(event)}));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
// 페이지네이션을 위한 변수
let totalResults = 0
let page = 1
const pageSize = 10 //한페이지에 데이터 10개
const groupSize = 5 //변하지 않는 값들은 const....

// Code Refactor: 반복 줄이기

const getNews = async () => {
  try{
    // **궁극적 목표 : 인터넷 세계에서 url을 호출하여 데이터를 긁어오는 것.
    url.searchParams.set("page", page); //=> &page=page
    // searchParams:파라미터를 set:설정할게 "page"라는 파라미터를 page(내가만든변수1..2..)값으로! 
    url.searchParams.set("pageSize", pageSize);
    
    // fetch : 데이터를 긁어오는 함수
    const response = await fetch(url); // fetch가 끝나면 reponse를 받아올 수 가 있다.
    // **await(비동기) 은 fetch가 pending상태가 아니라 response를 받을때까지 기다려준다
    const data = await response.json();

    if(response.status === 200){
      // 200 ok이나 검색결과가 0일때
      if(data.articles.length === 0){
        throw new Error("No result for this search")
      }
      // 우리가 받은 response를 json형태로 뽑아내야 한다.
      // ** json으로 뽑아내는 것도 서버와의 통신이므로 await기다려야 한다
      console.log("ddd", data);
      newsList = data.articles;
      totalResults = data.totalResults;//페이지네이션을 위해 data의 전체갯수를 저장

      render();
      paginationRender();
    } else {
      throw new Error(data.message)
    }


  } catch (error){
    // console.log("error", error.message);
    errorRender(error.message)
  }
}


// async : 비동기함수
const getLatestNews = async () => {
  // url 주소
  // new: 새로 만든다
  // URL: url을 만든다
  // 개발자는 URL호출할 일이 많다..javascript는 api호출을 위한 만들어진 인스턴스가 있다.(다양한 함수와 변수르 제공함)
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
  getNews();
}

// 카테고리
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);

  // 카테고리에 맞는 api요청해서 받아오기
  // 랜더 다시 해주기 전에 newsList를 여기서 받아온값으로 재정의
  //그리고 랜더 다시 해주기
  // console.log("ddd",data)
  page = 1; 
  getNews();
  sideMenu.classList.remove("active");
}

// 키워드 검색
const getNewsKeyword = async () => {
  const keyword = document.getElementById("search-input").value;

  if(!keyword){
    return
  }
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);
  
  //뉴스리스트에 보여주고 싶은 값을 담아야한다
  // console.log("keyword", data);
  getNews();
  
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

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>
  `
  document.getElementById("news-board").innerHTML = errorHTML;
}

// 페이지네이션 렌더
const paginationRender = () => {
  // ***페이지네이션에 필요한 변수 정의 및 계산 ***
  // totalResults? api를 호출할때마다 data에 totalResults라는 key가 들어있었다.
  // 전역변수 : totalResults / pageSize(한페이지에뉴스10개) / page / groupSize(페이지네이션5개)
  // 지역변수 : pageGroup / lastPage / firstPage / totalPages

  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize); // 뉴스갯수 / 5 -> 페이지네이션 총 몇개?
  // 현재 페이지 그룹(pageGroup) 공식 : page / groupSize → 올림
  const pageGroup = Math.ceil(page/groupSize);
  // 마지막 페이지 공식 : pageGroup × groupSize
  let lastPage = pageGroup * groupSize;
  // 엣지케이스: 마지막 페이지가 그룹사이즈보다 작으면? lastPage = totalPage
  if(lastPage > totalPages) {
    lastPage = totalPages
  }
  // 첫번째 페이지 공식 : lastPage - (groupSize - 1)
  // 만약 lastPage - (groupSize - 1)값이 0보다 작거나같으면 무조건1로대입, 그게 아니면 lastPage - (groupSize - 1)
  const firstPage = lastPage - (groupSize - 1) <= 0? 1: lastPage - (groupSize - 1);
  
  // *** 화면에 그려주는 로직 first ~ last 까지..!!!!***
  let paginationHTML = ``;
  // <와<<버튼은 첫번째페이지가 아닐때에만 그려줌
  if (page > 1) {
    // firstPage는 속한 그룹의 첫페이지(ex.6..11..)이므로 매개변수로 1을 넘겨줘야한다.. 무조건 1페이지로 간다
      paginationHTML = `<li class="pagination-item" onclick="moveToPage(1)">
                          <a class="pagination-button button-first"></a>
                        </li>
                        <li class="pagination-item" onclick="moveToPage(${page - 1})">
                          <a class="pagination-button button-prev"></a>
                        </li>`;
    }


  // 페이지네이션은 배열이 아님. 1~5까지 숫자만 알수있는것. 배열함수 사용X => for문을 사용한다.
  // for(첫번째페이지부터;마지막페이지까지;++계속더해준다)
  for(let i = firstPage; i <= lastPage; i++){
    // 1부터 5까지 돌면서 li리스트를 계속 더해준다
    // moveToPage함수를 만들어서 클릭한 li의 i을 넘겨준다
    paginationHTML += `<li class="pagination-item" onclick="moveToPage(${i})"><a class="pagination-button ${i== page ? "active" : ""}">${i}</a></li>`
  }
  // 현재 페이지(page)가 페이지네이션 총 갯수보다 작을 때만 >, >>를 그려줌
  if (page < totalPages) {
    paginationHTML += `<li class="pagination-item" onclick="moveToPage(${page + 1})">
                        <a class="pagination-button button-next"></a>
                       </li>
                       <li class="pagination-item" onclick="moveToPage(${totalPages})">
                        <a class="pagination-button button-last"></a>
                       </li>`;
  }



  
  document.querySelector('.pagination').innerHTML = paginationHTML;



  // <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
  //   </ul>
  // </nav>
}

// 페이지네이션 클릭 함수
const moveToPage = (pageNum) => {
  console.log(pageNum);
  page = pageNum; // page가 pageNum으로 유동적으로 바뀌게
  getNews();
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