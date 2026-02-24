export function fillGrid(hyp: string[], ref: string[]): number[][] {
	const numGrid: number[][] = []
	for(let i=0; i<=hyp.length; i++){ 
		numGrid[i] = []
	 	for (let j=0; j<=ref.length; j++){
	   		if (i==0){
	     		numGrid[i][j]=j 
	   		} else if (j==0) {
	   			numGrid[i][j]=i
	   		} 
	     	else {
	     		if (hyp[i-1]!==ref[j-1]){
	     			numGrid[i][j]= Math.min(numGrid[i-1][j],numGrid[i][j-1],numGrid[i-1][j-1])+1
	     		}
	     		else{
	     			numGrid[i][j]= numGrid[i-1][j-1]
	     		}
	     	}
	    }
	}
	console.log(numGrid)
	return numGrid
}
