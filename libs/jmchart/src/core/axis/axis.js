import  {
	jmArrowLine
} from 'jmgraph';

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

export default class jmAxis extends jmArrowLine {
	constructor(options) {		
		super(options);

		//初始化不显示箭头
		this.arrowVisible = !!options.arrowVisible;
		this.zeroBase = options.zeroBase || false;

		this.labelCount = options.labelCount || 5;
		this.type = options.type || 'x';// 为横轴x或纵轴y

		if(this.type == 'x') {
			this.dataType = options.dataType || 'string';
		}
		else {
			this.dataType = options.dataType || 'number';
		}

		this.field = options.field || '';
		this.index = options.index || 0;

		this.init(options);
	}

	// 初始化一些参数
	// 这个函数可能会重入。
	init(options) {
		options = options || {};
		// 深度组件默认样式
		if(options.style) this.graph.utils.clone(options.style, this.style, true);

		if(this.type == 'x') {
			if(typeof options.maxXValue !== 'undefined') this.maxValue = options.maxXValue; // 最大的值，如果指定了，则如果有数值比它大才会修改上限，否则以它为上限
			if(typeof options.minXValue !== 'undefined') this.minValue = options.minXValue;// 最小值，如果指定了，则轴的最小值为它或更小的值
		}
		else {
			if(typeof options.maxYValue !== 'undefined') this.maxValue = options.maxYValue; // 最大的值，如果指定了，则如果有数值比它大才会修改上限，否则以它为上限
			if(typeof options.minYValue !== 'undefined') this.minValue = options.minYValue;// 最小值，如果指定了，则轴的最小值为它或更小的值
		}
	}

	/**
	 * 轴类型(x/y/radar),默认为x
	 *
	 * @property type
	 * @type string
	 */
	type = 'x';
	
	/**
	 * 对应的字段
	 */
	field = '';

	/**
	 * 轴标签起始坐标
	 *
	 * @property labelStart
	 * @type number
	 */
	labelStart = 0;

	/**
	 * 否从0开始
	 *
	 * @property type
	 * @type bool
	 * @for jmAxis
	 */
	zeroBase = false;

	/**
	 * 显示标签个数
	 *
	 * @property labelCount
	 * @type number
	 * @for jmAxis
	 */
	labelCount = 1;

	/**
	 * 轴上的刻度，由动态计算出
	 */
	scalePoints = [];

	/**
	 * 关联访问的是chart的数据源
	 */
	get data() {
		return this.graph.data;
	}
	set data(d) {
		this.graph.data = d;
	}


	/**
	 * 计算当前轴的位置
	 * 
	 * @method reset
	 */
	reset() {	
		
		const bounds = this.graph.chartArea.getBounds();// 获取画图区域
		switch(this.type) {
			case 'x' : {	
				//初始化显示标签个数
				this.labelCount = this.style.xLabel.count || 5;
				this.start.x = bounds.left;
				this.start.y = bounds.bottom;
				this.end.x = bounds.right;
				this.end.y = bounds.bottom;	
				
				// zeroBase 时才需要移到0位置，否则依然为沉底
				if(this.graph.baseY === 0) {
					const yAxis = this.graph.yAxises[1];
					if(!yAxis) return;

					this.value = 0;
					const y = this.start.y + yAxis.min() * yAxis.step();					
					this.start.y = this.end.y = y;
				}
				break;
			}
			case 'y' : {				
				const index = this.index || 1;					
				let xoffset = bounds.left;

				//初始化显示标签个数
				this.labelCount = this.style.yLabel.count || 5;
				
				//多Y轴时，第二个为右边第一轴，其它的依此递推
				if(index == 2) {
					xoffset = bounds.right;
				}
				else if(index > 2) {
					xoffset = this.graph.yAxises[index-1].start.x + this.graph.yAxises[index-1].width + 10;
				}					
				
				this.start.x = xoffset;
				this.start.y = bounds.bottom;
				this.end.x = this.start.x;
				this.end.y = bounds.top;				
				break;
			}
		}
		this.createLabel();
	}

