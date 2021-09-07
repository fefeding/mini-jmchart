
export default {    

    /**
     * 对比二个数组数据是否改变
     * @param {Array} source 被对比的数、组
     * @param {Array} target 对比数组
     * @param {Function} compare 比较函数
     */
    arrayIsChange(source, target, compare) {
        if(!source || !target) return true;
        if(source.length !== target.length) return true;

        if(typeof compare === 'function') {
            for(let i=0; i<source.length; i++) {
                if(!compare(source[i], target[i])) return true;
            }
            return false;
        }
        else return source == target;
    }
}