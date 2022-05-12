import Editor from "@/lib/wangEditor"
import { IndentationOptions } from "@/lib/wangEditor/config/menus"
import { DomElement } from "@/lib/wangEditor/utils/dom-core"
import clear from "@/assets/images/backstage/clear.png"

export default class extends Editor.BtnMenu {
  constructor(editor: Editor) {
    const $elem = Editor.$(
      `<div class="w-e-menu" data-title="清除格式">
        <img src="${clear}" style="width: 18px"/>
      </div>`
    )
    super($elem, editor)
  }



  clickHandler() {
    const editor = this.editor
    // editor.config.pasteFilterStyle = true

    var isSeleEmpty = editor.selection.isSelectionEmpty();
    var selectionText = editor.selection.getSelectionText();

    if (!isSeleEmpty) {
      editor.cmd.do('insertHTML', `<p>${selectionText}</p>`);
    }
    // let str = editor.txt.html();
    // console.log("🚀 ~ file: clear.editor.ts ~ line 32 ~ extends ~ clickHandler ~ str", str)
  }
  tryChangeActive() {
  }
}
export const menuClear = "clearMenuKey"
