import { jmList, jmLine } from 'jmgraph';

/**
 * 轴
 *
 * @class jmAxis
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {string} [type] 轴类型(x/y/radar),默认为x
 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
 * @param {object} [style] 样式
 */

export default class jmMarkLine extends jmLine {
	constructor(options) {

        super(options);
        
        this.visible = false;

        this.markLineType = options.type || 'x';// 为横轴x或纵轴y  
        
        /**
        * 当前图形下的所有子图
        */
       this.shapes = new jmList();
    }
    
    // 初始化轴
    init() {        
        if(!this.visible) return;
        
        // 纵标线，中间标小圆圈
        if(this.markLineType === 'y') {
            // 重置所有图形
            let shape;
            while(shape = this.shapes.shift()) {
                shape && shape.remove();
            }

            this.changeTouchPoint();
        }
    }

    // 滑动点改变事件
    changeTouchPoint() {
        // 纵标线，中间标小圆圈
        if(this.markLineType === 'y') {
            const touchPoints = []; // 命中的数据点
            let touchChange = false;
            // chartGraph 表示图表层，有可能当前graph为操作层
            const graph = this.graph.chartGraph || this.graph;
            const isTocuhGraph = graph !== this.graph;// 不在图表图层，在操作图层的情况
            
            try {                
                
                // 查找最近的X坐标
                const findX = isTocuhGraph? (this.start.x - graph.chartArea.position.x) : this.start.x;

                // 根据线条数生成标点个数
                for(const serie of graph.series) {
                    // 得有数据描点的才展示圆
                    if(!serie.getDataPointByX) continue; 
                
                    const point = serie.getDataPointByX(findX); // 找到最近的数据点
                    if(!point) continue;

                    // 锁定在有数据点的X轴上
                    // 如果在操作图层上， 点的X轴需要加上图表图层区域偏移量
                    this.start.x = this.end.x = isTocuhGraph? (point.x + graph.chartArea.position.x): point.x;

                    for(const p of point.points) {
                        if(!p || typeof p.y === 'undefined') continue;
                        this.markArc = graph.createShape('circle', {
                            style: this.style,
                            radius: (this.style.radius || 5) * this.graph.devicePixelRatio
                        });

                        this.markArc.center.y = p.y;

                        this.children.add(this.markArc);
                        this.shapes.add(this.markArc);
                    }
                    // x轴改变，表示变换了位置
                    if(!touchChange && (!serie.lastMarkPoint || serie.lastMarkPoint.x != point.x)) touchChange = true;

                    touchPoints.push(point);
                    serie.lastMarkPoint = point;// 记下最后一次改变的点
                    
                    // 同时改变下X轴标线的位置，它的Y坐标跟随最后一个命中的线点
                    if(graph && graph.markLine && graph.markLine.xMarkLine) {
                        graph.markLine.xMarkLine.start.y = graph.markLine.xMarkLine.end.y = isTocuhGraph? (point.y + graph.chartArea.position.y): point.y;
                    }
                }
            }
            catch(e) {
                console.error(e);
            }

            // 触发touch数据点改变事件
            touchChange && setTimeout(()=>{
                    graph.emit('touchPointChange', {
                        points: touchPoints
                    });
                }, 10);
        }
    }

    /**
	 * 移动标线
	 * @param { object } args 移动事件参数
	 */
	move(args) {
        // 事件是挂在graph下的，，但此轴是放在chartArea中的。所以事件判断用graph坐标，但是当前位置要相对于chartArea
		
		if(this.visible && this.markLineType === 'x') {
            // 有操作层的情况下，相对于左上角，否则是chartarea
            if(this.graph.chartGraph) {
                if(args.position.y <= this.graph.chartGraph.chartArea.position.y) {
                    this.start.y = this.end.y = this.graph.chartGraph.chartArea.position.y;
                }
                else if(args.position.y > this.graph.chartGraph.chartArea.height + this.graph.chartGraph.chartArea.position.y) {
                    this.start.y = this.end.y = this.graph.chartGraph.chartArea.height + this.graph.chartGraph.chartArea.position.y;
                }
                else {
                    this.start.y = this.end.y = args.position.y;
                }
                this.start.x = this.graph.chartGraph.chartArea.position.x;
                this.end.x = this.start.x + this.graph.chartGraph.chartArea.width;
            }
            else {
                if(args.position.y <= this.graph.chartArea.position.y) {
                    this.start.y = this.end.y = 0;
                }
                else if(args.position.y > this.graph.chartArea.height + this.graph.chartArea.position.y) {
                    this.start.y = this.end.y = this.graph.chartArea.height;
                }
                else {
                    this.start.y = this.end.y = args.position.y - this.graph.chartArea.position.y;
                }
                this.start.x = 0;
                this.end.x = this.graph.chartArea.width;
            }

			this.needUpdate = true;
		}

		if(this.visible && this.markLineType === 'y') {
            // 有操作层的情况下，相对于左上角，否则是chartarea
            if(this.graph.chartGraph) {
                if(args.position.x < this.graph.chartGraph.chartArea.position.x) {
                    this.start.x = this.end.x = this.graph.chartGraph.chartArea.position.x;
                }
                else if(args.position.x > this.graph.chartGraph.chartArea.width + this.graph.chartGraph.chartArea.position.x) {
                    this.start.x = this.end.x = this.graph.chartGraph.chartArea.width + this.graph.chartGraph.chartArea.position.x;
                }
                else {
                    this.start.x = this.end.x = args.position.x;
                }
                this.start.y = this.graph.chartGraph.chartArea.position.y;
                this.end.y = this.start.y + this.graph.chartGraph.chartArea.height;
            }
            else {
                if(args.position.x < this.graph.chartArea.position.x) {
                    this.start.x = this.end.x = 0;
                }
                else if(args.position.x > this.graph.chartArea.width + this.graph.chartArea.position.x) {
                    this.start.x = this.end.x = this.graph.chartArea.width;
                }
                else {
                    this.start.x = this.end.x = args.position.x - this.graph.chartArea.position.x;
                }
                this.start.y = 0;
                this.end.y = this.graph.chartArea.height;
            }

            this.needUpdate = true;
		}
    }
    
    /**
     * 中止
     */
    cancel() {
        this.visible = false;
        this.needUpdate = true;
    }
}
	


