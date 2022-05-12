export interface SearchSuggestion {
	status: number
	message: string
	count: number
	data: Datum[]
	request_id: string
}

export interface Datum {
	id: string
	title: string
	address: string
	category: string
	type: number
	location: Location
	adcode: number
	province: string
	city: string
	district: string
}

export interface Location {
	lat: number
	lng: number
}
export interface mapKeywords {
	keyword: string
}
