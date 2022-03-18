/**
 * @param {Object} properties 解析对象
 * @param {Object} level 递归层级
 */
export function parseObject(properties: any, level: number, required: Array<string>){
	let requestStr = '', spaces = ''.padEnd((level-1) * 2, ' ')
	// console.log(level, properties)
	requestStr += spaces
	requestStr += '{\n'
	for(let d  in properties) {
		let key1 = d as keyof typeof properties;
		let value = properties[key1] as any;
		requestStr += ''.padEnd(level * 2, ' ');
		const isRequired = required ? required.find(v => v === key1.toString()) : false
		// console.log(required, key1.toString())
		if(value?.type === 'array'){
			requestStr += `${key1.toString()}: \n`
			requestStr += parseObject(value?.items?.properties, level + 1, value?.items?.required)
			// requestStr += ''.padEnd(level * 2, ' ')
			requestStr += `[],\n`
		} else if (value?.type === 'object') {
			requestStr += `${key1.toString()}: \n`
			requestStr += parseObject(value?.properties, level + 1, value?.required)
			requestStr += `\n`
		} else {
			// console.log(value)
			requestStr += `${key1.toString()}${!isRequired?'?': ''}: ${value?.type},${value?.description ? ' \/\/ ' + value?.description : ''}\n`
		}
	}
	requestStr += spaces
	requestStr += `}`
	// console.log(level, properties)
	return requestStr
}