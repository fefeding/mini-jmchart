var handler = 0;
var curPos = {x: 100, y: 100};

exports.init = function (g) {
    curPos = {x: 100, y: 100};
    const items = createItems(g, 100); 

    g.on('touchmove mousemove', (e) => {
        curPos.x = e.position.x;
        curPos.y = e.position.y;
    });

    //实时更新画布
    function update() {
        startPso(g, items);
        setTimeout(()=>{
            g.requestAnimationFrame(update);
        }, 50);
    }
    update();
}

exports.destory = function () {
  if (handler) clearTimeout(handler);
}

const pso = {
    c1: 2,
    c2: 2,
    w: 0.6,
    velocity:function (pBest, gBest, present, velocity) {
        let v = velocity||{x:0,y:0};
        v.x = this.w*v.x + this.c1*Math.random()*(pBest.x - present.x) + this.c2*Math.random()*(gBest.x - present.x);
        v.y = this.w*v.y + this.c1*Math.random()*(pBest.y - present.y) + this.c2*Math.random()*(gBest.y - present.y);
        return v;
    },
    present:function ( velocity,present) {
        let p = present||{x:0,y:0};
        p.x = p.x + velocity.x;
        p.y = p.y + velocity.y;
        return p;
    },
    gBest:function (arr,goal) {
        let gBest = {
            x: Number.POSITIVE_INFINITY,
            y: Number.POSITIVE_INFINITY
        };
        arr.forEach(function (item) {
          if(Math.abs(goal.x-gBest.x) > Math.abs(goal.x-item.present.x)){
              gBest.x = item.present.x
          }
          if(Math.abs(goal.y-gBest.y) > Math.abs(goal.y-item.present.y)){
              gBest.y = item.present.y
          }
        });
        return gBest
    }
};

function startPso(graph, items) {  
    items = items || createItems(graph, 200);      
    const gBest = pso.gBest(items, curPos);
    for(let i = 0;i < items.length;i++){
        items[i].velocity = pso.velocity(items[i].present, gBest, items[i].present, items[i].velocity);
        items[i].present = pso.present(items[i].velocity, items[i].present);
    }
    graph.needUpdate = true;
}

function createItems(graph, count) {
    var style = {				
        lineWidth:1,
        close:true,
        //stroke:'#fff',
        fill:'#05a2e2'
    };		
    let radius = 2;
            
    let items = [];
    for(let i=0; i<count; i++) {

        var styletmp = graph.util.clone(style);
        styletmp.fill = graph.createRadialGradient(radius, radius, 0, radius, radius, radius);
        var rr1 = Math.floor(Math.random() * 255);
        var gg1 = Math.floor(Math.random() * 255);
        var bb1 = Math.floor(Math.random() * 255);
        var rr2 = Math.floor(Math.random() * 255);
        var gg2 = Math.floor(Math.random() * 255);
        var bb2 = Math.floor(Math.random() * 255);
        styletmp.fill.addStop(0, graph.util.toColor(rr1,gg1,bb1));
        styletmp.fill.addStop(1, graph.util.toColor(rr2,gg2,bb2));

        let pos = {
                x: Math.random() * graph.width,
                y: Math.random() * graph.height
            };
        let shape = graph.createShape('arc',{style: styletmp, center: pos, radius: radius, anticlockwise:true});
        graph.children.add(shape);
        items.push({
            velocity:{
                x:0,
                y:0
            },
            present: pos,
            shape: shape
        });
    } 
    return items;       
}