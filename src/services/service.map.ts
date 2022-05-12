import { mapKeywords, SearchSuggestion } from "@/interfaces/map.interface"
import { get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	getSearchSuggestion(params: mapKeywords) {
		return get<SearchSuggestion>({
			url: `${urlFunc.requestHost()}/admin/map/suggestion`,
			params
		})
	}
}
