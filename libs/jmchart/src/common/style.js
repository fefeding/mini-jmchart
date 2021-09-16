
/**
 * 基础样式
 *
 * @class jmChartStyle
 * @module jmChart
 * @static
 */
export default {
	layout: 'normal',	// inside 二边不对齐Y轴，内缩一个刻度 | normal
	margin:{
		left: 40,
		top: 20,
		right: 20,
		bottom: 40
	},
	itemLabel: {
		textAlign: 'left',
		textBaseline: 'middle',
		font: '12px Arial',
		fill: '#000'
	},
	// 跟随标线
	markLine: {
		x: true, // 显示X标线
		y: true, // 显示Y标线
		stroke: '#EB792A',
		fill: '#CCC',
		lineWidth: 1,
		radius: 5, // 中间小圆圈大小
		zIndex: 20
	},
	legend: {		
		stroke: 'transparent',		
		lineWidth: 0,
		margin: {
			left: 10,
			top: 10,
			right: 20,
			bottom: 10
		},
		width: 200,
		height: 0,		
		item: {
			shape: {
				width:20,
				height:15
			},
			label: {
				textAlign: 'left',
				textBaseline: 'middle',
				font: '12px Arial',
				fill: '#000'
			},
			normal: {
				fill: 'transparent',
				cursor: 'default'
			},
			hover: {
				fill: '#ccc',
				cursor: 'pointer'
			}
		}
	},
	chartArea: {		
		stroke: 'rgb(229,229,229)',
		zIndex: 5
	},
	axis: {
		stroke:'#05468E',
		lineWidth: 1,
		zIndex: 1 ,
		// 显示网格
		grid: {
			x: true, // 是否显示网格
			y: false,
			stroke: 'rgb(229,229,229)',
			lineType: 'dotted', // 虚线，不填为实线
			dashLength: 6, //虚线条间隔，默认5
			lineWidth: 1,
			zIndex: 0
		},
		// 如果标签居中 center，则把二头的标签左边的左对齐，右边的右对齐
		align: 'normal',
		xLabel : {
			count: 5,
			length: 5,
			fill: '#000',
			stroke: '#000',
			margin: {
				left: 0,
				top: 10,
				right: 6,
				bottom: 0
			},
			textAlign: 'center',
			textBaseline: 'top',
			font: '12px Arial',
			zIndex:20,
			// 旋转角度
			rotation: {
				angle: 0,
				point : { x: 0, y: 0 }
			}
		},
		yLabel : {
			count: 5,
			length: 1,
			fill: '#000',			
			margin: {
				left: 2,
				top: 6,
				right: 8,
				bottom: 0
			},
			textAlign: 'right',
			textBaseline: 'middle',
			font: '12px Arial',
			zIndex:20,
			// 旋转角度
			rotation: {
				angle: 0,
				point : { x: 0, y: 0 }
			}
		}
	},
	// 图形样式集
	chartColors : [
		'#249FDA','#EA3B7C','#8EBC00','#309B46','#4B507E','#D8E404','#EB792A','#A00DA0'
	],
	/*tooltip: {
		'background-color': 'rgb(255,255,255)',
		'padding':'4px',
		'opacity':'0.8',
		'border':'1px solid #000',
		'box-shadow': '0 0 3px #000',
		'border-radius': '6px'
	},*/
	line : {
		normal: {
			lineWidth: 1,
			zIndex: 18,
			cursor: 'default'
		},
		hover: {
			lineWidth:4,
			//zIndex: 100,
			cursor: 'pointer'
		},
		lineWidth:1,
		zIndex: 18,
		cursor: 'default',
		radius: 3,
		fill: null,	
		showItem: false,	// 是否展示圆点
		item: {
			fill: '#fff',
			zIndex: 19
		},
		// 默认不填充，需要填满请配置{fill:'',stroke:''}
		area: false	
	},
	stackLine: {
		normal: {
			lineWidth: 1,
			zIndex: 18,
			cursor: 'default'
		},
		hover: {
			lineWidth:4,
			//zIndex: 100,
			cursor: 'pointer'
		},
		lineWidth:1,
		zIndex: 18,
		cursor: 'default',
		radius: 3,
		fill: null,	
		showItem: true,	// 是否展示圆点
		item: {
			fill: '#fff',
			zIndex: 19
		},
		// 默认不填充，需要填满请配置{fill:'',stroke:''}
		area: false	
	},
	bar : {
		normal: {
			lineWidth: 1,
			zIndex: 17,
			cursor: 'default',
			opacity: 0.8
		},
		hover: {
			lineWidth:4,
			//zIndex: 100,
			opacity: 1,
			cursor: 'pointer'
		},
		lineWidth: 1,
		// 柱子宽占比，决定了柱子相对于总宽度
		perWidth: 0.5,
		zIndex: 17,
		cursor: 'default',
		close : true,
		opacity: 0.8,
		shadow: {
			x: 1,
			y: 1,
			blur: 2,
			color: '#000'
		}
	},
	pie: {
		normal: {
			zIndex: 11,
			cursor: 'default',
			opacity: 0.8
		},
		hover: {
			//zIndex: 100,
			opacity: 1,
			cursor: 'pointer'
		},
		margin: {
			left: 10,
			top: 10,
			right: 10,
			bottom: 10
		},
		lineWidth: 1,
		zIndex: 11,
		cursor: 'default',
		close : true,
		opacity: 0.8,
		shadow: {
			x: 1,
			y: 1,
			blur: 2,
			color: '#ccc'
		}
	}
}