	// 绘制完成后，生成label标签
	draw() {
		this.points.push(...this.scalePoints);// 把刻度也画出来
		super.draw();
	}

	/**
	 * 生成轴标签
	 *
	 * @method createLabel
	 */
	createLabel() {		
		//移除原有的标签 
		this.children.each(function(i, c) {
			c.remove();
		}, true);
		
		this.labels = [];
		//如果是？X轴则执行X轴标签生成
		if(this.type == 'x') {
			this.createXLabel();
		}
		else if(this.type == 'y') {
			this.createYLabel();
		}			
	}

	/**
	 * 生成X轴标签
	 *
	 * @method createXLabel
	 * @private
	 */
	createXLabel() {
		//var max = this.max();
		//var min = this.min();
		const step = this.step();
		this.scalePoints = [];// 刻度点集合
		//最多显示标签个数
		//var count = this.style.xLabel.count || this.data.length;	
		//字符串轴。则显示每个标签	
		const format = this.option.format || this.format;
		const top = (this.style.xLabel.margin.top || 0) * this.graph.devicePixelRatio;	
		for(let i=0; i< this.data.length;i++) {	
			const d = this.data[i];
			const v = d[this.field]; 	
			
			// 不显示就不生成label。这里性能影响很大
			const text = format.call(this, v, d, i); // 格式化label
			if(!text) continue;

			/// 只有一条数据，就取这条数据就可以了	
			const w = (this.data.length === 1? 1: i) * step;

			const label = this.graph.createShape('label', {
				style: this.style.xLabel
			});
			label.data = d; // 当前点的数据结构值
			label.text = text;

			this.labels.push(label);
			this.children.add(label);

			label.width =  label.testSize().width + 2;
			label.height = 15;

			const pos = {
				x: this.labelStart + w,
				y: top
			};

			// 指定要显示网格
			if(this.style.grid && this.style.grid.y) {
				// 它的坐标是相对于轴的，所以Y轴会用负的区域高度
				const line = this.graph.createShape('line', {
					start: {
						x: pos.x,
						y: 0
					},
					end: {
						x: pos.x,
						y: -this.graph.chartArea.height
					},
					style: this.style.grid
				});
				this.children.add(line);
			}

			//在轴上画小标记m表示移至当前点开画
			this.scalePoints.push({
				x: pos.x + this.start.x,
				y: this.start.y,
				m: true
			});
			this.scalePoints.push({
				x: pos.x + this.start.x,
				y: this.start.y + (this.style.length || 5)
			});
			
			//如果进行了旋转，则处理位移
			const rotation = label.style.rotation;
			if(rotation && rotation.angle) {
				//设定旋转原点为label左上角					
				rotation.point = pos;
				//当旋转后，其原点位移至左上角，所有当前控件必须反向移位其父容器位置
				label.position = {
					x: -this.graph.chartArea.position.x,
					y: -this.graph.chartArea.position.y
				};
			}
			else {
				// 如果标签居中，则把二头的标签左边的左对齐，右边的右对齐
				if(this.style.align === 'center' && this.data.length > 1 && (
					i === 0 || i === this.data.length - 1)
				) {
					if(i === this.data.length - 1) {
						pos.x -= label.width;
					}
				}
				else {
					pos.x -=  label.width / 2;//向左偏移半个label宽度
				}
				label.position = pos;
			}
		}
	}

