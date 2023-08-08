var handler = 0;
exports.init = function (g) {
  var style = {
    stroke: 'rgb(120,20,80)',
    lineWidth: 6,
    close: true,
    zIndex: 1
  };
  style.fill = 'radial-gradient(50% 50% 0 50% 50% 50%, green 0,blue 0.2, yellow 0.8, red 1)';
  style.shadow = g.createShadow(0, 0, 20, 'rgb(255,255,255)');
  var arc = g.createShape('circle', { style: style, center: { x: '50%', y: '50%' }, width: 100, height: 100, start: 0, end: Math.PI * 2 });

  g.children.add(arc);

  style = g.util.clone(style);
  style.stroke = 'rgb(255,255,255)';
  style.close = false;
  style.zIndex = 3;
  delete style.shadow;
  delete style.fill;

  var step = Math.PI / 25;
  var bluestop = 0.5;
  var bluedir = 0;
  var yellowstop = 0.8;
  var yellowdir = 0;
  var childarc = g.createShape('arc', { style: style, center: { x: arc.width / 2, y: arc.height / 2 }, start: 0, end: Math.PI / 3, radius: arc.width / 2, anticlockwise: false });

  style = g.util.clone(style);
  style.close = true;
  style.lineWidth = 1;
  style.fill = 'red';
  style.zIndex = 4;
  //var harc = g.createShape('harc', { style: style, center: { x: 600, y: 380 }, start: 0, end: 0, minRadius: 100, maxRadius: 150, anticlockwise: false });
  //g.children.add(harc);

  function arcAni() {
    var s = childarc.startAngle + step;
    var e = childarc.endAngle + step;
    if (s > Math.PI * 2) {
      s = 0;
      e = Math.PI / 3;
    }
    childarc.startAngle = s;
    childarc.endAngle = e;
    //harc.endAngle = s;


    if (bluestop >= yellowstop) {
      bluedir = 1;
      //return false;
    }
    else if (bluestop < 0.1) {
      bluedir = 0;
    }
    bluestop = bluedir == 0 ? bluestop + 0.01 : bluestop - 0.01;

    arc.style.fill = 'radial-gradient(50% 50% 0 50% 50% 50%, green 0,blue ' + bluestop.toFixed(2) + ', yellow ' + yellowstop.toFixed(2) + ', red 1)';
    g.needUpdate = true;
    handler = setTimeout(arcAni, 50);
  }
  arc.children.add(childarc);
  arcAni();
  arc.canMove(true);
}

exports.destory = function () {
  if (handler) clearTimeout(handler);
}