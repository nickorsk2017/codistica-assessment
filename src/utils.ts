export const loopTree = (start, graph) => {
    let queue = [start];
    let visited = new Set();
    let result = [];
    
    while(queue.length){
      const vertex = queue.shift();
      
      if(!visited.has(vertex)){
         visited.add(vertex);
         result.push(vertex);
        
         for(let child of graph[vertex]){
           queue.push(child);
         }
      }
      
    }
    
    return result;
  }