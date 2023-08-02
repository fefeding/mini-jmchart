
import jmSeries from './series.js';

/**
 * K线图
 *
 * @class jmCandlestickSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmCandlestickSeries extends jmSeries {
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
			points
		}  = this.initDataPoint();	

		//去除多余的线条
		//当数据源线条数比现有的少时，删除多余的线条
		const len = points.length;
		this.initWidth(len);

		const w = this.barWidth / 2;  //实心处宽度的一半

		for(let i=0; i< len;i++) {
			const p = points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof p.y === 'undefined'  || p.y === null) {
				//prePoint = null;						
				continue;
			}

			const sp = this.addShape(this.graph.createPath([], p.style));

			const bl = {
				x: p.x - w,
				y: p.points[0].y
			};
			const br = {
				x: p.x + w,
				y: p.points[0].y
			};
			const tl = {
				x: p.x - w,
				y: p.points[1].y
			};
			const tr = {
				x: p.x + w,
				y: p.points[1].y
			};

			// 默认认为是阳线
			let tm = p.points[1];
			let bm = p.points[0];
			p.style.stroke = p.style.fill = p.style.masculineColor || 'red';

			// 开盘大于收盘，则阴线
			if(p.points[0].yValue > p.points[1].yValue) {
				p.style.stroke = p.style.fill = p.style.negativeColor || 'green';
				bl.y = br.y = p.points[1].y;
				tl.y = tr.y = p.points[0].y;

				tm = p.points[0];
				bm = p.points[1];
			}			

			sp.points.push(p.points[2], tm, tl, bl, bm, p.points[3], bm, br, tr, tm, p.points[2]);

			// 生成关健值标注
			this.emit('onPointCreated', p);
		}
	}

	// 计算实心体宽度
	initWidth(count) {
		//计算每个柱子占宽
		//每项柱子占宽除以柱子个数,默认最大宽度为30
		const maxWidth = this.xAxis.width / count;

		if(this.style.barWidth > 0) {
			this.barWidth = Number(this.style.barWidth);
		}
		else {
			this.barWidth = maxWidth * (this.style.perWidth||0.4);
		}
		
		if(this.barWidth > maxWidth) {
			this.barWidth = maxWidth;
			this.barTotalWidth = maxWidth * count;
		}
	}
}

export {
	jmCandlestickSeries
}
