
const G = 6.67 * (10 ** -11);
const earth_g = 9.80665;

//status
const SUCCESS = 200;
const OK = 300;
const ERROR = 400;
const DEVELOP_MODE = `develop`;
const RELEASE_MODE = `release`;

//render_options
const PHYGINE_CLEAR = true;
const PHYGINE_NONCLEAR = false;
const PHYGINE_SCREEN_LIMIT = true;
const PHYGINE_SCREEN_NONLIMIT = false;

// object
const OBJECT_STATIC = `static`;
const OBJECT_DYNAMIC = `dynamic`;

// color
const COLOR_RANDOM = `color_random`;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randHex(length) {
    let hexAlph = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F'];
    let hex = '';
    for(let i = 0; i < length; i++) {
        hex += hexAlph[rand(0, hexAlph.length - 1)];
    }
    return hex;
}

class Phygine {

    constructor(mode = DEVELOP_MODE) {
     
        this.canvas = null;
        this.ctx = null;
        this.mode = mode;
        this.pauseMode = false;
        this.screenLimitation = true;
        this.resizeEnable = false;
        this.resizeFunc = () => {
            this.canvas.width = document.querySelector('body').offsetWidth;
            this.canvas.height = document.querySelector('body').offsetHeight;

            for(let object of this.objects) {
                object.draw();
            }
            this.mode == DEVELOP_MODE ? this.log(`холст поменял размеры: {${this.canvas.width}, ${this.canvas.height}}`) : OK;
        };

        this.objects = [];

        this.mode == DEVELOP_MODE ? this.log(`успешная инициализация phygine`, SUCCESS) : OK;
    }

    log(msg, status = OK) {
        let date = new Date();

        let hours = date.getHours();
        if(hours < 10) hours = `0${hours}`;
        
        let minutes = date.getMinutes();
        if(minutes < 10) minutes = `0${minutes}`;

        let seconds = date.getSeconds();
        if(seconds < 10) seconds = `0${seconds}`;

        let stat = '';
        if(status == OK) stat = `log`; 
        if(status == ERROR) stat = `error`; 
        if(status == SUCCESS) stat = `success`; 
        console.log(`${hours}:${minutes}:${seconds}.${date.getMilliseconds()} | ${stat} | ${msg}`);
    }

    pause() {
        this.mode == DEVELOP_MODE ? ( this.pause ? this.log(`симуляция приостановлена`) : this.log(`симуляция возобновлена`) ) : OK;
        this.pauseMode = !this.pauseMode;
    }

    setCanvas(selector) {

        if(this.mode == DEVELOP_MODE) {

            this.canvas = document.querySelector(selector);
            this.canvas === null ? this.log(`Холст не найден`, ERROR) : this.ctx = this.canvas.getContext('2d');


        }else{
            this.canvas = document.querySelector(selector);
            this.ctx = this.canvas.getContext('2d');
        }

    }

    setCanvasSize(width = document.querySelector('body').offsetWidth, height = document.querySelector('body').offsetHeight, resize = true) {

        this.canvas.width = width;
        this.canvas.height = height;
        
        if(resize) {

            window.addEventListener('resize', this.resizeFunc);
            this.resizeEnable = true;


            this.mode == DEVELOP_MODE ? this.log(`холст создал event на размер окна браузера`) : OK;

        }else{
            
            window.removeEventListener('resize', this.resizeFunc);
            this.resizeEnable = false;

        }

    }

    onClick(func) {
        this.canvas.addEventListener('click', func);
        this.mode == DEVELOP_MODE ? this.log(`был добавлен event на холст по нажатию мыши`) : OK;
    }

    add(object, returned = true) {

        this.mode == DEVELOP_MODE ? this.log(`был добавлен физический объект под номером ${this.objects.length}`) : OK;

        object.canvas = this.canvas;
        object.ctx = this.ctx;
        object.engine = this;
        object.screenLimitation = this.screenLimitation;
        object.draw();

        this.objects.push(object);
        if(returned) return object;

    }

