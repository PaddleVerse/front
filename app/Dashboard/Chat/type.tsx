export type message = {
	id: number,
	message: string,
	sender: string,
	time: Date
}

export type channel = {
	id: number,
	name: string,
	messages: message[]
}

export type conversation = {
	id: number,
	messages: message[]
}