//FPS = for,while,setinterval,requestAnimationFrame 반복문 사용

//최소넓이 1280 넓이 제작

//필요한 키코드만 keyvalue에 추가 // 키와 벨류값을 이중으로 다루기
const key = {
	keyDown : {},
	keyValue : {
		32: 'attack',
		37: 'left',
		39: 'right'
	}
}

//몬스터를 관리해줄 전체 배열
const allMonsterComProp = {
	arr: []
}

//수리검 배열 (공격키 누를시 수리검 이동)
const bulletComProp = {
	launch: false,
	arr: []
}

//가로 이동 백그라운드 지정
const gameBackground = {
	gameBox: document.querySelector('.game')
}

const gameProp = {
	//화면의 넓이
	screenWidth : window.innerWidth,
	screenHeight : window.innerHeight,
	gameOver : false
}
//이동, 키눌림 딜레이 방지 (재귀호출)
const renderGame = () => {
	//초당 약 60 FPS로 계속 호출 (키 값의 상태들을 체크하고 히어로의 움직임 값을 체크하고 변경해주면서 딜레이 없이 재생)
	hero.keyMotion();
	setGameBackground();
//수리검 배열에 길이만큼 반복하며 수리검 이동
	bulletComProp.arr.forEach((arr, i) => {
		// console.log(bulletComProp.arr.length); 수리검 반복문
		arr.moveBullet();
	});
	allMonsterComProp.arr.forEach((arr, i) => {
		arr.moveMonster();
	});
	window.requestAnimationFrame(renderGame);
	// console.log('call request'); 무한 반복 되는지 확인
}

const endGame = () => {
	gameProp.gameOver = true;
	//게임 오버시 조작키 멈춤
	key.keyDown.left = false;
	key.keyDown.right = false;
	document.querySelector('.game_over').classList.add('active');
}

const setGameBackground = () => {
	//페럴렉스 이동 값 = 히어로 이동값과 동일
	let parallexValue = Math.min(0, (hero.moveX-gameProp.screenHeight/3) * -1);

	gameBackground.gameBox.style.transform = `translateX(${parallexValue}px)`;
}

const windowEvent = () => {
	window.addEventListener('keydown', e => {
		if(!gameProp.gameOver) key.keyDown[key.keyValue[e.which]] = true;
		// console.log(key.keyValue[e.which]);
		// console.log(key.keyDown);
		// console.log('키눌림:' + e.which);
	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
		// console.log(key.keyDown);
		// console.log('키업:' + e.which);
	});
//resize 이벤트 (브라우저 크기 변경시 화면 비율 유지)
	window.addEventListener('resize', e => {
		gameProp.screenWidth = window.innerWidth;
		gameProp.screenHeight = window.innerHeight;
	})
}
//이미지 사전에 로드하기 (깜빡임 방지)
const loadImg = () => {
	const preLoadImgSrc = ['../images/ninja_attack.png', '../images/ninja_run.png'];
	//반복문 생성
	preLoadImgSrc.forEach( arr => {
		const img = new Image(); //이미지 객체 인스턴스 생성
		img.src = arr; //이미지 속성에 추가
	})
}
//class.js에 인스턴스 생성
let hero;

//프로그램에 실행할 함수 실행
const init = () => {
	hero = new Hero('.hero');
	//전체 몬스터
	allMonsterComProp.arr[0] = new Monster(700, 7777); //체력과 위치를 변경
	allMonsterComProp.arr[1] = new Monster(1500, 5555); //체력과 위치를 변경
	loadImg();
	windowEvent();
	renderGame();
}

//모든 요소 로드후 게임 실행
window.onload = () => {
	init();
}