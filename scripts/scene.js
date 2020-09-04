makePlane(3, 1, 1, [1, 1, 1]);
makePlane(3, 1, -1, [1, 1, 1]);
makePlane(3, 0, 1, [.1, 1, .1]);
makePlane(3, 0, -1, [1, .1, .1]);
makePlane(5, 2, -1, [1, 1, 1]);
makePlane(8, 2, 1, [1, 1, 1]);
// makeSphere([1, -2, 1], [1, 1, 1], 1,0);
// makeSphere([0, -2, 2], [.5, .5, .3], .7, 1);
// makeLight([-2, 1, -6], [1, 1, .8], 1);
let p = [0, 2.9, 2];
makeLight(p, [1, 1, 1], .5, () => {
    makeBox([10, 0, 10], p, [1, 1, 1], 0);
});
// makeLight([-2, 2, 2], [0, .5, .5], .5);
makeBox([.7, 1.9, .7], [1.5, -2, 3.5], [1, 1, 1], Math.PI / 3 + .01);
makeBox([.7, 1.2, .7], [-1, -2, 1], [1, 1, 1], Math.PI / 6);
// makeBox([10, 10, 0], [0, 0, 4.9], [192 / 255, 192 / 255, 192 / 255], 0, 0);
// makeBox([10, 10, 0], [-2.9, 0, 0], [192 / 255, 192 / 255, 192 / 255], Math.PI / 2, 0);
// makeBox([10, 10, 0], [2.9, 0, 0], [192 / 255, 192 / 255, 192 / 255], Math.PI/2, 0);
// makeBox([10, 10, 0], [0, 0, -7.9], [192 / 255, 192 / 255, 192 / 255], 0, 0);
// makeBox([10, 0, 10], [0, 2.9, 0], [192 / 255, 192 / 255, 192 / 255], 0, 0);
// makeBox([10, 0, 10], [0, -2.9, 0], [192 / 255, 192 / 255, 192 / 255],0,0);
