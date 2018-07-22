export const ADD_NODE       = "ADD_NODE"    //name, description
export const REMOVE_NODE    = "ADD_NODE"    //id
       let   SOME_ACTION    = "SOME_ACTION"
	   var   ANOTHER_ACTION;

export function addNode(name, description){
	return {
		type: ADD_NODE,
		name: name,
		description: description
	}
}

export function removeNode(id){
	return {
		type: REMOVE_NODE,
		id: id
	}
}

export function someAction(){
	return {
		type: SOME_ACTION
	}
}

export function anotherAction(){
	return {
		type: ANOTHER_ACTION
	}
}