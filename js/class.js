//생성자 & 모션함수 생성
class Hero {
    constructor(el) {
        this.el = document.querySelector(el);
        // console.log(this.el);
        //Hero 이동 모션 (이동할 거리, 이동 속도 구하기)
        this.moveX = 0;
        this.speed = 16;
        //히어로의 방향값 초기 오른쪽을 보게 고정
        this.direction = 'right';
        //히어로의 공격력
        this.attackDamage = 10000;
        // 히어로의 탑 값(머리에서 발까지의 값 히어로 자체)
        // console.log(window.innerHeight - this.el.getBoundingClientRect().top)
        // 히어로의 바텀 값(아래의 기준값)
        // console.log(window.innerHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect.height)
        this.hpProgress = 0;
        this.hpValue = 10000;
        //백분율 값
        this.defaultHpValue = this.hpValue;
        this.realDamage = 0;
    }
    //키눌림 이벤트 체크 후 조건문 생성 (달리는 모션)
    keyMotion() {
        if (key.keyDown['left']) {
            this.direction = 'left';
            this.el.classList.add('run');
            this.el.classList.add('flip');
            // console.log(this.position().left);
            //이동
            //캐릭터 화면 안넘어가게 하기
            this.moveX = this.moveX <= 0 ? 0 : this.moveX - this.speed;
        } else if (key.keyDown['right']) {
            this.direction = 'right';
            this.el.classList.add('run');
            this.el.classList.remove('flip');
            // console.log(this.position().right);
            //이동
            this.moveX = this.moveX + this.speed;
            // console.log(this.moveX);
        }

        //공격 모션
        if (key.keyDown['attack']) {
            if (!bulletComProp.launch) {
                this.el.classList.add('attack');
                // 공격키 누를시 push메소드 이용 수리검 인스턴스를 배열에 추가
                bulletComProp.arr.push(new Bullet());
                // console.log(bulletComProp.arr.length);

                bulletComProp.launch = true;
            }
        }

        //멈춤 동작
        if (!key.keyDown['left'] && !key.keyDown['right']) {
            this.el.classList.remove('run');
        }

        if (!key.keyDown['attack']) {
            this.el.classList.remove('attack');
            bulletComProp.launch = false;

        }


        this.el.parentNode.style.transform = `translateX(${this.moveX}px)`;
    }
    //el의 위치 알아내기
    //화면 해상도의 비율이 달라질 때 흐트러짐 방지 (위치 기준 잡기) 거진 아래로 기준을 잡음
    // getBoundingClientRect()
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }

    }
    //수리검이 나타날 위치 정하기 (히어로의 위치값)
    size() {
        return {
            width: this.el.offsetWidth,
            height: this.el.offsetHeight
        }
    }
    //몬스터와 충돌시 히어로 체력 소모
    updateHp(mosterDamage) {
        this.hpValue = Math.max(0, this.hpValue - mosterDamage);
        this.hpProgress = this.hpValue / this.defaultHpValue * 100;
        // 깎인 hp/ 디폴트 hp * 100 
        const heroHpBox = document.querySelector('.state_box .hp span');
        heroHpBox.style.width = this.hpProgress + '%';
        // console.log(this.hpProgress)
        this.crash();

        if (this.hpValue === 0) {
            this.dead();
        }
    }
    //히어로의 충돌 모션 처리
    crash() {
        this.el.classList.add('crash');
        setTimeout(() => this.el.classList.remove('crash'), 400);
    }
    //죽었을 떄 모션
    dead() {
        hero.el.classList.add('dead');
        endGame();
    }

    hitDamage() {
        this.realDamage = this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1); //realDmage로 실질적인 데미지 변경
    }
}

