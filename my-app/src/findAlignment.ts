
export function findAlignment(hyp: string[], ref: string[], numGrid: number[][]) {
	let i = hyp.length
	let j = ref.length
	const operations: {type: string, word: string}[] = []
	
	while (i > 0 || j > 0) {
		// const curr = numGrid[i][j]
		const diag = numGrid[i-1][j-1]
		const above = numGrid[i-1][j]
		const left = numGrid[i][j-1]

		if (i > 0 && j > 0 && diag <= above && diag <= left){
			if (hyp[i-1] == ref[j-1]){
				operations.push({type: 'match', word: hyp[i-1]})
			}
			else{
				operations.push({type: 'sub', word: hyp[i-1]})
			}
			i-=1
			j-=1
			
		}
		else if (i > 0 && (j === 0 || above <= left)){
			operations.push({type: 'insert', word: hyp[i-1]})
			i-=1
		}
		else{
			operations.push({type: 'del', word: ref[j-1]})
			j-=1
		}
	}

	const sub_num = operations.filter(op => op.type === 'sub').length
	const del_num = operations.filter(op => op.type === 'del').length
	const insert_num = operations.filter(op => op.type === 'insert').length
	const wer = (sub_num + del_num + insert_num) / ref.length
	operations.reverse()
	return {
		operations, sub_num, del_num, insert_num, wer
	}
}