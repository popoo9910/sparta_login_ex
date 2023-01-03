const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const port = 3200;
//*json 형태의 body를 받기 위해서 작성 express 사용 '.을 통해 json()형식의 자료형을 가져온다라고 이해하면 된다'
app.use(express.json());
app.use(cookieParser());
// users 라는 데이터를 직접 할당한다. key-value로 된 json 형식이다.
const users = [
  { name: "우준호", id: "noggong", password: "1234" },
  { name: "이설인", id: "seolin", password: "asdf" },
  { name: "주민석", id: "minseok", password: "hello" },
  { name: "유희선", id: "heesun", password: "94kf" },
  { name: "한동주", id: "dongjoo", password: "vded" },
];

// API 설정
// 로그인
app.get("/login", (req, res) => {
  // {name,id,pw} 중 로그인 할 때 필요한 것 : id, pw
  const id = req.query.id;
  const password = req.query.password;

  // 유저의 id값이 일치할 경우
  const user = users.find((user) => user.id === id);
  console.log(user);

  // id 값이 일치하지만 아래 사항이 진행되지 않는다면 로그인이 되지 않음
  // 유저가 존재하지 않을 경우
  if (!user) {
    return res.send("회원가입 부탁드립니다");
  }

  // 유저의 비밀번호가 다른 경우
  if (user.password !== password) {
    return res.send("비밀번호 확인 부탁드립니다");
  }

  // 로그인이 진행되었다면 쿠키 생성
  res.cookie("user-id", user.id);
  res.send(`${users} 고객님 로그인 완료되었습니다`);
});

// 로그아웃
app.get("/logout", (req, res) => {
  // clearcookie 기능 쓰는 이유
  // 로그아웃 기능에서 쿠키를 지우는 것은 쿠키를 통해 로그인을 확인하기 때문이다.
  // 그러므로 쿠키를 지우면 쿠키에 저장된 로그인 기능이 인증이 안 되기 때문에 로그아웃이 되는 것이다.
  res.clearCookie("user-id");
  res.send("로그아웃되었습니다");
});

// 회원가입
app.get("/register", (req, res) => {
  // 회원 가입 진행 시,  query 데이터로 {id,password,name} 받음
  const id = req.query.id;
  const password = req.query.password;
  const name = req.query.name;

  // users DB안에서 ID를 찾는다. 회원가입하는 사람이 입력한 아이디와 DB 아이디가 같은지 확인
  const user = users.find((user) => user.id === id);

  /// 중복된 유저정보가 있는 경우
  if (user) {
    return res.send("중복된 아이디입니다");
  }

  // 중복된 유저가 없을 경우, 배열 맨 뒤에 정보 넣기
  // 회원가입 진행, user에다 id,password,name으로 된 값을 넣어라
  users.push({ id, password, name });

  // 유저 데이터에 추가되었는지 확인
  console.log(users);
  res.send("회원가입 되었습니다");
});

// 유저 정보 API 작성
// 로그인이 되었을 때 정상적으로 쿠키값이 있는지 확인하기 위해서
app.get("/users", (req, res) => {
  // 쿠키 값 중에 key 값이 'user-id'인 value값 요청
  const id = req.cookies["user-id"];

  // 쿠키 값 중 key값에 'user-id' 값 확인
  if (!id) {
    return res.send("로그인 진행부탁드립니다");
  }

  // user에서 user.id와 id 값이 동일한지 확인
  const user = users.find((user) => user.id === id);

  // DB에 저장된 회원 정보가 동일하지 않을 경우
  if (!user) {
    return res.send("잘못된 회원정보입니다");
  }

  // 동일한 유저 정보 시, 보내기
  res.send(user);
});

app.listen(3200, () => {
  console.log(port, "서버가 열렸어요!");
});