	/**
	 * 生成Y轴标签
	 *
	 * @method createYLabel
	 * @private
	 */
	createYLabel() {
		const max = this.max();
		const min = this.min();
		const step = this.step();
		const index = this.index || 1;
		this.scalePoints = [];// 刻度点集合

		let count = this.labelCount;
		const mm = max - min;
		/*if(mm <= 10) {
			count = mm;
		}*/
		// mm 放大10000倍，这里结果也需要除于10000
		let pervalue = (mm / count) || 1;
		//if(pervalue > 1 || pervalue < -1) pervalue = Math.floor(pervalue);		
			
		const format = this.option.format || this.format;
		const marginLeft = this.style.yLabel.margin.left * this.graph.devicePixelRatio || 0;
		const marginRight = this.style.yLabel.margin.right * this.graph.devicePixelRatio || 0;
		let p = 0;
		for(let i=0; i<count+1; i++) {
			p = min + pervalue * i;
			if(p > max || i === count) p = max;
			const h = (p - min) * step; // 当前点的偏移高度
			const label = this.graph.graph.createShape('label', {
				style: this.style.yLabel
			});
			
			label.text = format.call(this, p, label); // 格式化label
			this.labels.push(label);
			this.children.add(label);

			const w = label.testSize().width;
			const offy = this.height - h; // 刻度的偏移量
			// label的位置
			const pos = {
				x: 0,
				y: 0
			};

			//轴的宽度
			const axiswidth = marginLeft + marginRight + w;
			this.width = Math.max(axiswidth, this.width);

			//计算标签位置
			if(index <= 1) {
				
				pos.x = -w - marginRight;
				pos.y = offy - label.height / 2;

				//在轴上画小标记m表示移至当前点开画
				this.scalePoints.push({
					x: this.start.x,
					y: offy + this.end.y ,
					m: true
				});
				this.scalePoints.push({
					x:this.start.x,
					y: offy + this.end.y
				});

				// 指定要显示网格
				if(this.style.grid && this.style.grid.x) {
					// 它的坐标是相对于轴的，所以Y轴会用负的区域高度
					const line = this.graph.createShape('line', {
						start: {
							x: 0,
							y: offy
						},
						end: {
							x: this.graph.chartArea.width,
							y: offy
						},
						style: this.style.grid
					});
					this.children.add(line);
				}
			}
			else {

				pos.x = marginLeft
				pos.y = offy - label.height / 2;

				//在轴上画小标记m表示移至当前点开画
				this.scalePoints.push({
					x: this.start.x,
					y: offy + this.end.y,
					m: true
				});
				this.scalePoints.push({
					x: this.start.x,
					y: offy + this.end.y
				});
			}

			// label对齐方式
			switch(this.style.yLabel.textAlign) {
				case 'center': {
					pos.x = pos.x / 2 - w / 2;
					break;
				}
				case 'right': {
					if(index <= 1) pos.x = - axiswidth;
					else {
						// 轴在最右边时，轴宽减去label宽就是右对齐
						pos.x = axiswidth - w;
					}
					break;
				}
				// 默认就是左对齐，无需处理
				case 'left':
				default: {
					break;
				}
			}
			
			//如果进行了旋转，则处理位移
			const rotation = label.style.rotation;
			if(rotation && rotation.angle) {
				label.translate = pos;//先位移再旋转
				label.position = {x: -w / 2, y: 0};
			}
			else {							
				label.position = pos;
			}	
		}
	}

	/**
	* 获取当前轴所占宽
	*
	* @method width
	*/
	get width() {		
		if(this._width) {
			return this._width;
		}
		return Math.abs(this.end.x - this.start.x);
	}
	set width(w) {
		this._width = w;
	}

	/**
	* 获取当前轴所占高
	*
	* @method height
	*/
	get height() {
		return Math.abs(this.end.y - this.start.y);
	}
	// 这里设置高度没意义
	set height(h) {}

