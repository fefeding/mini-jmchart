import {
	jmControl
} from 'jmgraph';
import jmSeries from './series.js';

/**
 * 雷达图
 *
 * @class jmRadarSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmRadarSeries extends jmSeries {
	constructor(options) {
		super(options);
	}

    // 重新生成轴，雷达图只需要Y轴即可
    createAxises(center, radius) {
        
        this.axises = [
            this.yAxis
        ];

        const yCount = this.field.length;
        if(!yCount) return;        
        
        //每个维度点的角度
        const rotateStep = Math.PI * 2 / yCount;

        // 清空除了一个默认外的所有Y轴
        for(let index in this.graph.yAxises) {
            const axis = this.graph.yAxises[index];
            if(!axis || axis === this.yAxis) continue;
            axis.remove();
            delete this.graph.yAxises[index];
        }

        for(let index=0; index < yCount; index++) {
            if(!this.field[index]) continue;
            let axis = this.yAxis;
            // 除了默认的y轴外，其它都重新生成
            if(index > 0) {             
                axis = this.graph.createYAxis({
                    index: index + 1,
                    format: this.option.yLabelFormat || this.graph.option.yLabelFormat
                });
                this.axises.push(axis);
            }
            const rotate = Math.PI/2 + rotateStep * index; //从向上90度开始
            axis.init({
                field: this.field[index],
                radarOption: {
                    center,
                    radius,
                    yCount,
                    rotate: rotate,
                    cos: Math.cos(rotate),
                    sin: Math.sin(rotate)
                }                
            });
              
        }

        // x轴初始化
        this.xAxis.init({
            radarOption: {
                center,
                radius,
                yCount,
                yAxises: this.axises
            }                
        });

        return this.axises;
    }

    // 计算最大值和最小值，一般图形直接采用最大最小值即可，有些需要多值叠加
	initAxisValue() {
        this.center = { 
			x: this.graph.chartArea.width / 2, 
			y: this.graph.chartArea.height / 2
		};
		
		this.radius = Math.min(this.center.x - this.style.margin.left - 
			this.style.margin.right,
			this.center.y - this.style.margin.top - this.style.margin.bottom);
		
        const axises = this.createAxises(this.center, this.radius);// 重置所有轴
		// 计算最大最小值
		// 当前需要先更新axis的边界值，轴好画图
		for(let i=0; i< this.data.length;i++) {				
            axises.forEach((axis)=> {
                const v = this.data[i][axis.field]; 
                axis.max(v);
                axis.min(v);
            });
		}
	}

	// 重新初始化图形
	init() { 
		//生成描点位
		// super.init会把参数透传给 createPoints
		const { points, dataChanged }  = this.initDataPoint(this.center, this.radius);	

		// 是否正在动画中
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 );
		
        const aniCount = (this.style.aniCount || 20);
        let aniIsEnd = true;// 当次是否结束动画
        const len = points.length;
        const shapeMap = {};
        const self = this;

        for(let i=0; i<len; i++) {
            const p = points[i];
            let shape = shapeMap[p.index]; 
            if(!shape) {
                shape = shapeMap[p.index] = this.graph.createShape('path', {
                    ...p,
                    style: p.style,
                    points: [],
                });
                this.addShape(shape);
    
                // 如果有点击事件
                if(this.option.onClick) {
                    shape.on('click', function(e) {
                        return self.option.onClick.call(this, e);
                    });
                }
                if(this.option.onOver) {
                    shape.on('mouseover touchover', function(e) {
                        return self.option.onOver.call(this, e);
                    });
                }
                if(this.option.onLeave) {
                    shape.on('mouseleave touchleave', function(e) {
                        return self.option.onLeave.call(this, e);
                    });
                }
                this.createLegend(p);
            }

            shape.zIndex += p.radius / this.radius;// 用每个轴占比做为排序号，这样占面积最大的排最底层
            let point = null;
            // 在动画中，则一直刷新
            if(isRunningAni) {
                let step = p.radius / aniCount * this.___animateCounter;
                if(step >= p.radius) {
                    step = p.radius;
                }
                else {
                    aniIsEnd = false;
                }
                point = {
                    ...p,
                    x: this.center.x + p.axis.radarOption.cos * step,
                    y: this.center.y - p.axis.radarOption.sin * step,
                };            
            }
            else {
                point = p;
            }
            shape.points.push(point);
            this.createLabel(point);// 生成标签
        }
        // 所有动画都完成，则清空计数器
        if(aniIsEnd) {
            this.___animateCounter = 0;
        }
        else {
            this.___animateCounter ++;
            // next tick 再次刷新
            this.graph.utils.requestAnimationFrame(()=>{
                this.needUpdate = true;//需要刷新
            });
        }
	}

	/**
	 * 生成序列图描点
	 *
	 * @method createPoints
	 */
	createPoints(center, radius) {		
		if(!this.data || !this.axises) return [];
        center = center || this.center;
        const points = [];

		for(var i=0;i< this.data.length;i++) {
			const s = this.data[i];
            const style = this.graph.utils.clone(this.style);
			if(style.color && typeof style.color === 'function') {
                style.stroke = style.color.call(this, {
                    data: s,
                    index: i
                });
            }
            else {
                style.stroke = this.graph.getColor(i);
            }
            if(typeof style.fill === 'function') {
                style.fill = style.fill.call(this, style);
            }
            else {
                const color = this.graph.utils.hexToRGBA(style.stroke);
                style.fill = `rgba(${color.r},${color.g},${color.b}, 0.2)`;
            }

            const shapePoints = [];
            for(const axis of this.axises) {
                if(!axis || !axis.field) continue;
                const yv = s[axis.field];

                const p = {
                    x: center.x,
                    y: center.y,
                    index: i,
                    radius: 0,
                    data: s,                
                    yValue: yv,
                    yLabel: yv,
                    style,
                    axis
                };
                shapePoints.push(p);

                //如果Y值不存在。则此点无效，不画图
                if(yv == null || typeof yv == 'undefined') {
                    continue;
                }

                p.radius = Math.abs(yv - axis.min()) * axis.step();
                p.x = center.x + axis.radarOption.cos * p.radius;
                p.y = center.y - axis.radarOption.sin * p.radius;

                // 生成标点的回调
				this.emit('onPointCreated', p);	
            }
			points.push(...shapePoints);
		}
		
		return points;
	}

	// 生成图的标注
	createLabel(point) {
		if(this.style.label && this.style.label.show === false) return;

		const text = this.option.itemLabelFormat?this.option.itemLabelFormat.call(this, point): point.yValue;
		if(!text) return;
		
		// v如果指定了为控件，则直接加入
		if(text instanceof jmControl) {
			this.addShape(text);
			return text;
		}
		const self = this;
		const label = this.graph.createShape('label', {
			style: this.style.label,
			text: text,            
            point,
			position: function() {
                const p = {
                    x: this.option.point.x,
                    y: this.option.point.y
                }
                if(p.x < self.center.x) {
                    p.x -= this.width;
                }
                
                if(p.y < self.center.y) {
                    p.y -= this.height;
                }
				return p;
			}
		});

		this.addShape(label);
	}
}



/**
 * 生成图例
 *
 * @method createLegend	 
 */
 jmRadarSeries.prototype.createLegend = function(point) {
	if(!point) return;
	
    //生成图例前的图标
    const style = this.graph.utils.clone(point.style);
    
    //delete style.stroke;
    const shape = this.graph.createShape('rect',{
        style: style,
        position : {x: 0, y: 0}
    });
    //此处重写图例事件
    this.graph.legend.append(this, shape, {
        name: this.legendLabel, 
        data: point.data
    });
}

