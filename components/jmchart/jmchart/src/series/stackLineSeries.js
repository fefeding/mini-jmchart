
import jmLineSeries from './lineSeries.js';

/**
 * 二条线组成的区域图表
 *
 * @class jmStackLineSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmStackLineSeries extends jmLineSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.stackLine;
		super(options);
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

		let startShapePoints = []; // 计算出来的曲线点集合	
		let endShapePoints = []; // 计算出来的曲线点集合
		const aniCount = (this.style.aniCount || 10);
		const aniStep = Math.floor(len / aniCount) || 1;// 每次动画播放点个数

		for(let i=0; i< len;i++) {
			const p = points[i];			

			if(isRunningAni) {
				if(i > this.___animateCounter) {
					break;
				}
			}

			// 是否显示数值点圆
			if(this.style.showItem) {
				this.createPointItem(p.points[0]);
				this.createPointItem(p.points[1]);
			}
			// 平滑曲线
			if(this.style.curve) {
				startShapePoints = this.createCurePoints(startShapePoints, p.points[0]);
				endShapePoints = this.createCurePoints(endShapePoints, p.points[1]);
			}
			// 如果是虚线
			else if(this.style.lineType === 'dotted') {
				startShapePoints = this.createDotLine(startShapePoints, p.points[0]);
				endShapePoints = this.createDotLine(endShapePoints, p.points[1]);
			}

			startShapePoints.push(p.points[0]);
			endShapePoints.push(p.points[1]);
			

			// 生成标点的回调
			this.emit('onPointCreated', p);
		}

		// 如果所有都已经结束，则重置成初始化状态
		if(this.___animateCounter >= len - 1) {
			this.___animateCounter = 0;
		}
		else if(isRunningAni) {	
			this.___animateCounter += aniStep;		
			// next tick 再次刷新
			setTimeout(()=>{
				this.needUpdate = true;//需要刷新
			});
		}
		if(endShapePoints.length) endShapePoints[0].m = true;// 第二条线重新开始画
		this.points = startShapePoints.concat(endShapePoints);	
		// 仓建区域效果  这里的endShapePoints要倒过来画，才能形成一个封闭区域
		const areaPoints = startShapePoints.concat(endShapePoints.reverse());
		const areaEnd = areaPoints[areaPoints.length - 1] = this.graph.utils.clone(areaPoints[areaPoints.length - 1]);
		areaEnd.m = false;
		this.createArea(areaPoints, false);
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
}

export {
	jmStackLineSeries
}
