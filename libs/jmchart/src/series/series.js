
import { jmPath, jmList, jmControl } from 'jmgraph';
import utils from '../common/utils.js';

/**
 * 图形基类
 *
 * @class jmSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造线图
export default class jmSeries extends jmPath {	
	constructor(options) {
		super(options);

		this.option = options;

		this.field = options.field || options.fields || '';
		this.index = options.index || 1;
		this.legendLabel = options.legendLabel || '';
		this.___animateCounter = 0; // 动画计数		

		this.xAxis = this.graph.createXAxis(); // 生成X轴
		
		// 生成当前Y轴
		this.yAxis = this.yAxis || this.graph.createYAxis({
			index: this.index,
			format: options.yLabelFormat || this.graph.option.yLabelFormat
		});
		
		// 初始化一些参数， 因为这里有多个Y轴的可能，所以每次都需要重调一次init
		this.yAxis.init({
			field: this.field,
			minYValue: options.minYValue,
			maxYValue: options.maxYValue
		});
	}

	/**
	 * 关联访问的是chart的数据源
	 */
	get data() {
		return this.graph.data;
	}
	set data(d) {
		this.graph.data = d;
	}

	//是否启用动画效果
	get enableAnimate() {
		if(typeof this.option.enableAnimate !== 'undefined') return !!this.option.enableAnimate;
		else {
			return this.graph.enableAnimate;
		}
	}
	set enableAnimate(v) {
		this.option.enableAnimate = v;
	}

	/**
	 * 图例名称
	 *
	 * @property legendLabel
	 * @type string
	 */
	legendLabel = '';

	/**
	 * 当前图形下的所有子图
	 */
	shapes = new jmList();

	/**
	 * 关健点集合
	 */
	keyPoints = [];

	/**
	 * 标注集合
	 */
	labels = [];

	// 图绑定的属性名
	field = '';
	/**
	 * Y轴的基线跟最底层的高度
	 */
	baseYHeight = 0;
	/**
	 * Y轴基线的Y坐标
	 */
	baseY = 0;
	/**
	 * 当前基线Y的值，不给basey就会默认采用当前Y轴最小值
	 */
	baseYValue = 0;

	// 做一些基础初始化工作
	initDataPoint(...args) {
		//生成描点位
		// 如果有动画，则需要判断是否改变，不然不需要重新动画
		let dataChanged = false;
		if(this.enableAnimate) {
			// 拷贝一份上次的点集合，用于判断数据是否改变
			this.lastPoints = this.graph.utils.clone(this.dataPoints, null, true, (obj) => {
				if(obj instanceof jmControl) return obj;
			});

			// 重新生成描点
			this.dataPoints = this.createPoints(...args);
			dataChanged = utils.arrayIsChange(this.lastPoints, this.dataPoints, (s, t) => {
				return s.x === t.x && s.y === t.y;
			});

			if(dataChanged) this.___animateCounter = 0;// 数据改变。动画重新开始
		}	
		else {
			this.dataPoints = this.createPoints(...args);
		}
		return {
			dataChanged,
			points: this.dataPoints
		};
	}

	/**
	 * 根据X轴坐标，获取它最近的数据描点
	 * 离点最近的一个描点
	 * @param {number} x  X轴坐标
	 */
	getDataPointByX(x) {
		if(!this.dataPoints) return null;
		// 获取最近的那个
		let prePoint = undefined, nextPoint = undefined; // 跟上一个点和下一个点的距离，哪个近用哪个
		for(let i=0; i< this.dataPoints.length; i++) {
			const p = this.dataPoints[i];
			if(p.x == x) return p;

			// 上一个点
			if(p.x < x) {
				if(i === this.dataPoints.length - 1) return p;
				prePoint = p;
			}

			// 下一个点
			if(typeof nextPoint === 'undefined' && p.x > x) {
				// 没有上一个，只能返回这个了
				if(prePoint && x - prePoint.x < p.x - x) return prePoint;
				else return p
			}
		}
		return null;
	}

	/**
	 * 根据X轴值获取数据点
	 * @param {number} xValue  X轴值
	 */
	getDataPointByXValue(xValue) {
		if(!this.dataPoints) return null;
		
		for(let i=0; i< this.dataPoints.length; i++) {
			const p = this.dataPoints[i];
			if(p.xValue == xValue) return p;
		}
		return null;
	}

		
	/**
	 * 重置属性
	 * 根据数据源计算轴的属性
	 *
	 * @method reset
	 */
	reset() {
		// 重置所有图形
		var shape;
		while(shape = this.shapes.shift()) {
			shape && shape.remove();
		}
		
		//生成图例  这里要放到shape清理后面
		this.createLegend();

		this.initAxisValue();// 处理最大值最小值

		return this.chartInfo = {
			xAxis: this.xAxis,
			yAxis: this.yAxis
		};
	}

	// 计算最大值和最小值，一般图形直接采用最大最小值即可，有些需要多值叠加
	initAxisValue() {
		// 计算最大最小值
		// 当前需要先更新axis的边界值，轴好画图
		for(var i=0; i< this.data.length;i++) {	
			if(Array.isArray(this.field)) {
				this.field.forEach((f)=> {
					const v = this.data[i][f]; 
					this.yAxis.max(v);
					this.yAxis.min(v);
				});
			}
			else {
				const v = this.data[i][this.field]; 
				this.yAxis.max(v);
				this.yAxis.min(v);
			}

			const xv = this.data[i][this.xAxis.field]; 
			this.xAxis.max(xv);
			this.xAxis.min(xv);
		}
	}

	/**
	 * 生成序列图描点
	 *
	 * @method createPoints
	 */
	createPoints(data) {
		data = data || this.data;		
		if(!data) return;

		const xstep = this.xAxis.step();
		const minY = this.yAxis.min();
		const ystep = this.yAxis.step();

		this.baseYValue = typeof this.graph.baseY === 'undefined'? minY: (this.graph.baseY||0);
		this.baseYHeight = (this.baseYValue - minY) * ystep;// 基线的高度		
		this.baseY = this.graph.chartArea.height - this.baseYHeight;// Y轴基线的Y坐标
		// 有些图形是有多属性值的
		const fields = Array.isArray(this.field)? this.field: [this.field];

		this.dataPoints = [];
		for(let i=0;i < data.length; i++) {
			const s = data[i];
			
			const xv = s[this.xAxis.field];		

			const p = {				
				data: s,
				index: i,
				xValue: xv,
				xLabel: xv,
				points: []
			};
			
			// 这里的点应相对于chartArea
			p.x = xstep * (data.length === 1? 1: i) + this.xAxis.labelStart;			
			
			for(const f of fields) {
				const yv = s[f];
				p.yLabel = p.yValue = yv;
				// 高度
				p.height = (yv - this.baseYValue) * ystep;

				const point = {
					x: p.x,
					// 高度
					height: p.height,
					yValue: yv				
				}
				//如果Y值不存在。则此点无效，不画图
				if(yv == null || typeof yv == 'undefined') {
					point.m = p.m = true;
				}
				else {
					if(this.yAxis.dataType != 'number') {
						yv = i;
					}
					point.y = p.y = this.baseY - point.height;
				}	
				p.points.push(point);
			}		
			this.dataPoints.push(p);							
		}
		return this.dataPoints;
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend
	 */
	createLegend() {
		//生成图例前的图标
		const style = this.graph.utils.clone(this.style);
		style.fill = style.color;	
		//delete style.stroke;
		const shape = this.graph.createShape('rect',{
			style
		});
		this.graph.legend.append(this, shape);
	}

	/**
	 * 在图上加下定制图形
	 * @param {jmShape} shape  图形
	 */
	addShape(shape) {
		this.graph.chartArea.children.add(shape);
		this.shapes.add(shape);
		return shape;
	}

	/**
	 * 获取指定事件的集合
	 * 比如mousedown,mouseup等
	 *
	 * @method getEvent
	 * @param {string} name 事件名称
	 * @return {list} 事件委托的集合
	 */
	getEvent(name) {	
			
		const event = this.option? this.option[name]: null;
		if(!event) {
			return super.getEvent(name);
		}
		else {
			const events = new jmList();
			events.add(event);

			const oldevents = super.getEvent(name);
			if(oldevents) {
				events.concat(oldevents);
			}
			return events;
		}
	}
};
