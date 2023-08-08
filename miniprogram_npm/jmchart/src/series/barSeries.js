import jmSeries from './series.js';


/**
 * 柱图
 *
 * @class jmBarSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmBarSeries extends jmSeries {
	constructor(options) {
		super(options);
	}
	/**
	 * 绘制当前图形
	 *
	 * @method beginDraw
	 * @for jmBarSeries
	 */
	init() {			
		//生成描点位
		const {points, dataChanged} = this.initDataPoint();				

		const len = points.length;		
		this.initWidth(len);
		
		// 是否正在动画中
		// 如果数据点多于100 个，暂时不启用动画，太慢了
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 ) && len < 100;		
		let aniIsEnd = true;// 当次是否结束动画
		const aniCount = (this.style.aniCount || 10);

		for(let i=0; i<len; i++) {
			//const label = this.xAxis.labels[i];
			const point = points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof point.y === 'undefined'  || point.y === null) {
				continue;
			}
			
			point.style.fill = this.getColor(point);
			const sp = this.addShape(this.graph.createPath(null, point.style));
			
			//绑定提示框
			//this.bindTooltip(sp, point);

			//首先确定p1和p4,因为他们是底脚。会固定
			const p1 = {x: point.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex, y: this.baseY };			
			const p4 = {x: p1.x + this.barWidth, y: p1.y };

			const p2 = {x: p1.x, y: p1.y };
			const p3 = {x: p4.x, y: p1.y };

			// 如果要动画。则动态改变高度
			if(isRunningAni) {
				const step = point.height / aniCount;
				const offHeight = step * this.___animateCounter;// 动态计算当前高度
				p2.y = p1.y - offHeight;// 计算高度

				// 当次动画完成
				if((step >= 0 && p2.y <= point.y) || (step < 0 && p2.y >= point.y)) {
					p2.y = point.y;
				}
				else {
					aniIsEnd = false;// 只要有一个没完成，就还没有完成动画
				}

				p3.y = p2.y;
			}
			else {
				p2.y = point.y;
				p3.y = point.y;					
			}

			sp.points.push(p1); 
			sp.points.push(p2); 
			sp.points.push(p3); 
			sp.points.push(p4); 

			this.createItemLabel(point);

			// 生成标点的回调
			this.emit('onPointCreated', point);
		}

		if(aniIsEnd) {			
			this.___animateCounter = 0;
		}
		else {
			this.___animateCounter++;
			// next tick 再次刷新
			this.graph.utils.requestAnimationFrame(()=>{
				this.needUpdate = true;//需要刷新
			});
		}
	}

	// 计算柱子宽度
	initWidth(count) {
		
		//计算每个柱子占宽
		//每项柱子占宽除以柱子个数,默认最大宽度为30
		const maxWidth = this.xAxis.width / count / this.graph.barSeriesCount;

		if(this.style.barWidth > 0) {
			this.barWidth = Number(this.style.barWidth);
			this.barTotalWidth = this.barWidth * this.graph.barSeriesCount;
		}
		else {
			this.barTotalWidth = (this.xAxis.width / count * (this.style.perWidth||0.4));
			this.barWidth = this.barTotalWidth / this.graph.barSeriesCount;
		}
		
		if(this.barWidth > maxWidth) {
			this.barWidth = maxWidth;
			this.barTotalWidth = maxWidth * this.graph.barSeriesCount;
		}
	}
	

	/**
	 * 在图上加下定制图形
	 * @param {jmShape} shape  图形
	 */
	 addShape(shape) {
		this.children.add(shape);
		this.shapes.add(shape);
		return shape;
	}
}