import Editor from "@/lib/wangEditor"
import brush from "@/assets/images/backstage/brush.png"

let isBrushOn = false;
let targetDom: any = null
let nodeArray: any = []

const tagList = ["p", "div", "li", "ul", "ol", "dt", "dd", 'dl']
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
  if (!dom) return
  const tagName = dom.tagName.toLowerCase()
  if (tagList.includes(tagName)) {
    const spanArray = Array.from(dom.attributes)
    if (spanArray.length === 0) return
    nodeArray.push({
      tagName: "span",
      attributes: spanArray.map((i: any) => {
        return {
          name: i.name,
          value: i.value
        }
      })
    })
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
  getAllStyle(targetDom)
}

function addStyle(text: any, nodeArray: any) {
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

export default class extends Editor.BtnMenu {
  constructor(editor: Editor) {

    const $elem = Editor.$(
      `<div class="w-e-menu" data-title="格式刷">
        <img src="${brush}" style="width: 25px"/>
      </div>`
    )
    super($elem, editor)
  }

  clickHandler() {
    const editor = this.editor
    if (isBrushOn) {
      this.$elem.removeClass('w-b-active')
    } else {
      const $elem = editor.selection.getSelectionContainerElem().elems[0]
      parseDom($elem);
      this.$elem.addClass('w-b-active')
    }
    isBrushOn = !isBrushOn;
  }
  tryChangeActive() {
    const editor = this.editor
    const isSeleEmpty = editor.selection.isSelectionEmpty()
    // 格式刷开启的情况下 判断有选中内容在执行
    if (isBrushOn && !isSeleEmpty) {
      if (nodeArray.length > 0) {
        const $selectionText = editor.selection.getSelectionText()
        let newDom = addStyle($selectionText, nodeArray);
        editor.cmd.do('insertHTML', newDom.outerHTML);
      } else {
        isBrushOn = false;
        this.$elem.removeClass('w-b-active')
      }
    }
  }
}

export const menuBrush = "brushMenuKey"
