
import jmSeries from './series.js';

/**
 * 图形基类
 *
 * @class jmLineSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmLineSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.line;
		super(options);

		//this.on('beginDraw', this[PreDrawKey]);
	}

	/**
	 * 绘制图形前 初始化线条
	 *
	 * @method preDraw
	 * @for jmLineSeries
	 */
	init() {
		//生成描点位
		const {
			points, 
			dataChanged
		}  = this.initDataPoint();	

		//去除多余的线条
		//当数据源线条数比现有的少时，删除多余的线条
		const len = points.length;

		//设定其填充颜色
		//if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	
		this.style.stroke = this.style.color;
		//是否启用动画效果
		//var ani = typeof this.enableAnimate === 'undefined'? this.graph.enableAnimate: this.enableAnimate;
		this.style.item.stroke = this.style.color;

		// 是否正在动画中
		// 如果数据点多于100 个，暂时不启用动画，太慢了
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 );

		let shapePoints = []; // 计算出来的曲线点集合	
		const aniCount = (this.style.aniCount || 10);
		const aniStep = Math.floor(len / aniCount) || 1;// 每次动画播放点个数

		for(let i=0; i< len;i++) {
			const p = points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof p.y === 'undefined'  || p.y === null) {
				//prePoint = null;						
				continue;
			}

			if(isRunningAni) {
				if(i > this.___animateCounter) {
					break;
				}
			}

			// 是否显示数值点圆
			if(this.style.showItem) {
				this.createPointItem(p);
			}
			// 平滑曲线
			if(this.style.curve) {
				shapePoints = this.createCurePoints(shapePoints, p);
			}
			// 如果是虚线
			else if(this.style.lineType === 'dotted') {
				shapePoints = this.createDotLine(shapePoints, p);
			}

			shapePoints.push(p);

			this.createItemLabel(p);

			// 生成关健值标注
			this.emit('onPointCreated', p);
		}

		// 如果所有都已经结束，则重置成初始化状态
		if(this.___animateCounter >= len - 1) {
			this.___animateCounter = 0;
		}
		else if(isRunningAni) {	
			this.___animateCounter += aniStep;		
			// next tick 再次刷新
			this.graph.utils.requestAnimationFrame(()=>{
				this.needUpdate = true;//需要刷新
			});
		}

		this.points = shapePoints;
		this.createArea(shapePoints);// 仓建区域效果
	}

	// 生成点的小圆圈
	createPointItem(p) {
		const pointShape = this.graph.createShape('circle', {
			style: this.style.item,
			center: p,
			radius: this.style.radius || 3
		});
	
		pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;	
		return this.addShape(pointShape);
	}

	// 根据上下点生成平滑曲线
	createCurePoints(shapePoints, p) {
		const startPoint = shapePoints[shapePoints.length - 1];
		if(startPoint && startPoint.y != undefined && startPoint.y != null) {
			//如果需要画曲线，则计算贝塞尔曲线坐标				
			const p1 = {x: startPoint.x + (p.x - startPoint.x) / 5, y: startPoint.y};
			const p2 = {x: startPoint.x + (p.x - startPoint.x) / 2, y: p.y - (p.y - startPoint.y) / 2};
			const p3 = {x: p.x - (p.x - startPoint.x) / 5, y: p.y};

			//圆滑线条使用的贝塞尔对象
			this.__bezier = this.__bezier || this.graph.createShape('bezier');
			this.__bezier.cpoints = [
				startPoint,
				p1,
				p2,
				p3,
				p
			];//设置控制点

			const bzpoints = this.__bezier.initPoints();
			shapePoints = shapePoints.concat(bzpoints);					
		}
		return shapePoints;
	}

	// 生成虚线
	createDotLine(shapePoints, p) {
		const startPoint = shapePoints[shapePoints.length - 1];
		if(startPoint && startPoint.y != undefined && startPoint.y != null) {
			//使用线条来画虚线效果
			this.__line = this.__line || this.graph.createShape('line', {
				style: this.style,						
			});	
			this.__line.start = startPoint;
			this.__line.end = p;			

			const dots = this.__line.initPoints();
			shapePoints = shapePoints.concat(dots);					
		}
		return shapePoints;
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend	 
	 */
	createLegend() {
		
		//生成图例前的图标
		var style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		var shape = this.graph.createShape('path',{style:style});
		
		if(this.curve || this.style.curve) {
			var p1 = {x:0,y: this.graph.style.legend.item.shape.height};
			var p2 = {x:this.graph.style.legend.item.shape.width / 3,y:this.graph.style.legend.item.shape.height/3};
			var p3 = {x:this.graph.style.legend.item.shape.width / 3 * 2,y:this.graph.style.legend.item.shape.height/3*2};
			var p4 = {x:this.graph.style.legend.item.shape.width,y:0};	

			this.__bezier = this.__bezier || this.graph.createShape('bezier');
			this.__bezier.cpoints = [
				p1,p2,p3,p4
			];//设置控制点		

			shape.points = this.__bezier.initPoints();
		}
		else {
			shape.points = [{
				x:0,y: this.graph.style.legend.item.shape.height/2
			},{
				x: this.graph.style.legend.item.shape.width,y: this.graph.style.legend.item.shape.height/2
			}];
		}
		this.graph.legend.append(this, shape);
	}

	// 生成布效果
	createArea(points, needClosePoint = true) {
		// 有指定绘制区域效果才展示
		if(!this.style.area || points.length < 2) return;

		const start = points[0];
		const end = points[points.length - 1];

		const style = this.graph.utils.clone(this.style.area, {}, true);
		// 连框颜色如果没指定，就透明
		style.stroke = style.stroke || 'transparent';

		if(!style.fill) {
			const color = this.graph.utils.hexToRGBA(this.style.stroke);
			style.fill = `linear-gradient(50% 0 50% 100%, 
				rgba(${color.r},${color.g},${color.b}, 0) 1,
				rgba(${color.r},${color.g},${color.b}, 0.1) 0.7, 
				rgba(${color.r},${color.g},${color.b}, 0.3) 0)`;
		}
		else if(typeof style.fill === 'function') {
			style.fill = style.fill.call(this, style);
		}
		const area = this.graph.createShape('path', {
			points: this.graph.utils.clone(points, true),
			style,
			width: this.graph.chartArea.width,
			height: this.graph.chartArea.height
		});

		// 在点集合前后加上落地到X轴的点就可以组成一个封闭的图形area
		if(needClosePoint) {
			area.points.unshift({
				x: start.x,
				y: this.baseY
			});
			area.points.push({
				x: end.x,
				y: this.baseY
			});
		}

		this.addShape(area);
	}
}

export {
	jmLineSeries
}
