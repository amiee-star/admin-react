let targetDom = null
let nodeArray: any = []
const tagList = ["p", "div", "li", "ul", "ol", "dt", "dd", 'dl', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const emptyTagList = ['IMG', 'BR', 'HR', 'INPUT']

function getTargetDom(dom: any) {
	for (let i of dom.childNodes) {
		if (emptyTagList.includes(i.tagName)) return
		if (i.nodeType === 3 && i.nodeValue && i.nodeValue.trim() !== "") {
			targetDom = dom
			return
		}
	}
	getTargetDom(dom.children[0])
}

function getAllStyle(dom: any) {
	const tagName = dom.tagName.toLowerCase()
	if (tagList.includes(tagName)) {
    console.log(dom.attributes)
		nodeArray.push({
			tagName: "span",
			attributes: Array.from(dom.attributes).map((i: any) => {
				return {
					name: i.name,
					value: i.value
				}
			})
		})
		return
	} else {
		nodeArray.push({
			tagName: tagName,
			attributes: Array.from(dom.attributes).map((i: any) => {
				return {
					name: i.name,
					value: i.value
				}
			})
		})
		getAllStyle(dom.parentNode)
	}
}

function parseDom(dom: any) {
  nodeArray = []
	getTargetDom(dom)
	getAllStyle(dom)
  const arr = nodeArray.filter((item:any) => item.tagName !== "span" || item.attributes.length > 0)
	return arr
}

export function addStyle(text: any, nodeArray: any) {
	let currentNode: any = null
	nodeArray.forEach((ele: any, index: any) => {
		let node = document.createElement(ele.tagName)
		for (const attr of ele.attributes) {
			node.setAttribute(attr.name, attr.value)
		}
		if (index === 0) {
			node.innerText = text
			currentNode = node
		} else {
			node.appendChild(currentNode)
			currentNode = node
		}
	})
	return currentNode
}

export default parseDom
