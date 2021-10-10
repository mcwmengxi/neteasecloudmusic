const arName = (value) =>{
	return value.reduce((prev,curr,currentIndex,arr)=>{
				return prev+'/'+curr.name
		},'').slice(1)
}

const formatCount = (value)=>{
	if(value>=10000 && value < 100000000){
		value=value/1000
		return value.toFixed(1)+'万'
	}
	else if(value>=100000000){
		value= value/100000000
		return value.toFixed(1)+'亿'
	}
	else{
		return value
	}
}
const formatTime = (value)=>{
	var date = new Date(value)
	return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDay()+'日';
}

export default {
	arName,
	formatCount,
	formatTime
}