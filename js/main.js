

/**
 * Тестируем phygine
 */


const phygine = new Phygine();

phygine.setCanvas('#canv');
phygine.setCanvasSize();

let woodDensity = 100;

phygine.addObjects([
    new Sphere(600, 600, COLOR_RANDOM, 15, woodDensity, OBJECT_STATIC),
    new Sphere(600, 300, COLOR_RANDOM, 4, woodDensity),
    new Sphere(600, 50, COLOR_RANDOM, 4, woodDensity),
]);

phygine.objects[1].acceleration.x = 3;
phygine.objects[2].acceleration.x = 1;


function render() {
 
    if(!pause) {
        phygine.render(PHYGINE_CLEAR);
    }

    window.requestAnimationFrame(render);
}