
/* Javascript의 동작 원리 이해하기!!!!!! ㅠㅠ 밤 12시다, 괴롭지만 이해하고 자스랑 친해지자 */
// console.log(1)

// ***동기적 프로그래밍 : 순서대로 실행
// function test(){
  //   console.log(2)
  //   console.log(3)
  // }
  
  // test();
  
// ***비동기적 프로그래밍
// 알바 : 쓰레드 (Call Stack)
// 일하는 알바 한 명 : 싱글 쓰레드
// 바쁠때 자스가 부르는 아웃소싱 알바생 : 브라우저 쓰레드 (처리하는 목록: Ajax, fetch, setTimeout, eventhandler)
// Event Loop : 자바스크립트 엔진과 브라우저 사이에서 눈치 보는 애, 가교 역할

// *아메1잔(console) - 라떼100잔(setTimeout 5000ms) - 아메1잔(console)*
// 1. 알바가 아메1잔 출력
// 2. 알바가 라떼100잔 주문을 받으면, setTimeout인걸 보고 브라우저 알바생에게 넘김
//    2-1. 5초가 지나면 console.log(2)를 Task Queue에 보관
//    2-2. Task Queue는 자스 알바생을 지켜보다가 Call Stack이 놀고 있으면 console.log(2)를 넘김
//    2-3. 눈치보는 Event Loop : "자스야 할 일 다 끝났니? 이제 보내도 되니?"
//    2-4. 싱글 쓰레드(Call Stack)알바생은 console.log(2)를 출력
// 3. 알바가 다시 세번째 손님인 아메1잔 출력
// 출력 결과 :  1 - 3 - 2
console.log(1)

setTimeout(() => console.log(2), 5000);

console.log(3)


// 스택은 드럼통이다.. 아래부터 잘 쌓인다. 나갈때는 위부터.. LIFO 다


/*
메모리 힙(Memory Heap)과 콜 스택(Call Stack) 시각화

// 메모리 힙: 변수, 객체 등 데이터가 저장되는 공간
// 콜 스택: 실행 중인 함수(실행 컨텍스트)가 쌓이는 공간

// 예시 코드 실행 시점의 콜 스택 변화
// ------------------------------------------
// |         Call Stack                      |
// ------------------------------------------
// | getLatestNews()   <- 함수 실행 중        |
// | global()          <- 전역 실행 컨텍스트   |
// ------------------------------------------

// 메모리 힙 예시
// ------------------------------------------
// |         Memory Heap                     |
// ------------------------------------------
// | API_KEY: "5f611b8f8f4d439b8173ebfc3f25145b" |
// | url: URL 인스턴스 객체                     |
// | response: Promise 객체                     |
// ------------------------------------------
*/

const API_KEY = `5f611b8f8f4d439b8173ebfc3f25145b`;
// 반복 사용되는 API 키를 상수로 지정

function getNews(){
  // 1. URL 설정
  let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

  // 2. URL 프린트
  console.log("uuu", url);
  
  // 3. fetch URL의 주소로 "야 나 데이터 좀 줘 ~~!" 요청
  const response = fetch(url);

  // 4. fetch를 통해 결과물 response를 받으면 출력
  console.log("rrr", response)
}

// 5. 함수 실행 후에
getNews();
// 6. for문을 통해 실행
for (let i = 0; i < 20; i++) {
  console.log("after", i);
}

// *** A. 예상 결과 : URL 설정 -> fetch 요청 -> response결과 -> 결과 호출됨
//        response결과가 pending으로 출력됨. (아직 결과가 안왔어!)