//수리검 생성
class Bullet {
    constructor() {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'hero_bullet';
        //수리검 위치
        this.x = 0;
        this.y = 0;
        //수리검의 스피드와 이동거리
        this.speed = 30;
        this.distance = 0;
        //수리검 생성시 히어로의 방향에 따라 생성
        this.bulletDirection = 'right';
        this.init();
    }
    init() {
        //수리검이 나타날 위치 정하기 (히어로의 위치값 / 2)
        // console.log(hero.size())
        //히어로의 위차가 왼쪽을 보고 있다면 왼쪽의 값과 일치시키고 아닐시 오른쪽 값
        this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
        //히어로의 위치값이 아닌 이동한 값에 더하여 수리검이 생성되게 함
        this.x = this.bulletDirection === 'right' ? hero.moveX + hero.size().width / 2 : hero.moveX - hero.size().width / 2; //수리검 캐릭터 뒤편에서 생성
        this.y = hero.position().bottom - hero.size().height / 2;
        //수리검 생성시 히어로의 위치에서 나오게 설정
        this.distance = this.x;
        // console.log('x:' + this.x);
        // console.log('y:' + this.y);
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.parentNode.appendChild(this.el);
    }
    //수리검의 이동모션을 위한 함수
    //이동거리와 속도 더함
    moveBullet() {
        let setRotate = '';
        //수리검을 생성할 떄의 방향으로 체크되도록 hero.direction이 아닌 bulletDirection으로 변경
        if (this.bulletDirection === 'left') {
            this.distance -= this.speed;
            setRotate = 'rotate(180deg)';
        } else {
            this.distance += this.speed;
        }
        //하단으로 발사되기 때문에 y값까지 포함, 좌측을 볼 시 수리검 위치 대칭
        this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
        this.crashBullet();

    }
    //수리검의 위치값을 알아내기 위에 히어로 위치값과 동일
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }
    //화면밖으로 나갈시 수리검 이동 멈춤
    crashBullet() {
        for (let j = 0; j < allMonsterComProp.arr.length; j++) {
            //몬스터 수리검 충돌 위치, 수리검의 왼쪽 오른쪽 끝이 몬스터의 왼쪽 오른쪽 끝보다 같을때 수리검 삭제
            if (this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right) {
                this.el.remove();
                //수리검 충돌시 배열 삭제 (수리검 반복문 제어)
                for (let i = 0; i < bulletComProp.arr.length; i++) {
                    if (bulletComProp.arr[i] === this) {
                        hero.hitDamage();
                        bulletComProp.arr.splice(i, 1);
                        this.el.remove();
                        this.damageView(allMonsterComProp.arr[j]); //충돌한 몬스터 인스턴스값을 적용
                        // console.log(bulletComProp.arr)
                        allMonsterComProp.arr[j].updateHp(j);

                    }
                }
            }
        }

        if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
            for (let i = 0; i < bulletComProp.arr.length; i++) {
                if (bulletComProp.arr[i] === this) {
                    bulletComProp.arr.splice(i, 1);
                    this.el.remove();
                    // console.log(bulletComProp.arr)
                }
            }
        }
    }
    damageView(monster) {
        console.log(monster.position().left);
        //수리검과 몬스터 충돌 할 떄 호출 
        this.parentNode = document.querySelector('.game_app');
        this.textDmageNode = document.createElement('div');
        this.textDmageNode.className = 'text_damage'; //데미지를 담을 엘레먼트
        this.textDmage = document.createTextNode(hero.realDamage)
        this.textDmageNode.appendChild(this.textDmage);
        this.parentNode.appendChild(this.textDmageNode);
        let textPosition = Math.random() * -100;
        let damagex = monster.position().left + textPosition;
        let damagey = monster.position().top;


        this.textDmageNode.style.transform = `translate(${damagex}px,${-damagey}px)`
        setTimeout(() => this.textDmageNode.remove(), 500);
    }
}


// Monster
class Monster {
    //체력과 위치 변경
    constructor(positionX, hp) {
        this.parentNode = document.querySelector('.game');
        this.el = document.createElement('div');
        this.el.className = 'monster_box';
        this.elChildren = document.createElement('div');
        this.elChildren.className = 'monster';
        //몬스터 체력
        this.hpNode = document.createElement('div');
        this.hpNode.className = 'hp';
        //체력과 위치 변경
        this.hpValue = hp;
        //몬스터 체력 숫자표시
        // this.hpTextNode = document.createTextNode(this.hpValue);
        this.defaultHpValue = hp; //최초 몬스터 체력값
        //몬스터 체력 bar로 표시
        this.hpInner = document.createElement('span');
        this.progress = 0;
        //체력과 위치 변경
        this.positionX = positionX;
        this.moveX = 0;
        this.speed = 1;
        this.crashDamage = 100;
        this.init();
    }
    init() {
        this.hpNode.appendChild(this.hpInner);
        this.el.appendChild(this.hpNode);
        this.el.appendChild(this.elChildren);
        this.parentNode.appendChild(this.el);
        this.el.style.left = this.positionX + 'px';
    }
    //몬스터 위치 확인
    position() {
        return {
            left: this.el.getBoundingClientRect().left,
            right: this.el.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
        }
    }
    //몬스터 체력 
    //j를 index값으로 받는다
    updateHp(index) {
        this.hpValue = Math.max(0, this.hpValue - hero.realDamage);
        //최초 hp, 깎인 hp 백분율 구하기 & span에 대입
        this.progress = this.hpValue / this.defaultHpValue * 100
        //span에 대입
        this.el.children[0].children[0].style.width = this.progress + '%';
        // console.log(this.el.children[0].children[0])
        // this.el.children[0].innerText = this.hpValue;
        //몬스터 체력 소진시 사라지기
        if (this.hpValue === 0) {
            this.dead(index);
        }
        // console.log(this.hpValue)
    }

    dead(index) {
        this.el.classList.add('remove');
        setTimeout(() => this.el.remove(), 200);
        allMonsterComProp.arr.splice(index, 1);
        // console.log(allMonsterComProp.arr)
    }

    moveMonster() {
        //hero의 위치값을 더해 좌우로 이동시 몬스터가 특별한 이상없이 사라지고 나타나게 하고 이동값까지 빼서 몬스터를 지나쳐도 끝에서 재생성 되도록 설정
        if (this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.moveX <= 0) {
            //히어로의 위치에서 몬스터의 생성위치값을 뺴서 화면 밖으로 이동시 히어로 이동위치에서 재생성 & 스크린 넓이값을 더하여 끝에서 재생성 & hero 위치값을 빼주어 화면 중앙으로 이동해도 몬스터가 즉시 재생성
            this.moveX = hero.moveX - this.positionX + gameProp.screenWidth - hero.position().left;
        } else {
            this.moveX -= this.speed;
        }
        //우에서 좌로 이동
        this.moveX -= this.speed;
        this.el.style.transform = `translateX(${this.moveX}px)`;
        //몬스터가 왼쪽으로 지나갔는지 판별 (0으로 갔을때 판별수식 생성) + 몬스터 넓이 까지 더함
        // console.log(this.moveX + this.positionX + this.el.offsetWidth)
        this.crash();
    }
    //충돌 조건문
    crash() {
        let rightDiff = 30; //여백과 충돌 방지
        let leftDiff = 90;
        if (hero.position().right - rightDiff > this.position().left + leftDiff && hero.position().left < this.position().right) {
            // console.log('충돌');
            hero.updateHp(this.crashDamage);
        }
    }
}