    addObjects(objects) {

        for(let object of objects) {
            this.add(object, false);
        }

    }

    render(clear = PHYGINE_CLEAR) {
        clear == PHYGINE_CLEAR ? this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) : OK;
        for(let object of this.objects) {
            object.tick();
        }
    }


}


/**
 * Sprite
 */

class Sprite {

    static checkWalls = true;

    constructor(x, y, color) {
        
        this.x = x;
        this.y = y;
        color == COLOR_RANDOM ? this.color = `#${randHex(6)}` : this.color = color;
        this.ctx = undefined;
        this.canvas = undefined;
        this.engine = undefined;
        this.screenLimitation = undefined;
    }

    basicMove(offsetX, offsetY) {

        this.x = this.x + offsetX;
        this.y = this.y + offsetY;

    }

    distance(spriteObject) {
        return {
            distance: Math.sqrt( (this.x - spriteObject.x) ** 2 + (this.y - spriteObject.y) ** 2 ),
            offsetX: spriteObject.x - this.x,
            offsetY: spriteObject.y - this.y
        }
    }

}


/**
 * Sprites
 */


class SphereSprite extends Sprite {

    constructor(x, y, color, radius) {

        super(x, y, color);
        this.radius = radius;
        this.type = 'Sphere';
        this.hitY = false;
        this.hitX = false;

    }

    draw() {
        this.ctx.beginPath();
            this.ctx.fillStyle = this.color;
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            this.ctx.fill();
        this.ctx.closePath();
    }

    move(offsetX, offsetY) {

        if(this.screenLimitation) {
            if(this.x + offsetX < this.radius) {
                this.x = this.radius;
                this.hitX = true;
            }else if(this.x + offsetX > this.canvas.width - this.radius) {
                this.x = this.canvas.width - this.radius;
                this.hitX = true;
            }else {
                this.hitX = false;
                this.basicMove(offsetX, 0);
            }
    
            if(this.y + offsetY < this.radius) {
                this.y = this.radius;
                this.hitY = true;
            }else if(this.y + offsetY > this.canvas.height - this.radius) {
                this.hitY = true;
                this.y = this.canvas.height - this.radius;
            }else{
                this.hitY = false;
                this.basicMove(0, offsetY);
            }
        }else{
            this.basicMove(offsetX, offsetY);
        }

        


    }

}

class Square extends Sprite {

    constructor(x, y, color, height, width) {

        super(x, y, color);
        this.height = height;
        this.width = width;
        this.type = 'Square';

    }

}


/**
 * PhysicObjects
 */


class Sphere extends SphereSprite {
    
    constructor(x, y, color, radius, density, mode = OBJECT_DYNAMIC) {

        super(x, y, color, radius);
        this.mass = (radius ** 2 * Math.PI) * density;
        this.deltaTime = 0;

        this.rigidBody = true;
        this.acceleration = {
            x: 0,
            y: 0
        };

        this.canFall = false;
        this.gravity = true;
        this.mode = mode;

    }

    push(x, y) {
        this.acceleration.x += x;
        this.acceleration.y += y;
    }

    calcPhysic() {
        
        if(this.gravity) {
            for(let object of this.engine.objects) {

                if(this != object) {

                    let dist = this.distance(object);
                    let force = (G * (this.mass * object.mass) / dist.distance);

                    this.acceleration.x += force * dist.offsetX;
                    this.acceleration.y += force * dist.offsetY;

                }


            }
        }

        // Falling
        if(this.canFall) {
            this.acceleration.y += (this.mass * earth_g);
        }

    }

    tick() {

        if(this.rigidBody) {
            if(this.mode == OBJECT_DYNAMIC) {
                this.calcPhysic();
                this.move(this.acceleration.x, this.acceleration.y);
                if(this.hitY) this.acceleration.y = 0;
                if(this.hitX) this.acceleration.x = 0;
            }
            this.draw();
        }

    }



}
