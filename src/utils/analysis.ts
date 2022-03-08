/**
 * @param {Object} properties 解析对象
 * @param {Object} level 递归层级
 */
export function parseObject(properties: any, level: number){
	let requestStr = ''
	requestStr += ''.padEnd((level-1) * 2, ' ')		
	requestStr += '{\n'
	for(let d  in properties) {
		let key1 = d as keyof typeof properties;
		let value = properties[key1] as any;
		requestStr += ''.padEnd(level * 2, ' ');
		if(value?.type === 'array'){
			requestStr += `${key1.toString()}: [\n`
			requestStr += parseObject(value?.items?.properties, level + 1)
			requestStr += ''.padEnd(level * 2, ' ')
			requestStr += `],\n`
		} else {
			requestStr += `${key1.toString()}: ${value?.type},${value?.description ? ' \/\/ ' + value?.description : ''}\n`
		}
	}
	requestStr += ''.padEnd((level-1) * 2, ' ')
	requestStr += `}\n`
	return requestStr
}