	/**
	* 获取或设置当前轴最大值
	*
	* @method max
	* @param {number/date/string} 当前轴的最大值
	* @return 当前轴的最大值
	*/
	max(m) {
		if(typeof m !== 'undefined') {
			//如果为0为基线，则最小值不能大于0
			if(this.dataType == 'number' && m < 0 && this.zeroBase) {
				m = 0;
			}
			this._max = this._max != null && typeof(this._max) != 'undefined'? Math.max(m, this._max) : m;	
			// 如果有指定默认最大值，则不超过它就采用它
			if(typeof this.maxValue != 'undefined') this._max = Math.max(this.maxValue, this._max);					
		}	
		//如果为字符串，则返回分类个数
		if(this.dataType == 'string' && this.data) {
			return this.data.length;
		}	

		//如果是数字类型，则在最大值基础上加一定的值
		if(this.dataType == 'number') {
			m = this._max;

			// 如果有指定默认最大值，则不超过它就采用它
			if(typeof this.maxValue != 'undefined' && m <= this.maxValue)  {
				return this.maxValue;
			}

			if(m <= 0) {
				if(m >= -10) m = 0;
				else m = -10;
			}
			else if(m > 500) {
				m = Math.ceil(m / 100);
				m = m * 100 + 100;
			}
			else if(m > 100) {
				m = Math.ceil(m / 50);
				m = m * 50 + 50;
			}
			else if(m > 10) {
				m = Math.ceil(m / 10);
				m = m * 10 + 10;
			}
			else {
				m = Math.ceil(m);
			}
			
			return m;
		}	

		return this._max;
	}

	/**
	* 获取或设置当前轴最小值
	*
	* @method max
	* @param {number/date/string} 当前轴的最小值
	* @return 当前轴的最小值
	*/
	min(m) {
		if(typeof m !== 'undefined') {
			//如果为0为基线，则最小值不能大于0
			if(this.dataType == 'number' && m > 0 && this.zeroBase) {
				m = 0;
			}
			this._min = this._min != null && typeof(this._min) != 'undefined'? Math.min(m, this._min) : m;	
			// 如果有指定默认最小值，则不小于它就采用它
			if(typeof this.minValue != 'undefined') this._min = Math.min(this.minValue, this._min);						
		}

		//如果是数字类型，则在最小值基础上减去一定的值
		if(this.dataType == 'number') {
			m = this._min;

			// 如果有指定默认最小值，则不小于它就采用它
			if(typeof this.minValue != 'undefined')  {
				return typeof m !== 'undefined'? Math.min(this.minValue, m): this.minValue;
			}

			if(m >= 0) {
				if(m <= 10) m = 0;
				else {
					m = Math.floor(m / 10) * 10 - 10;
				}
			}
			else if(m < -500) {
				m = Math.floor(m / 100);
				m = m * 100 - 100;
			}
			else if(m < -100) {
				m = Math.floor(m / 50);
				m = m * 50 - 50;
			}
			else if(m < -10) {
				m = Math.floor(m / 10);
				m = m * 10 - 10;
			}
			else {
				m = Math.floor(m);
			}
			
			return m;
		}
		//如果为字符串则返回0
		return this.dataType == 'string'? 0: this._min;
	}

	/**
	 * 清除一些属性
	 *
	 * @method clear
	 */
	clear() {
		this._min = null;
		this._max = null;
	}

	/**
	 * 计算当前轴的单位偏移量
	 *
	 * @method step
	 * @return {number} 单位偏移量
	 */
	step() {
		if(this.type == 'x') {
			const w = this.width;

			//如果排版为内联，则单位占宽减少一个单位,
			//也就是起始位从一个单位开始
			if(this.graph.style.layout == 'inside') {
				const sp =  w / this.max();	
				this.labelStart = sp / 2;
				return sp;
			}	
			else {
				this.labelStart = 0;
			}	
			let tmp = this.max() - 1;	
			if(tmp === 0) tmp = 2; // 只有一个数据的情况，就直接居中
			return w / tmp;					
				
		}		
		else if(this.type == 'y') {
			const h = this.height;
			switch(this.dataType) {					
				case 'string': {
					return h / this.max();
				}
				case 'date':
				case 'number': 
				default: {
					let tmp = Math.abs(this.max() - this.min());
					tmp = tmp || 1;
					return h / tmp;
				}
			}
		}
	}
	// 格式化标签值
	format(v, item) {
		return v + '';
	}
}
	


