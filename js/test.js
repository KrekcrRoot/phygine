
const phygine = new Phygine(RELEASE_MODE);


phygine.setCanvas('#canv');
phygine.setCanvasSize();
phygine.screenLimitation = PHYGINE_SCREEN_LIMIT;

// phygine.addObjects([
//     new Sphere(200, 100, COLOR_RANDOM, 10, 100),
//     new Sphere(600, 400, COLOR_RANDOM, 10, 100),
//     new Sphere(300, 400, COLOR_RANDOM, 10, 100)
// ]);

phygine.onClick( (e) => {
    phygine.add(new Sphere(e.clientX, e.clientY, COLOR_RANDOM, 10, 100));
} );

let i = 0;

function render() {

    if(!phygine.pauseMode) {
        phygine.render(PHYGINE_CLEAR);
    }

    window.requestAnimationFrame(render);
}